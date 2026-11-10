import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// ─────────────────────────────────────────────────────────────
// 🔹 TIPOS PARA EL FORMULARIO (Pretty Witches)
// ─────────────────────────────────────────────────────────────
interface ContactForm {
  name: string;
  contact: string;
  interest: 'general' | 'sublimacion' | 'cumpleaños' | 'remeras' | 'mayorista';
  message: string;
  subject?: string;
}

// ─────────────────────────────────────────────────────────────
// 🔹 MAPEOS LEGIBLES PARA EL EMAIL
// ─────────────────────────────────────────────────────────────
const interestLabels: Record<string, string> = {
  general: 'Consulta general',
  sublimacion: 'Presupuesto de sublimación',
  cumpleaños: 'Decoración de cumpleaños',
  remeras: 'Remeras personalizadas',
  mayorista: 'Ventas mayoristas',
};

// ─────────────────────────────────────────────────────────────
// 🔹 HANDLER PRINCIPAL
// ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body: ContactForm = await req.json();
    const { name, contact, interest, message } = body;

    if (!name?.trim() || !contact?.trim() || !message?.trim() || !interest) {
      return NextResponse.json(
        { success: false, message: 'Por favor, completá los campos obligatorios.' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: process.env.MAILER_SERVICE || 'gmail',
      host: process.env.MAILER_HOST,
      port: parseInt(process.env.MAILER_PORT || '587'),
      secure: process.env.MAILER_SECURE === 'true',
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_SECRET_KEY,
      },
    });

    await transporter.verify();

    const emailContent = buildEmailContent(body);

    const mailOptions = {
      // ✅ CAMBIO CLAVE: Nombre del remitente actualizado
      from: `"Pretty Witches" <${process.env.MAILER_EMAIL}>`,
      to: process.env.MAILER_EMAIL,
      cc: process.env.MAILER_CC ? process.env.MAILER_CC.split(',').map((e: string) => e.trim()) : undefined,
      subject: `✨ Nueva consulta: ${interestLabels[interest]} - ${name}`,
      html: emailContent,
      text: buildTextContent(body),
    };

    await transporter.sendMail(mailOptions);

    console.log(`✅ Email enviado: ${interest} - ${contact}`);

    return NextResponse.json({ 
      success: true, 
      message: '¡Mensaje enviado con éxito! Te responderemos a la brevedad.' 
    });

  } catch (error) {
    console.error('❌ Error al enviar el correo:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Ocurrió un error al enviar tu consulta. Por favor, intentá de nuevo o contactanos por WhatsApp.' 
      },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────
// 🔹 PLANTILLA HTML PREMIUM (Paleta Alila Cremoso + Lujo Silencioso)
// ─────────────────────────────────────────────────────────────
function buildEmailContent(data: ContactForm): string {
  const { name, contact, interest, message } = data;
  
  const styles = {
    container: 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 0; background-color: #FAF7F2;',
    header: 'background-color: #F5F3FF; padding: 32px 24px; text-align: center; border-bottom: 1px solid #E8DFD0;',
    headerTitle: 'color: #3D2B1F; font-size: 24px; font-weight: 600; margin: 0 0 8px 0; letter-spacing: -0.02em;',
    headerSubtitle: 'color: #8B6F47; font-size: 14px; margin: 0; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;',
    body: 'background: #FFFFFF; padding: 32px 24px; border: 1px solid #E8DFD0; border-top: none;',
    card: 'background: #FAF7F2; padding: 20px; border-radius: 12px; margin-bottom: 16px; border: 1px solid #E8DFD0;',
    label: 'color: #8B6F47; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 6px 0; font-weight: 700;',
    value: 'color: #3D2B1F; font-size: 15px; font-weight: 600; margin: 0 0 12px 0;',
    messageBox: 'background: #FFFFFF; padding: 20px; border-radius: 8px; border-left: 3px solid #C9A961; margin: 16px 0;',
    messageText: 'color: #3D2B1F; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;',
    footer: 'text-align: center; padding: 24px; color: #8B6F47; font-size: 12px; background-color: #FAF7F2; border-top: 1px solid #E8DFD0;',
    badge: 'display: inline-block; background: #3D2B1F; color: #FAF7F2; padding: 6px 16px; border-radius: 9999px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;',
    divider: 'height: 1px; background: #E8DFD0; margin: 24px 0;',
    button: 'display: inline-block; background: #3D2B1F; color: #FAF7F2; padding: 14px 36px; text-decoration: none; border-radius: 9999px; font-weight: 600; font-size: 14px; letter-spacing: 0.05em;',
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nueva consulta - Pretty Witches</title>
    </head>
    <body style="${styles.container}">
      
      <div style="${styles.header}">
        <h1 style="${styles.headerTitle}">✨ Nueva Consulta</h1>
        <p style="${styles.headerSubtitle}">Pretty Witches - Productos Personalizados</p>
      </div>

      <div style="${styles.body}">
        
        <div style="text-align: center; margin-bottom: 28px;">
          <span style="${styles.badge}">${interestLabels[interest] || interest}</span>
        </div>

        <div style="${styles.card}">
          <p style="${styles.label}">Nombre completo</p>
          <p style="${styles.value}">${name}</p>
          
          <p style="${styles.label}">Email o Teléfono de contacto</p>
          <p style="${styles.value}">${contact}</p>
        </div>

        <div style="${styles.card}">
          <p style="${styles.label}">Mensaje del cliente</p>
          <div style="${styles.messageBox}">
            <p style="${styles.messageText}">${message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>

        <div style="${styles.divider}"></div>

        <div style="text-align: center; margin-top: 28px;">
          <a href="mailto:${contact.includes('@') ? contact : ''}?subject=Re: Consulta Pretty Witches" 
             style="${styles.button}">
            Responder a ${name}
          </a>
        </div>

      </div>

      <div style="${styles.footer}">
        <p style="margin: 0 0 8px 0; font-weight: 700; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;">Pretty Witches</p>
        <p style="margin: 0 0 4px 0;">📧 ${process.env.MAILER_EMAIL}</p>
        <p style="margin: 0;">Este mensaje fue enviado desde el formulario de contacto web.</p>
      </div>

    </body>
    </html>
  `;
}

// ─────────────────────────────────────────────────────────────
// 🔹 VERSIÓN TEXTO PLANO (FALLBACK)
// ─────────────────────────────────────────────────────────────
function buildTextContent(data: ContactForm): string {
  const { name, contact, interest, message } = data;
  
  return `
NUEVA CONSULTA - PRETTY WITCHES ✨
========================================================

INTERÉS: ${interestLabels[interest] || interest}

CONTACTO:
• Nombre: ${name}
• Email/Teléfono: ${contact}

MENSAJE:
${message}

---
Responder a: ${contact}
Enviado desde: Formulario web Pretty Witches
  `.trim();
}