// src/lib/config.ts  
// configurar sendmail.router.ts para enviar correos electrónicos desde la aplicación.

export const siteConfig = {
  // 🏢 Datos de la Marca
  companyUrl : 'www.prettywitches.com.ar',
  compareUrl : 'https://www.prettywitches.com.ar',
  companyName: 'Pretty Witches',
  description: 'Productos personalizados con amor para hacer tus celebraciones inolvidables. Sublimación, decoración y detalles únicos en 3D.',
  
  // 📞 Contacto
  whatsapp: '5491132835127',
  whatsappMessage: 'Hola, me interesa consultar por un producto personalizado',
  email: 'hola.prettywitches@gmail.com',
  address: 'Buenos Aires, Argentina',

  // 🖼️ Assets (Logos, Favicons)
  logo: {
    src: '/img/logo-pretty1-removebg-preview1.png',
    alt: 'Logo de Pretty Witches',
    width: 160,
    height: 70,
  },

  // 🌐 Redes Sociales
  socials: {
    instagram: 'https://instagram.com/pretty.witches_', // Pon el usuario real
    facebook: 'https://facebook.com/pretty.witches',
    tiktok: 'https://tiktok.com/@pretty.witches',
  },


} as const; // 'as const' hace que TypeScript infiera los tipos exactos y te avise si escribes mal una clave