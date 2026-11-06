'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { 
  FaArrowLeft, FaUpload, FaTimes, FaPalette, FaImage, 
  FaCalendarAlt, FaDollarSign, FaGem, FaLeaf, FaRing, FaGift 
} from 'react-icons/fa';

const TIPOS_PRODUCTO = [
  { value: 'collar_piedras', label: 'Collar con Piedras', icon: '💎' },
  { value: 'pulsera_macrame', label: 'Pulsera de Macramé', icon: '🧶' },
  { value: 'aros_colgantes', label: 'Aros o Colgantes', icon: '✨' },
  { value: 'decoracion_pared', label: 'Decoración de Pared', icon: '🌿' },
  { value: 'set_regalo', label: 'Set de Regalo', icon: '🎁' },
  { value: 'otro', label: 'Otra Idea Creativa', icon: '💡' }
];

export default function NuevoDisenoPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [submitting, setSubmitting] = useState(false);
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [form, setForm] = useState({
    titulo: '',
    tipoProducto: '',
    descripcion: '',
    colores: '',
    textoDeseado: '',
    cantidad: 1,
    fechaLimite: '',
    presupuestoEstimado: ''
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imagenes.length > 5) {
      toast.error('Máximo 5 imágenes de referencia', {
        style: { background: '#F5F3FF', color: '#6D28D9', border: '1px solid #DDD6FE' }
      });
      return;
    }

    const newPreviews = files.map(f => URL.createObjectURL(f));
    setImagenes(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImagenes(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.token) {
      toast.error('Debes iniciar sesión para enviar tu idea', {
        style: { background: '#F5F3FF', color: '#6D28D9', border: '1px solid #DDD6FE' }
      });
      router.push('/login');
      return;
    }

    if (!form.titulo || !form.tipoProducto || !form.descripcion) {
      toast.error('Completa los campos obligatorios para que podamos entender tu idea', {
        style: { background: '#F5F3FF', color: '#6D28D9', border: '1px solid #DDD6FE' }
      });
      return;
    }

    setSubmitting(true);
    try {
      // 1. Subir imágenes a Cloudinary
      const urlsImagenes: string[] = [];
      for (const img of imagenes) {
        const formData = new FormData();
        formData.append('image', img);
        const res = await fetch('/api/uploadImage', {
          method: 'POST',
          body: formData,
          headers: { 'Authorization': `Bearer ${session.user.token}` }
        });
        const data = await res.json();
        if (res.ok) urlsImagenes.push(data.url);
      }

      // 2. Crear la solicitud
      const res = await fetch('/api/gestion/diseno-personalizado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.token}`
        },
        body: JSON.stringify({
          ...form,
          cantidad: Number(form.cantidad),
          presupuestoEstimado: form.presupuestoEstimado ? Number(form.presupuestoEstimado) : null,
          imagenesReferencia: urlsImagenes
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('💜 ¡Tu idea está en nuestras manos! Te contactaremos pronto.', {
          style: { background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0' }
        });
        router.push('/profile/diseno-personalizado');
      } else {
        toast.error(data.message || 'Error al enviar la solicitud', {
          style: { background: '#F5F3FF', color: '#6D28D9', border: '1px solid #DDD6FE' }
        });
      }
    } catch (error) {
      toast.error('Error de conexión. Intenta de nuevo.', {
        style: { background: '#F5F3FF', color: '#6D28D9', border: '1px solid #DDD6FE' }
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-violet-50/30 to-purple-50/20">
        <div className="flex flex-col items-center gap-4">
          <FaGem className="animate-pulse w-10 h-10 text-violet-500" />
          <span className="text-stone-500 font-medium">Preparando tu espacio de creación...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-stone-50 via-violet-50/30 to-purple-50/20 p-4 sm:p-8 pb-24 overflow-x-hidden">
      <div className="max-w-3xl mx-auto mt-50 sm:mt-52 space-y-6">
        
        {/* Header */}
        <div>
          <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-violet-600 hover:text-violet-800 transition-colors mb-2 font-medium">
            <FaArrowLeft className="w-4 h-4" /> Volver a mis diseños
          </button>
          <h1 className="text-3xl sm:text-4xl font-serif font-medium text-stone-800 flex items-center gap-3">
            <FaGem className="text-violet-500" /> Crea tu Pieza Única
          </h1>
          <p className="text-stone-500 font-light text-sm sm:text-base mt-2 max-w-xl">
            Cuéntanos los detalles de tu idea. Ya sea un collar de amatista o un macramé para tu hogar, lo haremos realidad con dedicación.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 border border-violet-100 shadow-xl shadow-violet-100/50 space-y-6">
          
          {/* Título */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-violet-700 mb-2 ml-1">
              Nombre de tu idea *
            </label>
            <input
              type="text"
              value={form.titulo}
              onChange={e => setForm({ ...form, titulo: e.target.value })}
              required
              className="w-full px-4 py-3.5 rounded-2xl bg-violet-50/50 border border-violet-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all"
              placeholder="Ej: Collar de amatista con inicial grabada"
            />
          </div>

          {/* Tipo de producto */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-violet-700 mb-3 ml-1">
              ¿Qué tipo de pieza necesitas? *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TIPOS_PRODUCTO.map(tipo => (
                <button
                  key={tipo.value}
                  type="button"
                  onClick={() => setForm({ ...form, tipoProducto: tipo.value })}
                  className={`p-4 rounded-2xl border-2 transition-all text-sm font-medium flex flex-col items-center text-center gap-2 ${
                    form.tipoProducto === tipo.value
                      ? 'bg-gradient-to-br from-violet-600 to-purple-700 text-white border-transparent shadow-lg shadow-violet-200'
                      : 'bg-white border-violet-100 text-stone-600 hover:border-violet-300 hover:bg-violet-50/50'
                  }`}
                >
                  <span className="text-2xl">{tipo.icon}</span>
                  {tipo.label}
                </button>
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-violet-700 mb-2 ml-1">
              Describe tu idea con detalle *
            </label>
            <textarea
              value={form.descripcion}
              onChange={e => setForm({ ...form, descripcion: e.target.value })}
              required
              rows={5}
              className="w-full px-4 py-3.5 rounded-2xl bg-violet-50/50 border border-violet-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all resize-none"
              placeholder="Cuéntanos: tipo de piedra, largo deseado, estilo del nudo, para qué ocasión es, etc."
            />
          </div>

          {/* Colores y Texto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-violet-700 mb-2 ml-1 flex items-center gap-1">
                <FaPalette className="w-3 h-3" /> Colores o materiales
              </label>
              <input
                type="text"
                value={form.colores}
                onChange={e => setForm({ ...form, colores: e.target.value })}
                className="w-full px-4 py-3.5 rounded-2xl bg-violet-50/50 border border-violet-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-200 transition-all"
                placeholder="Ej: Hilo crudo, amatista y dorado"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-violet-700 mb-2 ml-1 flex items-center gap-1">
                <FaRing className="w-3 h-3" /> Texto o grabado (opcional)
              </label>
              <input
                type="text"
                value={form.textoDeseado}
                onChange={e => setForm({ ...form, textoDeseado: e.target.value })}
                className="w-full px-4 py-3.5 rounded-2xl bg-violet-50/50 border border-violet-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-200 transition-all"
                placeholder='Ej: Iniciales "M.A."'
              />
            </div>
          </div>

          {/* Cantidad y Fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-violet-700 mb-2 ml-1">
                Cantidad
              </label>
              <input
                type="number"
                min="1"
                value={form.cantidad}
                onChange={e => setForm({ ...form, cantidad: Number(e.target.value) })}
                className="w-full px-4 py-3.5 rounded-2xl bg-violet-50/50 border border-violet-200 text-stone-800 focus:outline-none focus:ring-2 focus:ring-violet-200 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-violet-700 mb-2 ml-1 flex items-center gap-1">
                <FaCalendarAlt className="w-3 h-3" /> Fecha límite (opcional)
              </label>
              <input
                type="date"
                value={form.fechaLimite}
                onChange={e => setForm({ ...form, fechaLimite: e.target.value })}
                className="w-full px-4 py-3.5 rounded-2xl bg-violet-50/50 border border-violet-200 text-stone-800 focus:outline-none focus:ring-2 focus:ring-violet-200 transition-all"
              />
            </div>
          </div>

          {/* Presupuesto */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-violet-700 mb-2 ml-1 flex items-center gap-1">
              <FaDollarSign className="w-3 h-3" /> Presupuesto aproximado (opcional)
            </label>
            <input
              type="number"
              value={form.presupuestoEstimado}
              onChange={e => setForm({ ...form, presupuestoEstimado: e.target.value })}
              className="w-full px-4 py-3.5 rounded-2xl bg-violet-50/50 border border-violet-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-200 transition-all"
              placeholder="Ej: 25000"
            />
            <p className="text-[11px] text-stone-400 mt-1.5 ml-1 flex items-center gap-1">
              <FaLeaf className="w-3 h-3" /> Ayúdanos a entender tu rango. Te cotizaremos algo acorde a los materiales artesanales.
            </p>
          </div>

          {/* Imágenes de referencia */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-violet-700 mb-2 ml-1 flex items-center gap-1">
              <FaImage className="w-3 h-3" /> Imágenes de referencia (máx. 5)
            </label>
            <div className="relative">
              <input
                type="file"
                id="refImages"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                disabled={imagenes.length >= 5}
              />
              <label
                htmlFor="refImages"
                className={`flex flex-col items-center justify-center gap-2 w-full px-4 py-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                  imagenes.length >= 5
                    ? 'border-stone-300 text-stone-400 cursor-not-allowed'
                    : 'border-violet-300 text-violet-600 hover:bg-violet-50/50'
                }`}
              >
                <FaUpload className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {imagenes.length >= 5 ? 'Máximo de imágenes alcanzado' : 'Subir fotos de inspiración o bocetos'}
                </span>
              </label>
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                {previews.map((preview, idx) => (
                  <div key={idx} className="relative group aspect-square">
                    <img src={preview} alt={`Ref ${idx + 1}`} className="w-full h-full object-cover rounded-xl border border-violet-200" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 shadow-md transition-colors"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all overflow-hidden bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-lg shadow-violet-300/50 hover:shadow-xl hover:shadow-purple-300/60 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {submitting ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Enviando tu idea al taller...
              </>
            ) : (
              <>
                <FaGem className="w-4 h-4 group-hover:rotate-12 transition-transform" /> 
                Enviar mi idea personalizada
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}