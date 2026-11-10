export const getLoginAlertTemplate = (to: string) => {
    // ✅ LÓGICA INTACTA: Solo actualicé los valores por defecto para que coincidan con la nueva marca
    const brandName = process.env.BRAND_NAME || 'Pretty Witches';
    const brandColor = process.env.BRAND_COLOR || '#3D2B1F'; // Cacao oscuro (reemplaza al rosa fuerte)
    const accentColor = '#C9A961'; // Dorado Champagne para detalles premium
    const brandLocation = process.env.BRAND_LOCATION || 'Buenos Aires, Argentina';
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_APP_URL || 'https://www.prettywitches.com.ar';
    const tumarcaUrl = 'https://www.tumarca.ar';

    return {
        subject: `🔔 Nuevo inicio de sesión detectado en ${brandName}`,
        html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF7F2; padding: 40px 20px; width: 100%;">
        <div style="max-width: 560px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; border: 1px solid #E8DFD0; box-shadow: 0 10px 30px rgba(61, 43, 31, 0.04); overflow: hidden;">
          
          <!-- Contenido Principal -->
          <div style="padding: 40px 32px;">
            <h2 style="color: ${brandColor}; margin-top: 0; margin-bottom: 16px; font-size: 22px; font-weight: 600; letter-spacing: -0.02em;">
              ¡Hola!
            </h2>
            <p style="color: #6B5B4F; line-height: 1.6; font-size: 15px; margin-bottom: 24px;">
              Se ha detectado un nuevo inicio de sesión en tu cuenta de <strong style="color: ${brandColor};">${brandName}</strong>.
            </p>
            
            <!-- Caja de Información con estética Premium (Lilá suave + borde dorado) -->
            <div style="background: #F5F3FF; padding: 20px; border-radius: 12px; border-left: 3px solid ${accentColor}; margin-bottom: 24px;">
              <p style="margin: 0 0 12px 0; color: #3D2B1F; font-size: 14px; font-weight: 500;">
                <span style="color: #8B6F47; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 4px; font-weight: 600;">Email asociado</span>
                ${to}
              </p>
              <p style="margin: 0; color: #3D2B1F; font-size: 14px; font-weight: 500;">
                <span style="color: #8B6F47; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 4px; font-weight: 600;">Fecha y hora</span>
                ${new Date().toLocaleString("es-AR", { dateStyle: 'full', timeStyle: 'short' })}
              </p>
            </div>

            <p style="color: #6B5B4F; line-height: 1.6; font-size: 15px; margin-bottom: 0;">
              Si no fuiste vos, te recomendamos cambiar tu contraseña de inmediato o contactarnos a la brevedad.
            </p>
          </div>

          <!-- Footer Elegante -->
          <div style="background-color: #FAF7F2; padding: 24px 32px; border-top: 1px solid #E8DFD0; text-align: center;">
            <p style="color: #8B6F47; font-size: 12px; margin: 0 0 8px 0; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">
              ${brandName} · ${brandLocation}
            </p>
            <p style="font-size: 12px; color: #A8A29E; margin: 0; line-height: 1.5;">
              Desarrollado con 💜 por <a href="${tumarcaUrl}" style="color: ${brandColor}; text-decoration: none; font-weight: 600;">www.tumarca.ar</a><br>
           </p>
          </div>

        </div>
      </div>
    `
    };
};