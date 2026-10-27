/**
 * BACKEND DE PAGOS - ASP.NET CORE 8 (Minimal API)
 * ------------------------------------------------
 * APORTE EN LA ARQUITECTURA GENERAL:
 *   Angular (CheckoutComponent + PaymentService)
 *     -- POST /api/payments/checkout --> este backend --> Stripe API
 *   Stripe Checkout (el cliente paga con tarjeta ahí, PCI-DSS)
 *     -- webhook /api/payments/webhook --> este backend --> activa suscripción
 *
 * REGLAS DE SEGURIDAD IMPLEMENTADAS:
 *  1. El precio lo calcula ESTE servidor a partir del planId; el total
 *     enviado por el navegador se ignora (anti-manipulación).
 *  2. La secret key de Stripe nunca sale de aquí (config/appsettings).
 *  3. El webhook valida la firma HMAC de Stripe (anti-falsificación).
 *  4. CORS restringido al origen del frontend Angular.
 */
using Stripe;
using Stripe.Checkout;

var builder = WebApplication.CreateBuilder(args);

// Habilitar servicios de CORS en el contenedor de dependencias
builder.Services.AddCors();

var app = builder.Build();

// ------------------------------------------------------------------
// CORS: solo el frontend Angular en desarrollo puede llamarnos.
// En producción sustituir por el dominio real (https://tudominio.com)
// ------------------------------------------------------------------
app.UseCors(policy => policy
    .WithOrigins("http://localhost:4200")
    .AllowAnyHeader()
    .AllowAnyMethod());

// ------------------------------------------------------------------
// CONFIGURACIÓN DE STRIPE
// Secret key (sk_test_... / sk_live_...) SOLO en servidor.
// ------------------------------------------------------------------
StripeConfiguration.ApiKey = app.Configuration["STRIPE_SECRET_KEY"]
    ?? throw new InvalidOperationException("Falta STRIPE_SECRET_KEY en configuración.");

// ------------------------------------------------------------------
// GET informativo para verificar en el navegador que el API está viva
// ------------------------------------------------------------------
app.MapGet("/", () => Results.Ok(new
{
    status = "online",
    service = "NexusChat Payment API (.NET 8)",
    endpoints = new[]
    {
        "POST /api/payments/checkout",
        "POST /api/payments/webhook"
    }
}));

app.MapGet("/api/payments/checkout", () => Results.Ok(new
{
    message = "Este endpoint requiere peticiones POST con el cuerpo: { planId: 'multiagente' | 'plus', agents: 1..500 }.",
    ejemplo = new { planId = "multiagente", agents = 2 }
}));

// ==================================================================
// POST /api/payments/checkout
// Crea una "Checkout Session" de suscripción mensual en Stripe y
// devuelve su id. El frontend redirige al usuario al checkout
// hospedado de Stripe con ese id (ver PaymentService.pay() en Angular).
// ==================================================================
app.MapPost("/api/payments/checkout", async (CheckoutRequest req) =>
{
    // --- 1) VALIDACIÓN Y PRECIO EN SERVIDOR (fuente de verdad) ---
    // Catálogo espejo del frontend (plans.data.ts). En producción este
    // diccionario se reemplaza por una consulta a la base de datos.
    var pricePerAgentCents = req.PlanId switch
    {
        "multiagente" => 1500m,   // $15.00 USD / agente / mes
        "plus"        => 2000m,   // $20.00 USD / agente / mes
        _ => Results.BadRequest(new { error = "Plan inválido" }) is var _
             ? throw new InvalidOperationException("Plan inválido")
             : 0m
    };

    if (req.Agents is < 1 or > 500)
        return Results.BadRequest(new { error = "Número de agentes no permitido." });

    // --- 2) CREAR LA SESIÓN DE COBRO EN STRIPE ---
    var options = new SessionCreateOptions
    {
        Mode = "subscription",        // cobro recurrente (suscripción SaaS)
        SuccessUrl = "http://localhost:4200/es/precios?pago=exito&sesion={CHECKOUT_SESSION_ID}",
        CancelUrl  = $"http://localhost:4200/es/checkout/{req.PlanId}",
        ClientReferenceId = req.PlanId,   // nos permite reconciliar el webhook
        Metadata = new Dictionary<string, string>
        {
            ["planId"] = req.PlanId,
            ["agents"] = req.Agents.ToString()
        },
        LineItems =
        [
            new SessionLineItemOptions
            {
                Quantity = req.Agents,
                PriceData = new SessionLineItemPriceDataOptions
                {
                    UnitAmountDecimal = pricePerAgentCents,  // en CENTAVOS
                    Currency = "usd",
                    Recurring = new SessionLineItemPriceDataRecurringOptions
                    {
                        Interval = "month"
                    },
                    ProductData = new SessionLineItemPriceDataProductDataOptions
                    {
                        Name = $"NexusChat · Plan {req.PlanId}",
                        Description = $"Suscripción mensual · {req.Agents} agente(s)"
                    }
                }
            }
        ]
    };

    var session = await new SessionService().CreateAsync(options);

    // --- 3) DEVOLVER EL ID: el frontend hace redirectToCheckout(sessionId) ---
    return Results.Ok(new CheckoutResponse(session.Id));
})
.WithName("CreateCheckout");

