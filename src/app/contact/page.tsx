'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/app/lib/config';
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaClock, FaArrowRight, FaGem, FaCheck, FaCrown } from 'react-icons/fa';

export default function Contact() {
  // ✅ Estado del formulario
  const [form, setForm] = useState({ name: '', contact: '', interest: 'general', message: '' });
  const [touched, setTouched] = useState({ name: false, contact: false, message: false });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const whatsappNumber = siteConfig.whatsapp;
  const whatsappMessage = siteConfig.whatsappMessage;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
    setTouched(prev => ({ ...prev, [id]: true }));
    if (status.type === 'error') setStatus({ type: '', message: '' });
  }, [status.type]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setLoading(true);

    setTouched({ name: true, contact: true, message: true });

    const nameVal = (form.name || '').trim();
    const contactVal = (form.contact || '').trim();
    const messageVal = (form.message || '').trim();

    if (!nameVal || !contactVal || !messageVal) {
      setStatus({ 
        type: 'error', 
        message: 'Por favor, completá los campos obligatorios para que podamos asesorarte.' 
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...form, 
          subject: `Consulta Web - ${form.interest === 'general' ? 'General' : form.interest}` 
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: '¡Mensaje enviado con éxito! Te contactaremos a la brevedad.' });
        setForm({ name: '', contact: '', interest: 'general', message: '' });
        setTouched({ name: false, contact: false, message: false });
      } else {
        setStatus({ type: 'error', message: data.message || 'Hubo un error. Inténtalo directamente por WhatsApp.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Error de conexión. Intentá por WhatsApp.' });
    } finally {
      setLoading(false);
    }
  }, [form]);

  // Helper para clases dinámicas de los inputs (Estilo Premium Cremoso)
  const getInputClass = (fieldName: 'name' | 'contact' | 'message') => {
    const isInvalid = touched[fieldName] && !(form[fieldName] || '').trim();
    return `w-full bg-[#FAF7F2] border py-4 px-5 text-[#3D2B1F] placeholder-[#8B6F47]/50 focus:outline-none transition-all duration-500 text-base rounded-xl ${
      isInvalid 
        ? 'border-[#FECACA] focus:border-[#F87171] focus:ring-1 focus:ring-[#F87171]/20' 
        : 'border-[#E8DFD0] focus:border-[#C9A961] focus:ring-1 focus:ring-[#C9A961]/20'
    }`;
  };

  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-[#3D2B1F] selection:bg-[#D4B5D4] selection:text-[#3D2B1F]">
      
      {/* ✨ Textura cremosa sutil de fondo */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015]" 
           style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}} />
      
      {/* Orbes de luz ambiental muy sutiles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-[#D4B5D4]/20 rounded-full blur-[150px]" />
        <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] bg-[#C9A961]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] bg-[#E8DFD0]/40 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-42 pb-20">
        
        {/* ───────── HEADER MINIMALISTA ───────── */}
        <div className="max-w-2xl mb-16 sm:mb-24 text-center lg:text-left">
          <span className="text-[10px] font-semibold text-[#8B6F47] uppercase tracking-[0.35em] mb-4 block">
            — Contacto —
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light tracking-tight text-[#3D2B1F] mb-6 leading-tight">
            Hablemos de tu <br />
            <span className="italic text-[#8B6F47]">próxima pieza.</span>
          </h1>
          <p className="text-lg text-[#6B5B4F] font-extralight leading-relaxed tracking-wide max-w-xl mx-auto lg:mx-0">
            ¿Tenés una idea en mente? Estamos aquí para ayudarte a crear accesorios únicos, 
            desde un collar de amatista hasta un macramé que vibre con tu energía.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* ───────── COLUMNA IZQUIERDA: INFO DE CONTACTO ───────── */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-6">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD0] hover:border-[#C9A961] hover:bg-[#F5EFE6] transition-all duration-500 shadow-sm hover:shadow-[0_10px_25px_rgba(139,115,85,0.08)]"
              >
                <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-[#A7F3D0]/50">
                  <FaWhatsapp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#3D2B1F]">WhatsApp</p>
                  <p className="text-xs text-[#8B6F47] font-medium">Respuesta inmediata</p>
                </div>
                <div className="ml-auto text-[#E8DFD0] group-hover:text-[#C9A961] group-hover:translate-x-1 transition-all duration-500">
                  <FaArrowRight className="w-4 h-4" />
                </div>
              </a>

              <div className="space-y-6 pt-8 border-t border-[#E8DFD0]/60">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center flex-shrink-0 border border-[#DDD6FE]/50">
                    <FaEnvelope className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#3D2B1F] mb-1">Email</p>
                    <a href={`mailto:${siteConfig.email}`} className="text-sm text-[#8B6F47] hover:text-[#3D2B1F] transition-colors font-medium break-all">
                      {siteConfig.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F5EFE6] text-[#8B6F47] flex items-center justify-center flex-shrink-0 border border-[#E8DFD0]">
                    <FaMapMarkerAlt className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#3D2B1F] mb-1">Taller / Ubicación</p>
                    <p className="text-sm text-[#6B5B4F] font-light">{siteConfig.address || 'Buenos Aires, Argentina'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F5EFE6] text-[#8B6F47] flex items-center justify-center flex-shrink-0 border border-[#E8DFD0]">
                    <FaClock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#3D2B1F] mb-1">Horarios de Atención</p>
                    <p className="text-sm text-[#6B5B4F] font-light">Lunes a Sábados: 9:00 a 20:00 hs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ───────── COLUMNA DERECHA: FORMULARIO PREMIUM ───────── */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="bg-white border border-[#E8DFD0]/60 rounded-[2rem] p-6 sm:p-10 shadow-[0_10px_40px_rgba(139,115,85,0.06)] space-y-8">
              
              {/* Fila 1: Nombre y Contacto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-[10px] font-semibold text-[#8B6F47] uppercase tracking-[0.25em] ml-1">Nombre *</label>
                  <input
                    type="text"
                    id="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    className={getInputClass('name')}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact" className="text-[10px] font-semibold text-[#8B6F47] uppercase tracking-[0.25em] ml-1">Email o Teléfono *</label>
                  <input
                    type="text"
                    id="contact"
                    value={form.contact}
                    onChange={handleChange}
                    placeholder="Para poder responderte"
                    className={getInputClass('contact')}
                    required
                  />
                </div>
              </div>

              {/* Fila 2: Interés */}
              <div className="space-y-2">
                <label htmlFor="interest" className="text-[10px] font-semibold text-[#8B6F47] uppercase tracking-[0.25em] ml-1">¿En qué podemos ayudarte?</label>
                <div className="relative">
                  <select
                    id="interest"
                    value={form.interest}
                    onChange={handleChange}
                    className="w-full bg-[#FAF7F2] border border-[#E8DFD0] py-4 px-5 text-[#3D2B1F] focus:outline-none focus:border-[#C9A961] focus:ring-1 focus:ring-[#C9A961]/20 transition-all duration-500 text-base appearance-none cursor-pointer rounded-xl font-medium"
                  >
                    <option value="general" className="bg-white">Consulta general</option>
                    <option value="bijouterie" className="bg-white">Bijouterie / Collares personalizados</option>
                    <option value="macrame" className="bg-white">Macramé a medida</option>
                    <option value="mayorista" className="bg-white">Pedidos para emprendimientos</option>
                    <option value="otro" className="bg-white">Otra consulta</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#8B6F47]/60">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              {/* Fila 3: Mensaje */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-[10px] font-semibold text-[#8B6F47] uppercase tracking-[0.25em] ml-1">Tu mensaje *</label>
                <textarea
                  id="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Contanos tu idea: colores, piedras que te gusten, medidas o cualquier duda..."
                  className={`${getInputClass('message')} resize-none`}
                  required
                />
              </div>

              {/* Botón de Envío */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-xl font-medium text-sm tracking-wide transition-all duration-500 min-h-[56px] ${
                    loading 
                      ? 'bg-[#E8DFD0] text-[#8B6F47] cursor-not-allowed' 
                      : 'bg-[#3D2B1F] text-[#FAF7F2] shadow-[0_10px_25px_rgba(61,43,31,0.15)] hover:bg-[#2A1D14] hover:shadow-[0_15px_35px_rgba(61,43,31,0.25)] hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-[#8B6F47]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <span>Enviar Consulta</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-500">
                        <FaArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Mensajes de Estado */}
              {status.message && (
                <div className={`p-4 rounded-xl text-sm font-medium animate-fadeInUp border flex items-start gap-3 ${
                  status.type === 'success' 
                    ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]' 
                    : 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]'
                }`}>
                  {status.type === 'success' ? <FaCheck className="w-4 h-4 mt-0.5 flex-shrink-0" /> : null}
                  <span>{status.message}</span>
                </div>
              )}

              <p className="text-[10px] text-[#8B6F47]/70 pt-4 text-center sm:text-left flex items-center justify-center sm:justify-start gap-2 tracking-wide">
                <FaCrown className="w-3 h-3 text-[#C9A961]" />
                Tus datos están seguros. Al enviar, aceptás nuestra política de privacidad.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}