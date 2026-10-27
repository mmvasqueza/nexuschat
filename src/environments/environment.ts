/**
 * VARIABLES DE ENTORNO - DESARROLLO
 * ---------------------------------
 * Centraliza toda configuración sensible/por-ambiente:
 *  - apiUrl: dónde vive el backend de pagos (ver /backend-dotnet).
 *  - stripePublicKey: clave PUBLICA de Stripe (pk_test_... / pk_live_...).
 *    Es segura en el navegador; la clave secreta NUNCA va aquí.
 *
 * En CI/CD se genera environment.prod.ts con valores de producción.
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  stripePublicKey: ''
};
