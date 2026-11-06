'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/app/lib/config';
import { FaHeart, FaGem, FaLeaf, FaQuoteLeft, FaArrowRight, FaCheck, FaCrown } from 'react-icons/fa';

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const timeline = [
    { 
      year: '2019', 
      title: 'El Primer Nudo', 
      desc: 'Comenzamos en un pequeño rincón, creando nuestras primeras piezas de macramé, buscando conectar la naturaleza con el diseño de alta gama.' 
    },
    { 
      year: '2021', 
      title: 'La Energía de la Amatista', 
      desc: 'Incorporamos piedras naturales seleccionadas una a una, dando origen a nuestra línea de bijouterie de autor con propósito y significado.' 
    },
    { 
      year: '2023', 
      title: 'Crecimiento Artesanal', 
      desc: 'Expandimos nuestro atelier y nuestra comunidad de clientas que valoran lo exclusivo, lo hecho a mano y lo cargado de buena energía.' 
    },
    { 
      year: '2024', 
      title: 'Tu Espacio de Creación', 
      desc: 'Hoy consolidamos una marca que combina diseño, energía y personalización, lista para crear la pieza que resuene con tu esencia.' 
    },
  ];

  const values = [
    { 
      icon: <FaLeaf className="w-6 h-6" />, 
      title: 'Materiales con Propósito', 
      desc: 'Usamos hilos naturales y piedras como la amatista, elegidas no solo por su belleza, sino por la energía y armonía que transmiten.' 
    },
    { 
      icon: <FaGem className="w-6 h-6" />, 
      title: 'Hecho a Mano con Alma', 
      desc: 'Cada nudo, cada engarce y cada detalle lleva nuestra dedicación. Ninguna pieza es idéntica a otra, porque así es la belleza de lo artesanal.' 
    },
    { 
      icon: <FaHeart className="w-6 h-6" />, 
      title: 'Conexión con tu Historia', 
      desc: 'No solo creamos accesorios. Diseñamos piezas que cuentan tu historia, se adaptan a tu estilo y te acompañan en tus momentos especiales.' 
    },
  ];

  const stats = [
    { value: '1000+', label: 'Piezas Únicas Creadas' },
    { value: '100%', label: 'Hecho a Mano' },
    { value: '5+', label: 'Años de Pasión' },
  ];

  const testimonials = [
    { 
      name: 'Sofía L.', 
      role: 'Clienta desde 2022', 
      text: 'El collar de amatista tiene una energía hermosa. Se nota el amor en cada detalle y la atención fue súper cálida y personalizada. Una verdadera joya.' 
    },
    { 
      name: 'Martina G.', 
      role: 'Clienta desde 2023', 
      text: 'Encargué un macramé personalizado para mi living y quedó exactamente como lo soñé. La calidad de los materiales y la terminación son de primer nivel.' 
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-[#3D2B1F] selection:bg-[#D4B5D4] selection:text-[#3D2B1F] overflow-x-hidden">
      
      {/* ✨ Textura cremosa sutil de fondo (igual que en Home) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015]" 
           style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}} />

      {/* Orbes de luz ambiental muy sutiles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] right-0 w-[800px] h-[800px] bg-[#D4B5D4]/20 rounded-full blur-[150px]" />
        <div className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] bg-[#C9A961]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-[#E8DFD0]/40 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-42 pb-20">
        
        {/* ═══════════════════════════════════════════════════════
            HERO SECTION - ESENCIA
            ═══════════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mt-10 mb-24 sm:mb-32">
          
          {/* Imagen limpia y elegante */}
          <div className={`relative transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative aspect-[5/5] rounded-[2rem] overflow-hidden border border-[#E8DFD0]/60 bg-white shadow-[0_20px_50px_rgba(139,115,85,0.1)]">
              <Image
                src={siteConfig.logo.src || '/img/logo-placeholder.png'}
                alt={siteConfig.companyName}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3D2B1F]/40 via-transparent to-transparent" />
            </div>
            {/* Decoración sutil de esquina dorada/alila */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-[#C9A961]/40 rounded-br-3xl hidden sm:block" />
            <div className="absolute -top-4 -left-4 w-24 h-24 border-l-2 border-t-2 border-[#D4B5D4]/60 rounded-tl-3xl hidden sm:block" />
          </div>

          {/* Contenido de texto */}
          <div className={`space-y-8 transition-all duration-1000 delay-200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div>
              <span className="text-[10px] font-semibold text-[#8B6F47] uppercase tracking-[0.35em] mb-4 block">
                — Nuestra Esencia —
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light tracking-tight text-[#3D2B1F] leading-[1.1]">
                Más que accesorios, <br />
                <span className="italic text-[#8B6F47]">piezas con alma.</span>
              </h1>
            </div>

            <p className="text-lg text-[#6B5B4F] leading-relaxed max-w-lg font-extralight tracking-wide">
              En <span className="text-[#3D2B1F] font-medium">{siteConfig.companyName}</span> creemos que lo que llevas puesto debe resonar con quien sos. 
              Por eso, creamos cada pieza de bijouterie y macramé no solo por su estética, sino por la intención y la energía que le ponemos al hacerla realidad.
            </p>

            <ul className="space-y-4 pt-2">
              {[
                'Diseños 100% personalizados y adaptados a tu energía',
                'Piedras naturales e hilos de primera calidad',
                'Atención cercana, cálida y con dedicación artesanal',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-4 text-[#3D2B1F]">
                  <span className="flex-shrink-0 w-6 h-6 mt-0.5 rounded-full bg-[#F5EFE6] border border-[#E8DFD0] flex items-center justify-center">
                    <FaCheck className="w-3 h-3 text-[#C9A961]" />
                  </span>
                  <span className="text-sm sm:text-base font-light tracking-wide">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link
                href="/catalogo"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#3D2B1F] text-[#FAF7F2] font-medium text-sm tracking-wide transition-all duration-500 shadow-[0_10px_25px_rgba(61,43,31,0.15)] hover:bg-[#2A1D14] hover:shadow-[0_15px_35px_rgba(61,43,31,0.25)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Ver Colección</span>
                <span className="group-hover:translate-x-1 transition-transform duration-500"><FaArrowRight className="w-3.5 h-3.5" /></span>
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-[#3D2B1F]/20 bg-transparent text-[#3D2B1F] font-medium text-sm tracking-wide transition-all duration-500 hover:bg-[#3D2B1F]/5 hover:border-[#3D2B1F]/40 active:scale-[0.98]"
              >
                <span>Hablemos</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            ESTADÍSTICAS - LIMPIO Y DIRECTO
            ═══════════════════════════════════════════════════════ */}
        <section className="py-16 border-y border-[#E8DFD0]/60 bg-white/60 backdrop-blur-sm rounded-[2rem] mb-24 sm:mb-32 shadow-[0_10px_40px_rgba(139,115,85,0.04)]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-[#E8DFD0]/60">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-3 p-4">
                <p className="text-4xl sm:text-5xl font-serif font-light text-[#3D2B1F] tracking-tight">
                  {stat.value}
                </p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#8B6F47] font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            HISTORIA (TIMELINE) - MINIMALISTA Y ARTESANAL
            ═══════════════════════════════════════════════════════ */}
        <section className="mb-24 sm:mb-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-semibold text-[#8B6F47] uppercase tracking-[0.35em] mb-4 block">— Trayectoria —</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#3D2B1F] tracking-tight">Nuestra historia</h2>
            <div className="w-16 h-px bg-[#C9A961] mx-auto mt-6" />
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* Línea vertical sutil */}
            <div className="absolute left-0 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#D4B5D4] via-[#C9A961] to-[#E8DFD0] -translate-x-1/2" />
            
            <div className="space-y-16">
              {timeline.map((item, index) => (
                <div key={index} className={`relative flex flex-col sm:flex-row gap-8 ${index % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}>
                  {/* Punto en la línea */}
                  <div className="absolute left-0 sm:left-1/2 top-2 w-3 h-3 rounded-full bg-[#FAF7F2] border-2 border-[#C9A961] -translate-x-1/2 z-10 shadow-sm" />
                  
                  <div className={`sm:w-1/2 ${index % 2 === 0 ? 'sm:pl-12 sm:text-left' : 'sm:pr-12 sm:text-right'} pl-8 sm:pl-0`}>
                    <span className="text-xs font-semibold text-[#C9A961] uppercase tracking-[0.2em] mb-2 block">{item.year}</span>
                    <h3 className="text-xl font-serif font-medium text-[#3D2B1F] mb-3">{item.title}</h3>
                    <p className="text-[#6B5B4F] text-sm leading-relaxed font-extralight tracking-wide bg-white p-6 rounded-[1.5rem] border border-[#E8DFD0]/60 shadow-[0_8px_20px_rgba(139,115,85,0.04)]">
                      {item.desc}
                    </p>
                  </div>
                  <div className="hidden sm:block sm:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            VALORES / PILARES
            ═══════════════════════════════════════════════════════ */}
        <section className="mb-24 sm:mb-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-semibold text-[#8B6F47] uppercase tracking-[0.35em] mb-4 block">— Filosofía —</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#3D2B1F] tracking-tight">Lo que nos define</h2>
            <div className="w-16 h-px bg-[#C9A961] mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="group p-8 rounded-[2rem] border border-[#E8DFD0]/60 bg-white hover:border-[#D4B5D4]/60 transition-all duration-700 shadow-[0_8px_20px_rgba(139,115,85,0.04)] hover:shadow-[0_20px_40px_rgba(139,115,85,0.08)] hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#F5EFE6] text-[#8B6F47] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#D4B5D4]/20 group-hover:text-[#3D2B1F] transition-all duration-500 border border-[#E8DFD0]/60">
                  {value.icon}
                </div>
                <h3 className="text-lg font-serif font-medium text-[#3D2B1F] mb-3 group-hover:text-[#8B6F47] transition-colors duration-500 tracking-tight">
                  {value.title}
                </h3>
                <p className="text-[#6B5B4F] text-sm leading-relaxed font-extralight tracking-wide">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            TESTIMONIOS
            ═══════════════════════════════════════════════════════ */}
        <section className="mb-24 sm:mb-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-semibold text-[#8B6F47] uppercase tracking-[0.35em] mb-4 block">— Comunidad —</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#3D2B1F] tracking-tight">Lo que dicen nuestras clientas</h2>
            <div className="w-16 h-px bg-[#C9A961] mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((t, index) => (
              <div key={index} className="relative p-8 sm:p-10 rounded-[2rem] bg-white border border-[#E8DFD0]/60 shadow-[0_8px_20px_rgba(139,115,85,0.04)]">
                <FaQuoteLeft className="w-8 h-8 text-[#D4B5D4]/60 mb-6" />
                <p className="text-[#3D2B1F] font-light italic leading-relaxed mb-8 text-lg tracking-wide">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F5EFE6] flex items-center justify-center border border-[#E8DFD0]">
                    <FaCrown className="w-4 h-4 text-[#C9A961]" />
                  </div>
                  <div>
                    <p className="font-serif font-medium text-[#3D2B1F] tracking-tight">{t.name}</p>
                    <p className="text-[10px] text-[#8B6F47] uppercase tracking-[0.2em] font-semibold">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            CTA FINAL
            ═══════════════════════════════════════════════════════ */}
        <section className="relative rounded-[2rem] border border-[#E8DFD0]/60 bg-white backdrop-blur-sm p-8 sm:p-16 text-center overflow-hidden shadow-[0_20px_50px_rgba(139,115,85,0.08)]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNlOWQ1ZmYiIG9wYWNpdHk9IjAuMiIvPjwvc3ZnPg==')] opacity-40 pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <div>
              <span className="text-[10px] font-semibold text-[#8B6F47] uppercase tracking-[0.35em] mb-4 block">— Comencemos —</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#3D2B1F] tracking-tight">
                ¿Lista para crear algo <span className="italic text-[#8B6F47]">único</span>?
              </h2>
            </div>
            <p className="text-[#6B5B4F] font-extralight text-lg tracking-wide">
              Escribinos por WhatsApp o visitá nuestro taller. Estamos para asesorarte y hacer realidad la pieza que estás buscando.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a
                href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#3D2B1F] text-[#FAF7F2] font-medium text-sm tracking-wide transition-all duration-500 shadow-[0_10px_25px_rgba(61,43,31,0.15)] hover:bg-[#2A1D14] hover:shadow-[0_15px_35px_rgba(61,43,31,0.25)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <FaHeart className="w-4 h-4 text-[#C9A961]" />
                <span>Consultar por WhatsApp</span>
              </a>
              <Link
                href="/catalogo"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-[#3D2B1F]/20 bg-transparent text-[#3D2B1F] font-medium text-sm tracking-wide transition-all duration-500 hover:bg-[#3D2B1F]/5 hover:border-[#3D2B1F]/40 active:scale-[0.98]"
              >
                <span>Ver Colección</span>
                <span className="group-hover:translate-x-1 transition-transform duration-500"><FaArrowRight className="w-3.5 h-3.5" /></span>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}