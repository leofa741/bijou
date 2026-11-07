   'use client';

   import { useEffect, useState } from 'react';

   export default function PWAInstaller() {
     const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

     useEffect(() => {
       // 1. Registrar el Service Worker
       if ('serviceWorker' in navigator) {
         navigator.serviceWorker.register('/sw.js').then((registration) => {
           console.log('SW registrado con éxito:', registration);
         }).catch((error) => {
           console.log('Fallo en el registro del SW:', error);
         });
       }

       // 2. Escuchar el evento de instalación
       const handler = (e: any) => {
         e.preventDefault();
         setDeferredPrompt(e); // Guarda el evento para mostrarlo cuando quieras
       };
       
       window.addEventListener('beforeinstallprompt', handler);

       return () => window.removeEventListener('beforeinstallprompt', handler);
     }, []);

     // Opcional: Si quieres un botón personalizado para instalar
     
     if (deferredPrompt) {
       return (
         <button 
           onClick={() => {
             deferredPrompt.prompt();
             deferredPrompt.userChoice.then((choiceResult: any) => {
               if (choiceResult.outcome === 'accepted') {
                 console.log('Usuario aceptó la instalación');
               }
               setDeferredPrompt(null);
             });
           }}
           className="fixed bottom-24 right-6 bg-[#3D2B1F] text-white px-4 py-2 rounded-full shadow-lg z-50"
         >
           📲 Instalar App
         </button>
       );
     }
     

     return null;
   }