export const getProductUpdateAlertTemplate = (
    userName: string,
    productName: string,
    productCategory: string,
    productUrl: string,
    updatedFields: string[]
) => {
    // ✅ LÓGICA INTACTA: Solo actualicé los valores por defecto para la nueva marca y paleta
    const brandName = process.env.BRAND_NAME || 'Pretty Witches';
    const brandColor = process.env.BRAND_COLOR || '#3D2B1F'; // Cacao oscuro
    const accentColor = '#C9A961'; // Dorado Champagne
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_APP_URL || 'https://www.prettywitches.com.ar';
    const tumarcaUrl = 'https://www.tumarca.ar';

    const fieldsText = updatedFields.length === 1
        ? updatedFields[0]
        : updatedFields.slice(0, -1).join(', ') + ' y ' + updatedFields[updatedFields.length - 1];

    return {
        subject: `🔄 Actualización en ${brandName}: ${productName}`,
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
    .main-card { max-width: 560px; margin: 0 auto; background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E8DFD0; box-shadow: 0 10px 30px rgba(61, 43, 31, 0.04); overflow: hidden; }
    .header { padding: 32px 32px 0 32px; text-align: center; }
    .header h1 { color: #3D2B1F; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: -0.02em; }
    .header-line { width: 40px; height: 3px; background-color: #C9A961; margin: 16px auto 0 auto; border-radius: 2px; }
    .body-content { padding: 32px; }
    .product-box { background-color: #F5F3FF; border-left: 3px solid #C9A961; border-radius: 12px; padding: 24px; margin: 24px 0; }
    .product-category { margin: 0 0 8px; font-size: 11px; color: #8B6F47; text-transform: uppercase; font-weight: 700; letter-spacing: 0.15em; }
    .product-name { margin: 0 0 20px; color: #3D2B1F; font-size: 22px; font-weight: 600; }
    .update-info { background-color: #FAF7F2; border: 1px solid #E8DFD0; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center; }
    .update-text { margin: 0; color: #3D2B1F; font-size: 14px; font-weight: 500; }
    .update-highlight { color: #8B6F47; font-weight: 700; }
    .cta-button { display: inline-block; background-color: #3D2B1F; color: #FFFFFF !important; padding: 14px 32px; text-decoration: none; border-radius: 9999px; font-weight: 600; font-size: 14px; letter-spacing: 0.05em; }
    .footer { background-color: #FAF7F2; padding: 24px 32px; text-align: center; border-top: 1px solid #E8DFD0; border-radius: 0 0 20px 20px; }
    .footer-brand { color: #8B6F47; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 8px 0; }
    .footer-copy { color: #A8A29E; font-size: 12px; margin: 0 0 16px 0; line-height: 1.5; }
    .footer-dev { font-size: 12px; color: #A8A29E; margin: 0; }
    .footer-dev a { color: #3D2B1F; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-card">
      
      <!-- Encabezado Elegante -->
      <div class="header">
        <h1>🔄 Hemos actualizado una pieza</h1>
        <div class="header-line"></div>
      </div>

      <!-- Contenido Principal -->
      <div class="body-content">
        <p style="font-size: 15px; line-height: 1.6; color: #6B5B4F; margin-top: 0;">
          Hola <strong style="color: #3D2B1F;">${userName}</strong>,
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #6B5B4F; margin-bottom: 0;">
          Hay novedades importantes en una de las creaciones que te interesan:
        </p>
        
        <!-- Caja del Producto Premium -->
        <div class="product-box">
          <p class="product-category">${productCategory}</p>
          <h2 class="product-name">${productName}</h2>
          
          <!-- Información de la Actualización -->
          <div class="update-info">
            <p class="update-text">
              ✨ Se actualizó: <span class="update-highlight">${fieldsText}</span>
            </p>
          </div>
          
          <div style="text-align: center;">
            <a href="${productUrl}" class="cta-button">Ver los cambios →</a>
          </div>
        </div>

        <p style="font-size: 14px; color: #8B6F47; line-height: 1.6; margin-bottom: 0; text-align: center;">
          Te invitamos a descubrir las mejoras que hemos realizado para ti.
        </p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p class="footer-brand">${brandName}</p>
        <p class="footer-copy">© ${new Date().getFullYear()} · Hecho con dedicación y buena energía 💜</p>
        <p class="footer-dev">
          Desarrollado por <a href="${tumarcaUrl}">www.tumarca.ar</a>
        </p>
      </div>

    </div>
  </div>
</body>
</html>`,
        text: `¡Actualización en ${brandName}!\n\nHola ${userName}, hemos actualizado ${fieldsText} del producto: ${productName} (${productCategory}).\nMira los cambios aquí: ${productUrl}\n\n${brandName} · Hecho con dedicación y buena energía 💜\nDesarrollado por www.tumarca.ar`
    };
};