'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FaPalette, FaClock, FaGem, FaLeaf, FaArrowRight } from 'react-icons/fa';

const ESTADOS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pendiente: { label: 'Pendiente', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  en_revision: { label: 'En revisión', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
  consulta: { label: 'Consulta', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200' },
  vista_previa_enviada: { label: 'Preview enviado', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  aprobado: { label: 'Aprobado', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  en_produccion: { label: 'En producción', color: 'text-cyan-700', bg: 'bg-cyan-50', border: 'border-cyan-200' },
  completado: { label: 'Completado', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
  rechazado: { label: 'Rechazado', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' }
};

export default function GestionDisenosPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [disenos, setDisenos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }
    
    const allowedRoles = ['admin', 'superadmin', 'vendedor'];
    if (session?.user?.role && !allowedRoles.includes(session.user.role)) {
      toast.error('No tienes permisos para acceder a esta sección');
      router.push('/');
      return;
    }
    
    if (status === 'authenticated') fetchDisenos();
  }, [status, session, router]);

  const fetchDisenos = async () => {
    try {
      const url = filtro === 'todos' 
        ? '/api/gestion/diseno-personalizado/admin' 
        : `/api/gestion/diseno-personalizado/admin?estado=${filtro}`;
      
      // NextAuth maneja la cookie automáticamente, no necesitamos el header Authorization
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success) {
        setDisenos(data.disenos);
      } else {
        toast.error(data.message || 'Error cargando diseños');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión al cargar diseños');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') fetchDisenos();
  }, [filtro]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-violet-50/30 to-purple-50/20">
        <div className="flex flex-col items-center gap-4">
          <FaGem className="animate-spin w-10 h-10 text-violet-500" />
          <span className="text-stone-500 font-medium">Cargando solicitudes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-stone-50 via-violet-50/30 to-purple-50/20 p-4 sm:p-8 pb-24 overflow-x-hidden">
      <div className="max-w-7xl mx-auto mt-20 sm:mt-32 space-y-6">
        
        <div>
          <Link href="/gestion" className="inline-flex items-center gap-1.5 text-violet-600 hover:text-violet-800 transition-colors mb-2 text-sm font-medium">
            ← Volver al panel de gestión
          </Link>
          <h1 className="text-2xl sm:text-4xl font-serif font-medium text-stone-800 flex items-center gap-3">
            <FaGem className="text-violet-500" /> Gestión de Diseños Personalizados
          </h1>
          <p className="text-stone-500 font-light text-sm sm:text-base mt-1">Administra y da seguimiento a las solicitudes de tus clientas</p>
        </div>

        {/* Filtros */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-violet-100 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {['todos', 'pendiente', 'en_revision', 'consulta', 'vista_previa_enviada', 'aprobado', 'en_produccion', 'completado'].map(est => (
              <button
                key={est}
                onClick={() => setFiltro(est)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                  filtro === est
                    ? 'bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-md shadow-violet-200'
                    : 'bg-white border border-violet-200 text-stone-600 hover:border-violet-400 hover:bg-violet-50'
                }`}
              >
                {est === 'todos' ? 'Todos' : ESTADOS_CONFIG[est]?.label || est}
              </button>
            ))}
          </div>
        </div>

        {/* Lista */}
        {disenos.length === 0 ? (
          <div className="bg-white/60 rounded-[2rem] p-12 text-center border border-violet-100">
            <FaLeaf className="text-5xl text-violet-300 mx-auto mb-4" />
            <p className="text-stone-600 font-medium">No hay diseños con este filtro</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {disenos.map(diseno => {
              const estadoConfig = ESTADOS_CONFIG[diseno.estado] || ESTADOS_CONFIG.pendiente;
              return (
                <Link
                  key={diseno._id}
                  href={`/gestion/diseno-personalizado/${diseno._id}`}
                  className="group bg-white rounded-2xl border border-violet-100 shadow-sm hover:shadow-lg hover:border-violet-300 transition-all overflow-hidden"
                >
                  <div className="h-32 bg-gradient-to-br from-violet-100 to-purple-100 relative overflow-hidden">
                    {diseno.imagenesReferencia?.[0] ? (
                      <img src={diseno.imagenesReferencia[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-violet-300">
                        <FaPalette className="text-4xl" />
                      </div>
                    )}
                    <div className={`absolute top-3 right-3 inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${estadoConfig.bg} ${estadoConfig.color} ${estadoConfig.border}`}>
                      {estadoConfig.label}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-violet-600 font-bold uppercase tracking-wider mb-1">{diseno.nombreCliente}</p>
                    <h3 className="font-serif font-medium text-stone-800 line-clamp-1 group-hover:text-violet-700 transition-colors text-lg">
                      {diseno.titulo}
                    </h3>
                    <div className="flex items-center justify-between mt-3 text-xs">
                      <span className="text-stone-400 flex items-center gap-1">
                        <FaClock className="w-3 h-3" /> {new Date(diseno.createdAt).toLocaleDateString('es-AR')}
                      </span>
                      <span className="text-violet-600 font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        Gestionar <FaArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}