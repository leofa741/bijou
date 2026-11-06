'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  FaArrowRight, FaShoppingBag, FaWhatsapp, 
  FaCheckCircle, FaGem, FaLeaf, FaCrown, FaRegStar
} from 'react-icons/fa';

import { formatARS } from '@/app/lib/formatcurrenci';
import VideoHero from './components/ui/VideoHero';
import { siteConfig } from '@/app/lib/config';
import DisenoPersonalizadoCTA from './components/home/DisenoPersonalizadoCTA';

interface Product {
  _id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  moneda: 'ARS' | 'USD';
  imagen: string;
  slug: string;
  destacado: boolean;
  nuevo: boolean;
  caracteristicas: {
    talle?: string;
    color: string;
    material: string;
    personalizable: boolean;
  };
}

interface DynamicCategory {
  slug: string;
  name: string;
  count: number;
  icon: string;
  color: string;
}

const formatPrice = (monto: number, moneda: 'ARS' | 'USD' = 'ARS') => {
  if (moneda === 'ARS') return formatARS ? formatARS(monto) : `$ ${monto.toLocaleString('es-AR')}`;
  return `USD ${monto.toLocaleString('es-AR')}`;
};

// ✨ Loader con estética premium
function ProductsSectionLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-white rounded-[2rem] overflow-hidden border border-[#E8DFD0]/60 shadow-[0_10px_40px_rgba(139,115,85,0.06)]">
            <div className="aspect-[3/4] bg-gradient-to-br from-[#F5EFE6] to-[#EDE4D3]" />
            <div className="p-8 space-y-4">
              <div className="h-4 bg-[#E8DFD0]/50 rounded w-1/3" />
              <div className="h-6 bg-[#E8DFD0]/60 rounded w-3/4" />
              <div className="h-5 bg-[#C8A2C8]/30 rounded w-1/3 mt-8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  return <PageContent />;
}

