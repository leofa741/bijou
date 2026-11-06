'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FaUser, FaPenFancy, FaMagic, FaArrowRight, FaGem, FaLeaf } from 'react-icons/fa';

export default function DisenoPersonalizadoCTA() {
  const { data: session, status } = useSession();

  const steps = [
    {
      icon: <FaUser className="w-6 h-6" />,
      title: '1. Accede a tu Espacio',
      description: 'Inicia sesión para guardar tu historial, subir fotos de referencia y hacer seguimiento en tiempo real de tu pieza única.'
    },
    {
      icon: <FaPenFancy className="w-6 h-6" />,
      title: '2. Cuéntanos tu Visión',
      description: 'Elige entre bijouterie o macramé, describe los colores que te inspiran (¡la amatista es nuestra especialidad!) y comparte tus ideas.'
    },
    {
      icon: <FaMagic className="w-6 h-6" />,
      title: '3. Lo Hacemos Realidad',
      description: 'Nuestras manos anudarán y engarzarán cada detalle. Te enviaremos una vista previa para tu aprobación antes de finalizar.'
    }
  ];

  return (
    <section className="relative w-full py-16 sm:py-24 overflow-hidden bg-gradient-to-b from-violet-50/50 to-white">
      {/* ✨ Background ambiental con orbes de energía amatista */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-300/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header de la sección */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 text-purple-800 text-xs font-bold uppercase tracking-wider mb-4 border border-violet-200">
            <FaGem className="w-3 h-3" />
            <span>Diseño a Medida</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-medium text-stone-800 mb-4 leading-tight">
            ¿Imaginas una pieza irrepetible? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600 italic">
              La creamos juntas.
            </span>
          </h2>
          <p className="text-stone-500 text-lg sm:text-xl font-light leading-relaxed">
            Desde un collar de amatista con significado hasta un colgante de macramé que vibre con tu energía. 
            Solicita tu accesorio 100% personalizado en 3 simples pasos.
          </p>
        </div>

        {/* Grid de Pasos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-violet-100 shadow-sm hover:shadow-xl hover:shadow-violet-100/50 hover:border-purple-300 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icono con fondo degradado amatista */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center text-purple-700 mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 border border-violet-200">
                {step.icon}
              </div>
              
              <h3 className="text-xl font-serif font-semibold text-stone-800 mb-3 group-hover:text-purple-800 transition-colors">
                {step.title}
              </h3>
              <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action (CTA) Dinámico */}
        <div className="text-center">
          {status === 'loading' ? (
            <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-stone-100 text-stone-400 font-bold">
              <svg className="animate-spin w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Preparando tu espacio...
            </div>
          ) : status === 'authenticated' ? (
            <Link 
              href="/profile/diseno-personalizado/nuevo"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700 text-white font-bold text-lg shadow-lg shadow-violet-300/50 hover:shadow-xl hover:shadow-purple-400/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <FaMagic className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Crear mi Diseño a Medida
              <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/login"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700 text-white font-bold text-lg shadow-lg shadow-violet-300/50 hover:shadow-xl hover:shadow-purple-400/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <FaUser className="w-5 h-5" />
                Iniciar Sesión para Empezar
                <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-stone-400 text-sm font-light">
                ¿No tienes cuenta? <Link href="/register" className="text-purple-600 font-medium hover:underline underline-offset-4">Regístrate gratis</Link>
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}