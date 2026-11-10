export const getWelcomeEmailTemplate = (userName: string, email: string) => {
  // ✅ LÓGICA INTACTA: Solo actualicé los valores por defecto para la nueva marca y paleta
  const brandName = process.env.BRAND_NAME || 'Pretty Witches';
  const brandColor = process.env.BRAND_COLOR || '#3D2B1F'; // Cacao oscuro
  const brandGradient = process.env.BRAND_GRADIENT || 'linear-gradient(135deg, #F5F3FF, #FAF7F2)'; // Degradado sutil lilá-crema
  const brandLocation = process.env.BRAND_LOCATION || 'Buenos Aires, Argentina';
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_APP_URL || 'https://www.prettywitches.com.ar';
  const displayName = userName || email.split('@')[0];

  return {
    subject: `✨ ¡Bienvenido a ${brandName} + Alerta de Novedades activada!`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    /* Estilos base para clientes de correo que soportan <style> */
    body { margin: 0; padding: 0; background-color: #FAF7F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #FAF7F2; padding: 40px 20px; }
    .main-card { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E8DFD0; box-shadow: 0 10px 30px rgba(61, 43, 31, 0.04); overflow: hidden; }
    .header { padding: 40px 32px 32px 32px; text-align: center; background-color: #F5F3FF; border-bottom: 1px solid #E8DFD0; }
    .header h1 { color: #3D2B1F; margin: 0 0 8px; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; }
    .header-sub { color: #8B6F47; margin: 0; font-size: 15px; font-weight: 500; }
    .body-content { padding: 32px; }
    .info-card { background-color: #FAF7F2; border-left: 3px solid #C9A961; border-radius: 12px; padding: 24px; margin: 24px 0; }
    .badge { display: inline-block; background-color: #3D2B1F; color: #FAF7F2; padding: 6px 16px; border-radius: 9999px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 16px; }
    .info-title { margin: 0 0 12px; font-weight: 600; color: #3D2B1F; font-size: 16px; }
    .info-detail { color: #6B5B4F; margin: 6px 0 0; font-size: 14px; line-height: 1.5; }
    .cta-button { display: inline-block; background-color: #3D2B1F; color: #FFFFFF !important; padding: 16px 36px; text-decoration: none; border-radius: 9999px; font-weight: 600; margin: 16px 0; font-size: 15px; letter-spacing: 0.05em; box-shadow: 0 10px 25px -5px rgba(61, 43, 31, 0.2); }
    .quote { margin-top: 32px; font-size: 15px; color: #8B6F47; line-height: 1.6; text-align: center; font-style: italic; border-top: 1px solid #E8DFD0; padding-top: 24px; }
    .footer { background-color: #FAF7F2; padding: 24px 32px; text-align: center; border-top: 1px solid #E8DFD0; }
    .footer-brand { color: #8B6F47; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 8px 0; }
    .footer-copy { color: #A8A29E; font-size: 12px; margin: 0; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-card">
      
      <!-- Encabezado Elegante -->
      <div class="header">
        <h1>✨ ¡Bienvenido a ${brandName}!</h1>
        <p class="header-sub">Tu cuenta está lista para descubrir piezas únicas</p>
      </div>

      <!-- Contenido Principal -->
      <div class="body-content">
        <p style="font-size: 15px; line-height: 1.6; color: #6B5B4F; margin-top: 0;">
          Hola <strong style="color: #3D2B1F;">${displayName}</strong>,
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #6B5B4F; margin-bottom: 0;">
          Gracias por registrarte. Para que no te pierdas nada, <strong>ya activamos una alerta de novedades</strong> personalizada para vos:
        </p>
        
        <!-- Tarjeta de Información Premium -->
        <div class="info-card">
          <span class="badge">🔔 Alerta de Novedades</span>
          <p class="info-title">Nuevas piezas de bijouterie y macramé</p>
          <p class="info-detail">📅 <strong>Frecuencia:</strong> Semanal</p>
          <p class="info-detail">🎁 <strong>Beneficio:</strong> Acceso anticipado y ofertas exclusivas</p>
        </div>

        <p style="font-size: 15px; line-height: 1.6; color: #6B5B4F; margin-bottom: 0;">
          Recibirás un email cada semana con las últimas creaciones y descuentos especiales. Podés gestionar tus preferencias en cualquier momento.
        </p>
        
        <div style="text-align: center; margin-top: 24px;">
          <a href="${baseUrl}/perfil/alertas" class="cta-button">Gestionar mis alertas →</a>
        </div>

        <p class="quote">
          "¿Tenés una idea en mente? Respondé este email y te ayudamos a hacerla realidad."
        </p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p class="footer-brand">${brandName} · ${brandLocation}</p>
        <p class="footer-copy">© ${new Date().getFullYear()} · Hecho con dedicación y buena energía 💜</p>
      </div>

    </div>
  </div>
</body>
</html>`,
    text: `
¡Bienvenido a ${brandName}!

Hola ${displayName},

🔔 Alerta de Novedades activada:
• Nuevas piezas de bijouterie y macramé
• 📅 Frecuencia: Semanal
• 🎁 Beneficio: Acceso anticipado y ofertas exclusivas

Recibirás un email cada semana con las últimas creaciones y descuentos especiales.


"¿Tenés una idea en mente? Respondé este email y te ayudamos a hacerla realidad."

---
${brandName} · ${brandLocation} · Hecho con dedicación y buena energía 💜
    `.trim()
  };
};