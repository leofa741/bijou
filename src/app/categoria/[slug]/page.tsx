'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  FaArrowLeft, FaLeaf, FaGem, FaShoppingBag, FaWhatsapp, 
  FaPlus, FaMinus, FaTimes, FaCrown, FaRegStar 
} from 'react-icons/fa';
import { siteConfig } from '@/app/lib/config';
import { useCartStore } from '@/store/useCartStore';

interface Product {
  _id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precioFinal: number;
  imagen: string;
  destacado: boolean;
  nuevo?: boolean;
  slug?: string;
}

export default function CategoriaPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { cart, isCartOpen, setIsCartOpen, addToCart, updateQuantity } = useCartStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/public/productos?categoria=${slug}`);
        const data = await res.json();
        if (data.success) setProducts(data.productos);
      } catch (error) {
        console.error('Error cargando categoría:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [slug]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.precioFinal * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSendWhatsApp = () => {
    if (cart.length === 0) return;

    let message = `¡Hola! Me gustaría consultar por las siguientes piezas artesanales de *${siteConfig.companyName}*:\n\n`;
    cart.forEach(item => {
      message += `▪️ ${item.quantity}x ${item.nombre} - ${formatPrice(item.precioFinal * item.quantity)}\n`;
    });
    message += `\n💰 *Total estimado: ${formatPrice(cartTotal)}*\n\n`;
    message += `¿Podrías confirmarme disponibilidad y los detalles para finalizar mi pedido? ¡Muchas gracias!`;

    window.open(`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const formatPrice = (amount: number) => {
    if (!amount || isNaN(amount)) return '$ 0';
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(amount);
  };

  const categoriaNombre = slug.charAt(0).toUpperCase() + slug.slice(1);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="flex flex-col items-center gap-4">
          <FaGem className="animate-pulse w-10 h-10 text-[#C9A961]" />
          <span className="text-[#8B6F47] font-medium tracking-wide">Descubriendo piezas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-[#3D2B1F] selection:bg-[#D4B5D4] selection:text-[#3D2B1F] pb-24">
      <div className="fixed inset-0 pointer-events-none opacity-[0.015]" 
           style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}} />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4B5D4]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C9A961]/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="mb-12 mt-50 sm:mt-32">
          <button onClick={() => router.push('/catalogo')} className="inline-flex items-center gap-2 text-[#8B6F47] hover:text-[#3D2B1F] transition-colors mb-4 font-medium">
            <FaArrowLeft className="w-4 h-4" /> Volver al catálogo
          </button>
          <h1 className="text-4xl sm:text-5xl font-serif font-light text-[#3D2B1F] tracking-tight">
            Categoría: <span className="italic text-[#8B6F47]">{categoriaNombre}</span>
          </h1>
          <div className="w-16 h-px bg-[#C9A961] mt-4" />
        </div>

        {products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2rem] border border-[#E8DFD0]/60 shadow-[0_10px_40px_rgba(139,115,85,0.04)]">
            <FaLeaf className="w-12 h-12 text-[#D4B5D4] mx-auto mb-4" />
            <p className="text-[#3D2B1F] text-lg font-serif italic mb-2">Aún no hay piezas en esta categoría.</p>
            <p className="text-[#8B6F47] text-sm font-light tracking-wide">¡Volvé pronto para descubrir las novedades!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product._id} className="group relative bg-white rounded-[2rem] overflow-hidden border border-[#E8DFD0]/60 hover:border-[#D4B5D4]/60 transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_25px_50px_-15px_rgba(139,115,85,0.15)] flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#F5EFE6]">
                  {product.imagen ? (
                    <img src={product.imagen} alt={product.nombre} className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#D4B5D4]">
                      <FaGem className="w-16 h-16 opacity-60" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3D2B1F]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {product.destacado && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#8B6F47] text-[9px] font-bold uppercase tracking-[0.2em] shadow-sm border border-[#E8DFD0]">
                        <FaCrown className="w-2.5 h-2.5 text-[#C9A961]" /> Exclusiva
                      </span>
                    )}
                    {product.nuevo && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D4B5D4]/20 backdrop-blur-md text-[#3D2B1F] text-[9px] font-bold uppercase tracking-[0.2em] border border-[#D4B5D4]/40">
                        Nuevo
                      </span>
                    )}
                  </div>
                  
                  {/* ✅ BOTÓN AGREGAR: Optimizado para Móvil y Desktop */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="absolute bottom-4 right-4 sm:bottom-5 sm:left-0 sm:right-0 sm:p-5 sm:translate-y-full sm:group-hover:translate-y-0 transition-all duration-500 ease-out z-20"
                    aria-label="Agregar al carrito"
                  >
                    {/* Versión Móvil: Botón redondo flotante */}
                    <div className="sm:hidden w-11 h-11 rounded-full bg-[#3D2B1F] text-[#FAF7F2] flex items-center justify-center shadow-lg active:scale-90 transition-transform border border-[#C9A961]/20">
                      <FaPlus className="w-4 h-4" />
                    </div>
                    
                    {/* Versión Desktop: Botón ancho que sube con hover */}
                    <div className="hidden sm:flex w-full py-3.5 rounded-xl bg-[#3D2B1F] text-[#FAF7F2] font-medium text-sm tracking-wide hover:bg-[#2A1D14] transition-all duration-500 shadow-lg border border-transparent hover:border-[#C9A961]/30 items-center justify-center gap-2">
                      <FaPlus className="w-3 h-3" /> Agregar a la Selección
                    </div>
                  </button>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <p className="text-[#8B6F47] text-[10px] mb-2 uppercase tracking-[0.25em] font-semibold flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#C8A2C8]" />
                    {product.categoria}
                  </p>
                  <h3 className="text-[#3D2B1F] font-serif font-medium truncate mb-2 text-lg group-hover:text-[#8B6F47] transition-colors duration-500">
                    {product.nombre}
                  </h3>
                  <p className="text-[#6B5B4F] text-sm mb-4 line-clamp-2 flex-1 font-extralight leading-relaxed">
                    {product.descripcion}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#E8DFD0]/60">
                    <span className="text-[#3D2B1F] font-serif font-semibold text-xl tracking-tight">
                      {formatPrice(product.precioFinal)}
                    </span>
                    <FaRegStar className="w-4 h-4 text-[#C9A961]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón Flotante del Carrito */}
      {cartCount > 0 && (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-6 py-4 rounded-full bg-[#3D2B1F] text-[#FAF7F2] font-medium shadow-[0_15px_35px_rgba(61,43,31,0.25)] hover:bg-[#2A1D14] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 tracking-wide"
        >
          <div className="relative">
            <FaShoppingBag className="text-lg" />
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#C9A961] text-[#3D2B1F] text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#FAF7F2]">
              {cartCount}
            </span>
          </div>
          <span>Ver Selección ({formatPrice(cartTotal)})</span>
        </button>
      )}

      {/* Drawer del Carrito */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-[#3D2B1F]/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-[#FAF7F2] h-full shadow-2xl flex flex-col animate-slideInRight border-l border-[#E8DFD0]/60">
            <div className="p-6 border-b border-[#E8DFD0]/60 flex items-center justify-between bg-white/50 backdrop-blur-sm">
              <h2 className="text-xl font-serif font-medium text-[#3D2B1F] flex items-center gap-2 tracking-tight">
                <FaShoppingBag className="text-[#C9A961]" /> Tu Selección
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-full hover:bg-[#F5EFE6] text-[#8B6F47] hover:text-[#3D2B1F] transition-colors duration-300">
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-[#8B6F47]">
                  <FaShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="font-serif italic text-lg">Tu selección está vacía</p>
                  <p className="text-sm mt-2 font-light">¡Explorá la colección y encontrá tu pieza ideal!</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item._id} className="flex gap-4 p-4 rounded-2xl bg-white border border-[#E8DFD0]/60 shadow-sm">
                    <div className="w-20 h-20 rounded-xl bg-[#F5EFE6] border border-[#E8DFD0] overflow-hidden flex-shrink-0">
                      {item.imagen ? (
                        <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#D4B5D4]">
                          <FaGem className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-medium text-[#3D2B1F] text-sm truncate">{item.nombre}</h4>
                        <p className="text-[#8B6F47] font-semibold text-sm mt-1">{formatPrice(item.precioFinal)}</p>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => updateQuantity(item._id, -1)} className="w-7 h-7 rounded-lg bg-[#FAF7F2] border border-[#E8DFD0] flex items-center justify-center text-[#8B6F47] hover:border-[#C9A961] hover:text-[#3D2B1F] transition-colors">
                          <FaMinus className="w-2.5 h-2.5" />
                        </button>
                        <span className="text-sm font-medium text-[#3D2B1F] w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, 1)} className="w-7 h-7 rounded-lg bg-[#FAF7F2] border border-[#E8DFD0] flex items-center justify-center text-[#8B6F47] hover:border-[#C9A961] hover:text-[#3D2B1F] transition-colors">
                          <FaPlus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-[#E8DFD0]/60 bg-white/80 backdrop-blur-sm space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-[#8B6F47] font-medium text-sm uppercase tracking-wider">Total Estimado</span>
                  <span className="text-2xl font-serif font-semibold text-[#3D2B1F] tracking-tight">{formatPrice(cartTotal)}</span>
                </div>
                <p className="text-[11px] text-[#8B6F47] text-center leading-relaxed font-light">
                  * Al ser piezas artesanales, el precio final puede variar levemente según personalizaciones específicas.
                </p>
                <button 
                  onClick={handleSendWhatsApp}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-[#047857] text-white font-medium text-sm shadow-[0_10px_25px_rgba(4,120,87,0.2)] hover:bg-[#065F46] hover:shadow-[0_15px_35px_rgba(4,120,87,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 tracking-wide"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  Consultar Pedido por WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}