function PageContent() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const move = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      container.style.setProperty('--x', `${x}px`);
      container.style.setProperty('--y', `${y}px`);
    };
    container.addEventListener('mousemove', move);
    return () => container.removeEventListener('mousemove', move);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/public/productos');
        if (res.ok) {
          const data = await res.json();
          const mapped = (data.productos || []).map((p: any) => ({
            ...p,
            precio: p.precioFinal || p.precio || 0,
            moneda: p.moneda || 'ARS',
            caracteristicas: p.caracteristicas || { color: 'Variado', material: 'Premium', personalizable: true },
            destacado: Boolean(p.destacado)
          }));
          
          const destacados = mapped.filter((p: Product) => p.destacado === true);
          
          setAllProducts(mapped);
          setFeaturedProducts(destacados.slice(0, 6));
        }
      } catch (err) {
        console.error('❌ Error cargando productos:', err);
      } finally {
        setFeaturedLoading(false);
        setProductsLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✨ CATEGORÍAS CON ESTÉTICA ALILA CREMOSA PREMIUM
  const categoryStyles: Record<string, { icon: string; color: string }> = {
    'bijouterie': { icon: '💎', color: 'from-[#D4B5D4] to-[#C8A2C8]' },
    'joyas': { icon: '💎', color: 'from-[#D4B5D4] to-[#C8A2C8]' },
    'macrame': { icon: '🧶', color: 'from-[#E8DFD0] to-[#D4C4B0]' },
    'accesorios': { icon: '🌸', color: 'from-[#F5E6E8] to-[#E8D5D8]' },
    'decoracion': { icon: '🌿', color: 'from-[#EDE4D3] to-[#D4C4B0]' },
    'default': { icon: '✨', color: 'from-[#D4B5D4]/60 to-[#C8A2C8]/60' }
  };

  const dynamicCategories = useMemo(() => {
    if (allProducts.length === 0) return [];

    const categoryCounts: Record<string, number> = {};
    allProducts.forEach(prod => {
      const cat = prod.categoria.toLowerCase().trim();
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    return Object.entries(categoryCounts).map(([slug, count]) => {
      const styles = categoryStyles[slug] || categoryStyles['default'];
      const name = slug.charAt(0).toUpperCase() + slug.slice(1);
      
      return { slug, name, count, icon: styles.icon, color: styles.color };
    });
  }, [allProducts]);

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="group relative bg-white rounded-[2rem] overflow-hidden border border-[#E8DFD0]/60 hover:border-[#C8A2C8] transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(139,115,85,0.15)]">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF7F2]">
        <Image 
          src={product.imagen || '/img/no-image.png'} 
          alt={product.nombre} 
          fill
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3D2B1F]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {product.destacado && (
          <span className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#8B6F47] text-[9px] font-bold uppercase tracking-[0.2em] shadow-sm border border-[#E8DFD0] flex items-center gap-1.5">
            <FaCrown className="w-2.5 h-2.5 text-[#C9A961]" /> Pieza Exclusiva
          </span>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out">
          <button 
            onClick={() => setSelectedProduct(product)}
            className="w-full py-4 rounded-xl bg-white/95 backdrop-blur-md text-[#3D2B1F] font-medium text-sm tracking-wide hover:bg-[#3D2B1F] hover:text-white transition-all duration-500 shadow-lg border border-[#E8DFD0] hover:border-[#3D2B1F]"
          >
            Descubrir Pieza
          </button>
        </div>
      </div>
      <div className="p-7">
        <p className="text-[#8B6F47] text-[10px] mb-3 uppercase tracking-[0.25em] font-semibold flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-[#C8A2C8]" />
          {product.categoria}
        </p>
        <h3 className="text-[#3D2B1F] font-serif font-medium truncate mb-2 text-xl group-hover:text-[#8B6F47] transition-colors duration-500">
          {product.nombre}
        </h3>
        <div className="flex items-center justify-between pt-4 border-t border-[#E8DFD0]/60">
          <span className="text-[#3D2B1F] font-serif font-semibold text-xl tracking-tight">
            {formatPrice(product.precio, product.moneda)}
          </span>
          <FaRegStar className="w-4 h-4 text-[#C9A961]" />
        </div>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FAF7F2] text-[#3D2B1F] selection:bg-[#D4B5D4] selection:text-[#3D2B1F]">
      
      {/* ✨ Textura cremosa sutil de fondo */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015]" 
           style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}} />
    
      {/* HERO */}
      <div className="relative w-full left-0 right-0 overflow-hidden">
        <VideoHero videoSrc="/videos/header6.mp4" overlayOpacity={0.45}>
          <div className="max-w-7xl mx-auto px-6 pt-32 sm:pt-40 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 items-center mt-12">
              <div className="text-left space-y-10">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
                  <FaCrown className="w-3 h-3 text-[#C9A961]" />
                  <span className="text-[11px] font-semibold text-white uppercase tracking-[0.3em]">Atelier Artesanal</span>
                </div>
                
                <h1 className="relative z-10 text-5xl md:text-7xl lg:text-[5.5rem] font-serif font-light leading-[1.05] tracking-tight text-white">
                  <span className="block italic font-extralight text-[#E8DFD0]">Bijouterie</span>
                  <span className="block my-3 text-[#FAF7F2]">&</span>
                  <span className="block italic font-extralight text-[#D4B5D4]">Macramé</span>
                  <span className="block mt-6 text-3xl md:text-4xl lg:text-5xl text-[#C9A961] tracking-[0.15em] uppercase font-normal">de Autor</span>
                </h1>

                <p className="text-lg md:text-xl text-white/85 max-w-lg font-extralight leading-relaxed tracking-wide">
                  Piezas únicas creadas a mano, inspiradas en la energía sutil de la <span className="text-[#D4B5D4] font-light italic">amatista</span> y la calidez del macramé artesanal.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/catalogo" className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#FAF7F2] text-[#3D2B1F] font-medium rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:bg-white hover:shadow-[0_15px_40px_rgba(0,0,0,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 tracking-wide">
                    <FaShoppingBag className="w-4 h-4" />
                    <span>Ver Colección</span>
                    <FaArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-500" />
                  </Link>
                  <a href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-transparent backdrop-blur-md text-white font-medium rounded-full border border-white/30 hover:bg-white/10 hover:border-[#C9A961]/60 hover:text-[#C9A961] transition-all duration-500 tracking-wide">
                    <FaWhatsapp className="w-4 h-4" />
                    <span>Encargo a Medida</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </VideoHero>
      </div>

      {/* CATEGORÍAS - SECCIÓN CREMOSA */}
      <section className="py-24 sm:py-32 bg-[#FAF7F2] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block text-[10px] font-semibold text-[#8B6F47] uppercase tracking-[0.35em] mb-4">— Nuestras Creaciones —</span>
            <h2 className="text-4xl sm:text-5xl font-serif font-light text-[#3D2B1F] mb-5 tracking-tight">
              Explora el <span className="italic text-[#8B6F47]">Atelier</span>
            </h2>
            <div className="w-16 h-px bg-[#C9A961] mx-auto mb-6" />
            <p className="text-[#6B5B4F] max-w-2xl mx-auto font-extralight text-lg leading-relaxed tracking-wide">
              Desde la delicadeza de la bijouterie hasta la textura natural del macramé. Cada categoría es un universo de piezas únicas.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {productsLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="animate-pulse p-8 rounded-[2rem] bg-white border border-[#E8DFD0]/60">
                  <div className="w-16 h-16 bg-[#E8DFD0]/40 rounded-2xl mb-6" />
                  <div className="h-5 bg-[#E8DFD0]/40 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-[#E8DFD0]/30 rounded w-1/2" />
                </div>
              ))
            ) : dynamicCategories.length > 0 ? (
              dynamicCategories.map((cat, idx) => (
                <Link
                  key={cat.slug}
                  href={`/catalogo?categoria=${cat.slug}`}
                  className="group relative p-8 rounded-[2rem] bg-white border border-[#E8DFD0]/60 hover:border-[#C8A2C8] transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_25px_50px_-15px_rgba(139,115,85,0.15)] overflow-hidden"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-700`} />
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl mb-6 shadow-[0_8px_20px_rgba(139,115,85,0.1)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-700`}>
                      {cat.icon}
                    </div>
                    <h3 className="text-[#3D2B1F] font-serif font-medium text-lg mb-2 group-hover:text-[#8B6F47] transition-colors duration-500 capitalize tracking-tight">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#8B6F47] font-semibold tracking-[0.2em] uppercase">
                      {cat.count} {cat.count === 1 ? 'pieza' : 'piezas'}
                    </p>
                  </div>
                  <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
                    <FaArrowRight className="text-[#C9A961] w-4 h-4" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-16 text-[#8B6F47] bg-white rounded-[2rem] border border-[#E8DFD0]/60">
                <p className="text-lg mb-2 font-serif italic">Próximamente nuevas piezas.</p>
                <p className="text-sm font-light tracking-wide">Estamos creando algo hermoso para vos.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <DisenoPersonalizadoCTA />

      {/* PRODUCTOS DESTACADOS */}
      <section className="py-24 sm:py-32 bg-gradient-to-b from-[#FAF7F2] to-[#F5EFE6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16 gap-6">
            <div>
              <span className="inline-block text-[10px] font-semibold text-[#8B6F47] uppercase tracking-[0.35em] mb-4">— Selección Curada —</span>
              <h2 className="text-4xl sm:text-5xl font-serif font-light text-[#3D2B1F] flex items-center gap-4 tracking-tight">
                <FaGem className="text-[#C9A961] text-2xl" />
                <span>Piezas <span className="italic text-[#8B6F47]">Destacadas</span></span>
              </h2>
              <p className="text-[#6B5B4F] mt-4 font-extralight text-lg tracking-wide max-w-lg">Las creaciones más elegidas por nuestras clientas más exigentes.</p>
            </div>
            <Link href="/catalogo" className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-transparent border border-[#3D2B1F] text-[#3D2B1F] font-medium text-sm shadow-sm hover:bg-[#3D2B1F] hover:text-[#FAF7F2] transition-all duration-500 tracking-wide">
              Ver Toda la Colección
              <FaArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-500" />
            </Link>
          </div>

          {featuredLoading ? (
            <ProductsSectionLoader />
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[2rem] border border-[#E8DFD0]/60 shadow-[0_10px_40px_rgba(139,115,85,0.06)]">
              <div className="text-6xl mb-5 text-[#C9A961]">✨</div>
              <p className="text-[#3D2B1F] text-xl font-serif italic mb-4">Estamos preparando nuevas piezas únicas</p>
              <Link href="/catalogo" className="text-[#8B6F47] font-medium hover:text-[#C9A961] underline underline-offset-4 decoration-[#C9A961]/40 tracking-wide">
                Ver todo el catálogo →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredProducts.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MODAL DE PRODUCTO - PREMIUM */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D2B1F]/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
          <div className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-[#FAF7F2] backdrop-blur-2xl rounded-[2rem] border border-[#E8DFD0] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)]" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedProduct(null)} className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white hover:bg-[#F5EFE6] flex items-center justify-center transition-colors border border-[#E8DFD0] shadow-sm">
              <svg className="w-4 h-4 text-[#3D2B1F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-square bg-[#F5EFE6]">
                <Image src={selectedProduct.imagen || '/img/producto-default.jpg'} alt={selectedProduct.nombre} fill className="object-cover rounded-t-[2rem] md:rounded-l-[2rem] md:rounded-tr-none" />
              </div>
              <div className="p-10 space-y-7">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EFE6] text-[#8B6F47] text-[9px] font-bold uppercase tracking-[0.25em] mb-4 border border-[#E8DFD0]">
                    <FaLeaf className="w-2.5 h-2.5" /> {selectedProduct.categoria}
                  </span>
                  <h2 className="text-3xl font-serif font-medium text-[#3D2B1F] mb-3 tracking-tight leading-tight">{selectedProduct.nombre}</h2>
                  <p className="text-3xl font-serif font-semibold text-[#8B6F47] tracking-tight">{formatPrice(selectedProduct.precio, selectedProduct.moneda)}</p>
                </div>
                <div className="w-12 h-px bg-[#C9A961]" />
                <p className="text-[#6B5B4F] leading-relaxed font-extralight tracking-wide text-[15px]">{selectedProduct.descripcion}</p>
                
                <div className="space-y-4 pt-4">
                  <a href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(`Hola! Me encanta esta pieza: ${selectedProduct.nombre}. ¿Está disponible?`)}`} target="_blank" rel="noopener noreferrer" className="w-full py-4 rounded-xl bg-[#3D2B1F] text-[#FAF7F2] font-medium text-base hover:bg-[#2A1D14] transition-all shadow-[0_10px_25px_rgba(61,43,31,0.2)] inline-flex items-center justify-center gap-3 tracking-wide">
                    <FaWhatsapp className="w-5 h-5" /> Consultar Disponibilidad
                  </a>
                  <p className="text-center text-[11px] text-[#8B6F47] flex items-center justify-center gap-2 tracking-[0.15em] uppercase font-semibold">
                    <FaCheckCircle className="w-3 h-3 text-[#C9A961]" /> Hecho a mano en Argentina
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}