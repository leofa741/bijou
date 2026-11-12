'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useContext, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars, faXmark, faChevronDown, faSearch, faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { useSession, signOut } from 'next-auth/react';
import { AuthContext } from '@/app/context/AuthContext';
import { faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import localFont from 'next/font/local';
import { siteConfig } from '@/app/lib/config';

const cursiveFont = localFont({
  src: '../../../../public/fonts/cursive.ttf',
  variable: '--font-cursive',
  display: 'swap',
});

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  scrolled: boolean;
  active?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
}

interface MobileNavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  index?: number;
}

interface SocialLink {
  icon: any;
  href: string;
  label: string;
}

interface CategoriaConHijas {
  _id: string;
  nombre: string;
  slug: string;
  hijas?: CategoriaConHijas[];
}

export default function Navbar() {
  const { data: session } = useSession();
  const { userRole, setUserRole, userName, userEmail } = useContext(AuthContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopCategoriesOpen, setIsDesktopCategoriesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [categorias, setCategorias] = useState<CategoriaConHijas[]>([]);

  const watsapp = siteConfig.whatsapp;
  const mensaje = encodeURIComponent(siteConfig.whatsappMessage);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✅ Fetch de categorías jerárquicas
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch('/api/gestion/categorias');
        const data = await res.json();
        
        // 👇👇👇 AGREGADO: Esto mostrará en la consola (F12) exactamente qué recibe el Navbar
        console.log("🔍 DATOS RECIBIDOS POR EL NAVBAR:", data);

        if (data.success) {
          setCategorias(data.categorias);
        }
      } catch (error) {
        console.error('Error cargando categorías en Navbar:', error);
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
      if (isDesktopCategoriesOpen) setIsDesktopCategoriesOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDesktopCategoriesOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.style.overflow = isMenuOpen ? 'hidden' : '';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isMenuOpen]);

  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: '/' });
    localStorage.removeItem('token');
    localStorage.removeItem('purchaseData');
    localStorage.removeItem('cart');
    setUserRole('guest');
  }, [setUserRole]);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    setIsDesktopCategoriesOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const role = session?.user?.role || userRole;
  const name = session?.user?.name || userName;
  const email = session?.user?.email || userEmail;
  const image = session?.user?.image;

  const gradients = {
    primary: 'from-purple-400 via-pink-400 to-cyan-400',
    accent: 'from-cyan-300 via-purple-400 to-pink-400',
    subtle: 'from-purple-50 via-pink-50 to-cyan-50',
    glow: 'from-purple-300/30 via-pink-300/30 to-cyan-300/30',
  };

  const socialLinks: SocialLink[] = [
    { icon: faInstagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: faWhatsapp, href: `https://wa.me/${watsapp}?text=${mensaje}`, label: 'WhatsApp' },
  ];

  if (!isMounted) return null;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${scrolled ? 'bg-white/80 backdrop-blur-2xl shadow-xl shadow-purple-200/30 border-b border-purple-200/50' : 'bg-gradient-to-b from-white/60 via-purple-50/30 to-transparent'}`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${gradients.glow} opacity-0 transition-opacity duration-700 ${scrolled ? 'opacity-100' : 'opacity-0'}`} style={{ filter: 'blur(150px)' }} aria-hidden="true" />

        <div className={`max-w-7xl mx-auto px-4 lg:px-8 transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}>
          <div className="flex items-center justify-between">
            <div className="order-1 lg:order-2">
              <Link href="/" onClick={closeMenu} className="block group">
                <div className="flex flex-col items-center lg:items-start">
                  <div className="relative">
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-300/30 via-pink-300/30 to-cyan-300/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <Image src={siteConfig.logo.src} alt={siteConfig.logo.alt} width={scrolled ? 70 : 150} height={scrolled ? 40 : 80} priority className="relative transition-all duration-500 drop-shadow-md group-hover:drop-shadow-xl" />
                  </div>
                  <span className={`${cursiveFont.className} text-lg tracking-wide mt-1 font-normal transition-colors duration-500 ${scrolled ? 'text-purple-700 group-hover:text-pink-500' : 'text-purple-800 group-hover:text-pink-500'}`}>
                    Pretty Witches
                  </span>
                </div>
              </Link>
            </div>

            <div className="order-3 hidden lg:flex items-center space-x-1">
              <NavLink href="/" scrolled={scrolled} active={hoveredLink === 'home'} onHover={() => setHoveredLink('home')} onLeave={() => setHoveredLink(null)}>Inicio</NavLink>
              <NavLink href="/catalogo" scrolled={scrolled} active={hoveredLink === 'catalogo'} onHover={() => setHoveredLink('catalogo')} onLeave={() => setHoveredLink(null)}>Catálogo</NavLink>

              <div className="relative group">
                <button 
                  className={`group relative text-[11px] tracking-[0.3em] uppercase font-bold py-3 px-2 transition-all duration-300 ${scrolled ? 'text-purple-700' : 'text-purple-800'} hover:text-pink-600 flex items-center gap-1.5`}
                  onMouseEnter={() => setIsDesktopCategoriesOpen(true)}
                  onMouseLeave={() => setIsDesktopCategoriesOpen(false)}
                >
                  Categorías
                  <FontAwesomeIcon icon={faChevronDown} className="w-2.5 h-2.5 transition-transform duration-300 group-hover:rotate-180" />
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${isDesktopCategoriesOpen ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'}`} />
                </button>
                
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white/90 backdrop-blur-xl rounded-xl border border-purple-200/50 shadow-xl shadow-purple-200/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
                  {categorias.length > 0 ? (
                    categorias.map((cat) => (
                      <div key={cat._id} className="border-b border-purple-100/50 last:border-0">
                        <Link href={`/categoria/${cat.slug}`} className="block px-5 py-3 text-[11px] tracking-[0.2em] uppercase text-purple-700 font-bold hover:bg-purple-50/80 transition-all duration-300" onClick={() => setIsDesktopCategoriesOpen(false)}>
                          {cat.nombre}
                        </Link>
                        {cat.hijas && cat.hijas.length > 0 && (
                          <div className="bg-purple-50/40 pl-8 py-2 space-y-1">
                            {cat.hijas.map((sub) => (
                              <Link key={sub._id} href={`/categoria/${sub.slug}`} className="block px-3 py-2 text-[10px] tracking-[0.15em] text-purple-500 hover:text-pink-600 capitalize transition-colors duration-300" onClick={() => setIsDesktopCategoriesOpen(false)}>
                                {sub.nombre}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="px-5 py-3 text-[11px] text-purple-400 italic">Cargando...</div>
                  )}
                </div>
              </div>

              <NavLink href="/profile/diseno-personalizado" scrolled={scrolled} active={hoveredLink === 'diseno-personalizado'} onHover={() => setHoveredLink('diseno-personalizado')} onLeave={() => setHoveredLink(null)}>🎨 Mis Diseños</NavLink>
              <NavLink href="/contact" scrolled={scrolled}>Contacto</NavLink>
              <NavLink href="/about" scrolled={scrolled}>Nosotros</NavLink>
            </div>

            <div className="order-2 lg:order-4 flex items-center space-x-3">
              {session ? (
                <div className="hidden lg:flex items-center space-x-4">
                  <Link href="/profile" className={`group flex items-center space-x-2.5 transition-all duration-300 ${scrolled ? 'text-purple-700' : 'text-purple-800'} hover:text-pink-600`}>
                    <div className={`relative w-8 h-8 rounded-full bg-gradient-to-br ${gradients.primary} flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-purple-300/40 group-hover:shadow-pink-300/50 transition-shadow duration-300`}>
                      <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {image ? (<img src={image} alt="Profile" className="w-8 h-8 rounded-full" />) : (name?.charAt(0) || 'U')}
                    </div>
                    <div className='flex flex-col'>
                      <span className="text-xs font-medium text-purple-600">Mi perfil</span>
                      <span className="font-bold text-purple-900 tracking-wide">{name?.split(' ')[0]}</span>
                    </div>
                  </Link>

                  {(role === 'superadmin' || role === 'admin' || role === 'vendedor') && (
                    <Link href="/gestion" className={`group relative text-[10px] px-4 py-2 rounded-xl font-bold tracking-wide uppercase transition-all duration-500 overflow-hidden ${scrolled ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500' : `bg-gradient-to-r ${gradients.primary}`} text-white shadow-lg shadow-purple-300/40 hover:shadow-xl hover:shadow-pink-300/50 hover:scale-105`}>
                      <span className="relative z-10">Panel</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </Link>
                  )}

                  <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (typeof handleLogout === "function") handleLogout(); }} className={`relative z-50 pointer-events-auto cursor-pointer text-[10px] tracking-[0.25em] uppercase font-bold transition-all duration-300 ${scrolled ? 'text-purple-500 hover:text-pink-600' : 'text-purple-600 hover:text-pink-600'} hover:translate-x-0.5`}>
                    Salir
                  </button>
                </div>
              ) : (
                <div className="hidden lg:flex items-center space-x-3">
                  <Link href="/login" className={`group relative text-[11px] tracking-[0.25em] uppercase font-bold py-2 px-1 transition-all duration-300 ${scrolled ? 'text-purple-700' : 'text-purple-800'} hover:text-pink-600`}>
                    <span className="relative z-10">Ingresar</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 transition-all duration-500 group-hover:w-full" />
                  </Link>
                  <Link href="/register" className="group relative text-[10px] px-5 py-2.5 rounded-xl tracking-[0.18em] uppercase font-bold overflow-hidden shadow-lg shadow-purple-300/40 hover:shadow-xl hover:shadow-pink-300/50 hover:scale-105 transition-all duration-300">
                    <span className={`absolute inset-0 bg-gradient-to-r ${gradients.primary} transition-opacity duration-500`} />
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                    <span className="absolute inset-0 rounded-xl border-2 border-white/30 group-hover:border-white/50 transition-colors duration-300" />
                    <span className="relative z-10 text-white drop-shadow-md">Registrarse</span>
                  </Link>
                </div>
              )}

              <button type="button" onClick={toggleMobileMenu} className={`lg:hidden group relative p-2.5 rounded-xl transition-all duration-300 ${scrolled ? 'text-purple-700' : 'text-purple-800'} hover:bg-purple-100`} aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={isMenuOpen}>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-300/30 via-pink-300/30 to-cyan-300/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} className="relative text-2xl transition-transform duration-300 group-hover:scale-110" />
              </button>
            </div>
          </div>
        </div>
        <div className={`h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent transition-all duration-700 ${scrolled ? 'opacity-100' : 'opacity-0'}`} />
      </nav>

      {isMenuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-purple-900/20 backdrop-blur-xl lg:hidden animate-fadeIn" onClick={closeMenu}>
            <div className="absolute top-1/4 -left-16 w-64 h-64 bg-purple-300/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 -right-16 w-64 h-64 bg-cyan-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-pink-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>

          <div className="fixed top-0 right-0 h-full w-full max-w-sm z-50 bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 backdrop-blur-2xl shadow-2xl shadow-purple-300/30 lg:hidden animate-slideInRight border-l-2 border-purple-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-7 border-b border-purple-200/50 bg-white/50">
                <span className="text-[10px] tracking-[0.35em] uppercase text-purple-500 font-bold">Menú</span>
                <button onClick={closeMenu} className="group p-2.5 hover:bg-purple-100 rounded-xl transition-all duration-300" aria-label="Cerrar menú">
                  <FontAwesomeIcon icon={faXmark} className="text-xl text-purple-600 group-hover:text-pink-600 group-hover:rotate-90 transition-all duration-300" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-4 px-6 space-y-1">
                <MobileNavLink href="/" onClick={closeMenu} index={0}>Inicio</MobileNavLink>
                <MobileNavLink href="/catalogo" onClick={closeMenu} index={1}>Catálogo</MobileNavLink>
                
                <div className="pl-4 border-l-2 border-purple-200/50 ml-4 space-y-3 mt-2">
                  {categorias.length > 0 ? (
                    categorias.map((cat, idx) => (
                      <div key={cat._id}>
                        <Link href={`/categoria/${cat.slug}`} onClick={closeMenu} className="group block py-2 px-4 text-purple-700 hover:text-pink-600 transition-all duration-300 rounded-xl text-[11px] tracking-[0.2em] uppercase font-bold relative overflow-hidden hover:bg-purple-100/30">
                          {cat.nombre}
                        </Link>
                        {cat.hijas && cat.hijas.length > 0 && (
                          <div className="pl-4 space-y-1 mt-1">
                            {cat.hijas.map((sub, subIdx) => (
                              <Link key={sub._id} href={`/categoria/${sub.slug}`} onClick={closeMenu} className="group block py-2 px-4 text-purple-500 hover:text-pink-600 transition-all duration-300 rounded-xl text-[10px] tracking-[0.15em] capitalize relative overflow-hidden hover:bg-purple-100/30">
                                <span className="flex items-center justify-between">
                                  {sub.nombre}
                                  <FontAwesomeIcon icon={faArrowRight} className="text-[9px] text-purple-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="py-3 px-4 text-xs text-purple-400 italic animate-pulse">Cargando categorías...</div>
                  )}
                </div>

                <MobileNavLink href="/profile/diseno-personalizado" onClick={closeMenu} index={4}>🎨 Mis Diseños</MobileNavLink>
                <MobileNavLink href="/contact" onClick={closeMenu} index={5}>Contacto</MobileNavLink>
                <MobileNavLink href="/about" onClick={closeMenu} index={6}>Nosotros</MobileNavLink>

                {session ? (
                  <div className="pt-8 mt-6 border-t-2 border-purple-200/50">
                    <Link href="/profile" onClick={closeMenu} className="group flex items-center space-x-4 py-4 px-4 text-purple-800 hover:text-pink-600 hover:bg-white/60 transition-all duration-300 rounded-xl">
                      <div className={`relative w-11 h-11 rounded-full bg-gradient-to-br ${gradients.primary} flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-purple-300/40`}>
                        <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {image ? (<img src={image} alt="Profile" className="w-10 h-10 rounded-full" />) : (name?.charAt(0) || 'U')}
                      </div>
                      <div>
                        <p className="font-bold text-purple-900">{name || email}</p>
                        <p className="text-[10px] text-purple-500 uppercase tracking-wider font-semibold">{role}</p>
                      </div>
                    </Link>
                    {(role === 'superadmin' || role === 'admin' || role === 'vendedor') && (
                      <Link href="/gestion" onClick={closeMenu} className={`group block py-4 px-4 text-sm font-bold rounded-xl transition-all duration-500 bg-gradient-to-r ${gradients.primary} text-white mt-3 shadow-lg shadow-purple-300/40 hover:shadow-xl hover:shadow-pink-300/50 relative overflow-hidden hover:scale-[1.02]`}>
                        <span className="relative z-10">Panel de Gestión</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      </Link>
                    )}
                    <button onClick={() => { closeMenu(); handleLogout(); }} className="w-full text-left py-4 px-4 text-pink-600 hover:text-pink-700 hover:bg-pink-100/50 transition-all duration-300 rounded-xl font-bold mt-3 group">
                      <span className="flex items-center space-x-2">
                        <span>Cerrar Sesión</span>
                        <FontAwesomeIcon icon={faArrowRight} className="text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-8 mt-6 border-t-2 border-purple-200/50 space-y-3">
                    <Link href="/login" onClick={closeMenu} className="group block w-full py-4 px-6 bg-white text-purple-700 text-center tracking-[0.2em] uppercase text-[11px] font-bold rounded-xl transition-all duration-500 hover:bg-purple-50 border-2 border-purple-200 hover:border-pink-300 shadow-md hover:shadow-lg relative overflow-hidden">
                      <span className="relative z-10">Iniciar Sesión</span>
                    </Link>
                    <Link href="/register" onClick={closeMenu} className={`group relative block w-full py-4 px-6 bg-gradient-to-r ${gradients.primary} text-white text-center tracking-[0.2em] uppercase text-[11px] font-bold rounded-xl transition-all duration-500 shadow-lg shadow-purple-300/40 hover:shadow-xl hover:shadow-pink-300/50 hover:scale-[1.02] overflow-hidden`}>
                      <span className="relative z-10">Crear Cuenta</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </Link>
                  </div>
                )}
              </nav>

              <div className="p-7 border-t-2 border-purple-200/50 bg-white/50">
                <div className="flex justify-center space-x-6">
                  {socialLinks.map((social) => (
                    <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="group relative text-purple-400 hover:text-pink-500 transition-all duration-300" aria-label={social.label} onClick={(e) => e.stopPropagation()}>
                      <span className="absolute inset-0 bg-gradient-to-r from-purple-300/30 via-pink-300/30 to-cyan-300/30 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <FontAwesomeIcon icon={social.icon} className="relative text-xl group-hover:scale-110 transition-transform duration-300" />
                    </a>
                  ))}
                </div>
                <p className="text-center text-[10px] text-purple-500 mt-5 tracking-[0.3em] uppercase font-bold">
                  © {new Date().getFullYear()} {siteConfig.companyName}. Todos los derechos reservados.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function NavLink({ href, children, scrolled, active, onHover, onLeave }: NavLinkProps) {
  return (
    <Link href={href} onMouseEnter={onHover} onMouseLeave={onLeave} className={`group relative text-[11px] tracking-[0.3em] uppercase font-bold py-3 px-2 transition-all duration-300 ${scrolled ? 'text-purple-700' : 'text-purple-800'} hover:text-pink-600`}>
      {children}
      <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${active ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'}`} />
      <span className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-purple-300/40 via-pink-300/40 to-cyan-300/40 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Link>
  );
}

function MobileNavLink({ href, children, onClick, index = 0 }: MobileNavLinkProps) {
  return (
    <Link href={href} onClick={onClick} className="group block py-4 px-4 text-purple-700 hover:text-pink-600 transition-all duration-300 rounded-xl text-sm tracking-[0.25em] uppercase font-bold relative overflow-hidden animate-fadeInUp hover:bg-purple-100/30" style={{ animationDelay: `${index * 50 + 100}ms`, animationFillMode: 'both' }}>
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-gradient-to-b from-cyan-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-r-full blur-[1px]" />
      <span className="pl-5 relative flex items-center justify-between">
        {children}
        <FontAwesomeIcon icon={faArrowRight} className="text-xs text-purple-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
      </span>
    </Link>
  );
}