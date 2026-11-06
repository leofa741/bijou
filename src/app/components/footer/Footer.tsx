'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/app/lib/config';
import { FaGem, FaLeaf, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaInstagram, FaFacebook, FaTiktok, FaShareAlt, FaCheck } from 'react-icons/fa';

interface FooterLink {
  label: string;
  href: string;
}

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isCopied, setIsCopied] = useState(false);
  
  // ✅ Estados para las categorías dinámicas
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/public/categorias');
        const data = await res.json();
        if (data.success) {
          setFooterLinks(data.footerLinks);
        }
      } catch (error) {
        console.error('Error cargando categorías del footer:', error);
      } finally {
        setLoadingLinks(false);
      }
    };
    fetchCategories();
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: siteConfig.companyName,
          text: `Mirá estas piezas artesanales increíbles de ${siteConfig.companyName} 💜✨`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error al compartir:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      } catch (err) {
        console.error('Error al copiar:', err);
      }
    }
  };

  const whatsappLink = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`;

  return (
    <footer className="relative bg-gradient-to-br from-stone-100 via-violet-50/50 to-purple-100/50 text-stone-700 border-t border-violet-100">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
          
          {/* ───────── COLUMNA 1: MARCA Y ESENCIA ───────── */}
          <div className="space-y-6">
            <Link href="/" className="inline-block group">
              <Image
                src={siteConfig.logo.src}
                alt={siteConfig.logo.alt}
                width={siteConfig.logo.width}
                height={siteConfig.logo.height}
                className="drop-shadow-sm group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
            <p className="text-sm text-stone-600 leading-relaxed max-w-xs font-light">
              {siteConfig.description}
            </p>
            
            <button
              onClick={handleShare}
              disabled={isCopied}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold shadow-md transition-all duration-300 ${
                isCopied 
                  ? 'bg-emerald-500 text-white cursor-default scale-[1.02]' 
                  : 'bg-violet-600 text-white hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-200 hover:scale-[1.02]'
              }`}
            >
              {isCopied ? (
                <><FaCheck className="w-4 h-4" /> ¡Enlace copiado!</>
              ) : (
                <><FaShareAlt className="w-4 h-4" /> Compartir Tienda</>
              )}
            </button>
          </div>

          {/* ───────── COLUMNA 2: CATEGORÍAS DINÁMICAS ───────── */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-violet-800 font-bold mb-6 flex items-center gap-2">
              <FaLeaf className="w-4 h-4 text-violet-400" />
              Nuestras Creaciones
            </h3>
            <ul className="space-y-4">
              {loadingLinks ? (
                // Skeleton loader elegante mientras carga
                [1, 2, 3, 4].map((i) => (
                  <li key={i} className="animate-pulse flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-200" />
                    <span className="h-4 bg-violet-200 rounded w-24" />
                  </li>
                ))
              ) : footerLinks.length > 0 ? (
                footerLinks.map((item) => (
                  <li key={item.href}>
                    <Link 
                      href={item.href} 
                      className="text-stone-600 hover:text-violet-700 transition-all duration-300 inline-flex items-center gap-3 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-300 group-hover:bg-violet-600 group-hover:scale-125 transition-all duration-300" />
                      <span className="font-medium text-sm capitalize">{item.label}</span>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-stone-500 text-sm italic">Próximamente más categorías</li>
              )}
            </ul>
          </div>

          {/* ───────── COLUMNA 3: CONTACTO PREMIUM ───────── */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-violet-800 font-bold mb-6 flex items-center gap-2">
              <FaGem className="w-4 h-4 text-violet-400" />
              Hablemos
            </h3>
            <div className="space-y-5">
              {/* WhatsApp */}
              <Link 
                href={whatsappLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-start gap-4 group p-3 -mx-3 rounded-xl hover:bg-white/60 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 group-hover:scale-110 transition-all duration-300 shadow-sm border border-emerald-100">
                  <FaWhatsapp className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">WhatsApp</span>
                  <span className="text-sm font-medium text-stone-800 group-hover:text-emerald-700 transition-colors duration-300">
                    +{siteConfig.whatsapp}
                  </span>
                </div>
              </Link>

              {/* Email */}
              <Link 
                href={`mailto:${siteConfig.email}`} 
                className="flex items-start gap-4 group p-3 -mx-3 rounded-xl hover:bg-white/60 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 group-hover:bg-violet-100 group-hover:scale-110 transition-all duration-300 shadow-sm border border-violet-100">
                  <FaEnvelope className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Email</span>
                  <span className="text-sm font-medium text-stone-800 group-hover:text-violet-700 transition-colors duration-300 break-all">
                    {siteConfig.email}
                  </span>
                </div>
              </Link>

              {/* Dirección */}
              <div className="flex items-start gap-4 group p-3 -mx-3 rounded-xl hover:bg-white/60 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-100 group-hover:scale-110 transition-all duration-300 shadow-sm border border-amber-100">
                  <FaMapMarkerAlt className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Taller / Dirección</span>
                  <span className="text-sm font-medium text-stone-800">
                    {siteConfig.address}
                  </span>
                </div>
              </div>

              {/* Redes Sociales */}
              <div className="pt-6 border-t border-violet-100">
                <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold mb-4">Síguenos en redes</p>
                <div className="flex items-center gap-3">
                  {siteConfig.socials.instagram && (
                    <Link href={siteConfig.socials.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white border border-violet-100 flex items-center justify-center text-stone-500 hover:text-pink-600 hover:border-pink-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300" aria-label="Instagram">
                      <FaInstagram className="w-5 h-5" />
                    </Link>
                  )}
                  {siteConfig.socials.facebook && (
                    <Link href={siteConfig.socials.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white border border-violet-100 flex items-center justify-center text-stone-500 hover:text-blue-600 hover:border-blue-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300" aria-label="Facebook">
                      <FaFacebook className="w-5 h-5" />
                    </Link>
                  )}
                  {siteConfig.socials.tiktok && (
                    <Link href={siteConfig.socials.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white border border-violet-100 flex items-center justify-center text-stone-500 hover:text-black hover:border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300" aria-label="TikTok">
                      <FaTiktok className="w-5 h-5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ───────── LÍNEA INFERIOR ───────── */}
        <div className="mt-16 pt-8 border-t border-violet-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500 font-light">
            <p className="flex items-center gap-2">
              <span>© {currentYear}</span>
              <span className="text-violet-800 font-semibold">{siteConfig.companyName}</span>
              <span>• Todos los derechos reservados.</span>
            </p>
            <Link 
              href="https://www.tumarca.ar" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-violet-700 transition-colors inline-flex items-center gap-1.5 font-medium group bg-white/50 px-3 py-1.5 rounded-full border border-violet-100 hover:border-violet-300"
            >
              <span>Desarrollado con 💜 por TuMarca.ar</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;