// ==================================================================
// POST /api/payments/webhook
// Stripe llama aquí cuando el pago se completa. ES LA FUENTE DE
// VERDAD: nunca des por pagado un plan solo porque el usuario volvió
// a SuccessUrl; activa la suscripción AQUÍ.
// ==================================================================
app.MapPost("/api/payments/webhook", async (HttpRequest request) =>
{
    // Leemos el cuerpo crudo: la firma se valida sobre los bytes exactos
    var json = await new StreamReader(request.Body).ReadToEndAsync();
    var signatureHeader = request.Headers["Stripe-Signature"].ToString();

    Event stripeEvent;
    try
    {
        // ConstructEvent verifica la firma HMAC con el endpoint secret.
        // Sin esto, cualquiera podría fingir un pago con un POST manual.
        stripeEvent = EventUtility.ConstructEvent(
            json,
            signatureHeader,
            app.Configuration["STRIPE_WEBHOOK_SECRET"]
                ?? throw new InvalidOperationException("Falta STRIPE_WEBHOOK_SECRET."));
    }
    catch (Exception ex)
    {
        // Firma inválida: registro y 400 (Stripe reintentará solo si 5xx)
        app.Logger.LogWarning("Webhook con firma inválida: {Message}", ex.Message);
        return Results.BadRequest();
    }

    // --- PROCESAR SOLO EL EVENTO QUE NOS INTERESA ---
    if (stripeEvent.Type == "checkout.session.completed")
    {
        var session = (Session)stripeEvent.Data.Object;

        // Extraemos la metadata que pusimos al crear la sesión
        var planId = session.Metadata?["planId"] ?? "desconocido";
        var agents = session.Metadata?["agents"] ?? "1";

        // TODO (producción):
        //   1) Guardar suscripción en base de datos (EF Core)
        //   2) Provisionar N agentes en la cuenta del cliente
        //   3) Enviar email de bienvenida con datos de acceso
        //   4) Idempotencia: verificar que session.Id no fue procesado antes
        app.Logger.LogInformation(
            "✓ Suscripción activada: plan={Plan}, agentes={Agents}, sesion={Id}",
            planId, agents, session.Id);
    }

    // Responder 200 rápido: si Stripe recibe 5xx reintenta el evento
    return Results.Ok();
})
.WithName("StripeWebhook");

app.Run();

/// <summary>Payload enviado por el frontend Angular (PaymentService).</summary>
public record CheckoutRequest(string PlanId, int Agents);

/// <summary>Respuesta: el id de sesión que Stripe.js necesita para redirigir.</summary>
public record CheckoutResponse(string SessionId);
