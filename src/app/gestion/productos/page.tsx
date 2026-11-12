'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';
import {
  FaBoxOpen, FaPlus, FaEdit, FaTrash, FaExclamationTriangle,
  FaCheckCircle, FaSearch, FaFilter, FaStar, FaChevronLeft, FaChevronRight,
  FaBoxes, FaTags
} from 'react-icons/fa';

interface Product {
  _id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precioFinalManual: number;
  precioMayorista?: number; // 👈 NUEVO CAMPO
  costoTotalProduccion: number;
  margenGananciaPorcentaje: number;
  estaEnPerdida: boolean;
  imagen: string;
  destacado: boolean;
  nuevo: boolean;
  stock: number;
  createdAt: string;
}

export default function DashboardProductosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // 📦 ESTADOS PARA EL MODAL DE STOCK
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedProductForStock, setSelectedProductForStock] = useState<Product | null>(null);
  const [stockInput, setStockInput] = useState<number>(0);
  const [updatingStock, setUpdatingStock] = useState(false);

  // 💰 ESTADOS PARA EL MODAL DE PRECIO MAYORISTA
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [selectedProductForPrice, setSelectedProductForPrice] = useState<Product | null>(null);
  const [priceInput, setPriceInput] = useState<number>(0);
  const [updatingPrice, setUpdatingPrice] = useState(false);

  // 📄 PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    const allowedRoles = ['admin', 'superadmin', 'vendedor'];
    if (session?.user?.role && !allowedRoles.includes(session.user.role)) {
      Swal.fire({
        icon: 'error',
        title: 'Acceso denegado',
        text: 'No tienes permisos para acceder a esta sección.',
        confirmButtonColor: '#BE185D',
        confirmButtonText: 'Entendido'
      });
      router.push('/');
      return;
    }

    fetchProducts();
  }, [status, session, router]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/gestion/productos', {
        headers: { 'Authorization': `Bearer ${session?.user?.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        
        // 🔥 MAGIA INFALIBLE: Forzamos valores por defecto si la BD no los tiene.
        const productosProcesados = (data.productos || []).map((p: any) => ({
          ...p,
          stock: p.stock === undefined || p.stock === null ? 0 : Number(p.stock),
          precioMayorista: p.precioMayorista === undefined || p.precioMayorista === null ? 0 : Number(p.precioMayorista)
        }));
        
        setProducts(productosProcesados);
      } else {
        throw new Error('Error al obtener los datos');
      }
    } catch (error) {
      console.error('Error cargando productos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de carga',
        text: 'No se pudo cargar el listado de productos. Inténtalo de nuevo.',
        confirmButtonColor: '#BE185D'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDestacado = async (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/gestion/productos?id=${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.token}`
        },
        body: JSON.stringify({ destacado: !currentStatus })
      });

      if (res.ok) {
        setProducts(prev => prev.map(p =>
          p._id === id ? { ...p, destacado: !currentStatus } : p
        ));
        
        Swal.fire({
          icon: 'success',
          title: currentStatus ? 'Quitado de destacados' : '¡Producto destacado!',
          text: currentStatus ? 'Ya no aparecerá en la sección de favoritos.' : 'Ahora aparecerá en la página de inicio.',
          timer: 2000,
          showConfirmButton: false,
          background: '#FFFBF7',
          color: '#44403C'
        });
      } else {
        throw new Error('Error al actualizar');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el estado del producto.',
        confirmButtonColor: '#BE185D',
        background: '#FFFBF7',
        color: '#44403C'
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string, nombre: string) => {
    const result = await Swal.fire({
      title: '¿Estás segura?',
      text: `¿Deseas eliminar "${nombre}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#BE185D',
      cancelButtonColor: '#9CA3AF',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#FFFBF7',
      color: '#44403C'
    });

    if (!result.isConfirmed) return;
    
    try {
      const res = await fetch(`/api/gestion/productos/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session?.user?.token}` }
      });
      
      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: '¡Eliminado!',
          text: 'El producto ha sido eliminado correctamente.',
          confirmButtonColor: '#047857',
          background: '#FFFBF7',
          color: '#44403C',
          timer: 2000,
          showConfirmButton: false
        });
        setCurrentPage(1); 
        fetchProducts();
      } else {
        throw new Error(data.message || `Error del servidor (${res.status})`);
      }
    } catch (error: any) {
      console.error('❌ Error detallado al eliminar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al eliminar',
        text: error.message || 'No se pudo eliminar el producto. Inténtalo de nuevo.',
        confirmButtonColor: '#BE185D',
        background: '#FFFBF7',
        color: '#44403C'
      });
    }
  };

  // 📦 FUNCIONES DEL MODAL DE STOCK
  const handleOpenStockModal = (product: Product) => {
    setSelectedProductForStock(product);
    setStockInput(product.stock);
    setIsStockModalOpen(true);
  };

  const handleSaveStock = async () => {
    if (!selectedProductForStock) return;
    if (stockInput < 0) {
      Swal.fire({ icon: 'warning', title: 'Stock inválido', text: 'El stock no puede ser negativo.', confirmButtonColor: '#BE185D' });
      return;
    }

    setUpdatingStock(true);
    try {
      const res = await fetch(`/api/gestion/productos/${selectedProductForStock._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.token}` 
        },
        body: JSON.stringify({ stock: stockInput })
      });

      if (res.ok) {
        setProducts(prev => prev.map(p => 
          p._id === selectedProductForStock._id ? { ...p, stock: stockInput } : p
        ));
        
        Swal.fire({
          icon: 'success',
          title: '¡Stock actualizado!',
          text: `El stock de "${selectedProductForStock.nombre}" ahora es ${stockInput}.`,
          timer: 2000,
          showConfirmButton: false,
          background: '#FFFBF7',
          color: '#44403C'
        });
        setIsStockModalOpen(false);
      } else {
        throw new Error('Error al actualizar');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el stock. Inténtalo de nuevo.',
        confirmButtonColor: '#BE185D',
        background: '#FFFBF7',
        color: '#44403C'
      });
    } finally {
      setUpdatingStock(false);
    }
  };

  // 💰 FUNCIONES DEL MODAL DE PRECIO MAYORISTA
  const handleOpenPriceModal = (product: Product) => {
    setSelectedProductForPrice(product);
    setPriceInput(product.precioMayorista || 0);
    setIsPriceModalOpen(true);
  };

  const handleSavePrice = async () => {
    if (!selectedProductForPrice) return;
    if (priceInput < 0) {
      Swal.fire({ icon: 'warning', title: 'Precio inválido', text: 'El precio no puede ser negativo.', confirmButtonColor: '#BE185D' });
      return;
    }

    setUpdatingPrice(true);
    try {
      const res = await fetch(`/api/gestion/productos/${selectedProductForPrice._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.token}` 
        },
        body: JSON.stringify({ precioMayorista: priceInput })
      });

      if (res.ok) {
        setProducts(prev => prev.map(p => 
          p._id === selectedProductForPrice._id ? { ...p, precioMayorista: priceInput } : p
        ));
        
        Swal.fire({
          icon: 'success',
          title: '¡Precio actualizado!',
          text: `El precio mayorista ahora es ${formatPrice(priceInput)}.`,
          timer: 2000,
          showConfirmButton: false,
          background: '#FFFBF7',
          color: '#44403C'
        });
        setIsPriceModalOpen(false);
      } else {
        throw new Error('Error al actualizar');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el precio. Inténtalo de nuevo.',
        confirmButtonColor: '#BE185D',
        background: '#FFFBF7',
        color: '#44403C'
      });
    } finally {
      setUpdatingPrice(false);
    }
  };

  const formatPrice = (amount: number) => 
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(amount);

  // 🔍 BÚSQUEDA Y FILTRADO
  const filteredProducts = products.filter(prod => {
    const matchesSearch = prod.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || prod.categoria.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // 📄 PAGINACIÓN
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // 📊 ESTADÍSTICAS
  const totalProductos = products.length;
  const productosEnPerdida = products.filter(p => p.estaEnPerdida).length;
  const margenPromedio = products.length > 0 
    ? Math.round(products.reduce((acc, p) => acc + p.margenGananciaPorcentaje, 0) / products.length) 
    : 0;

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50/50 via-[#FFFBF7] to-amber-50/30">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin w-10 h-10 text-rose-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-stone-500 font-medium animate-pulse">Cargando catálogo...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-rose-50/50 via-[#FFFBF7] to-amber-50/30 p-4 sm:p-8 pb-24 overflow-x-hidden">
      <div className="max-w-7xl mx-auto mt-8 sm:mt-12 space-y-6 sm:space-y-8">
        
        {/* ─── HEADER ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <a href="/gestion" className="inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-700 transition-colors mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al Panel
            </a>
            <h1 className="text-2xl sm:text-4xl font-serif font-medium text-stone-800">
              Catálogo de Productos
            </h1>
            <p className="text-stone-500 font-light text-sm sm:text-base mt-1">
              Gestiona tus productos, revisa márgenes y optimiza precios.
            </p>
          </div>
          <button
            onClick={() => router.push('/gestion/productos/nuevo')}
            className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 text-white font-bold shadow-lg shadow-rose-200/50 hover:shadow-xl hover:shadow-rose-300/60 active:scale-[0.98] transition-all"
          >
            <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
            <span>Crear Producto</span>
          </button>
        </div>

        {/* ─── ESTADÍSTICAS PREMIUM ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-rose-100 shadow-sm active:scale-[0.99] transition-transform">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Total Productos</span>
              <FaBoxOpen className="text-rose-300" />
            </div>
            <p className="text-3xl font-serif font-bold text-stone-800">{totalProductos}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-rose-100 shadow-sm active:scale-[0.99] transition-transform">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Margen Promedio</span>
              <FaCheckCircle className="text-emerald-300" />
            </div>
            <p className="text-3xl font-serif font-bold text-emerald-600">{margenPromedio}%</p>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-rose-100 shadow-sm active:scale-[0.99] transition-transform">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Alertas de Precio</span>
              <FaExclamationTriangle className={productosEnPerdida > 0 ? 'text-amber-400' : 'text-stone-300'} />
            </div>
            <p className={`text-3xl font-serif font-bold ${productosEnPerdida > 0 ? 'text-amber-600' : 'text-stone-400'}`}>
              {productosEnPerdida}
            </p>
          </div>
        </div>

        {/* ─── BARRA DE BÚSQUEDA Y FILTROS ─── */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-rose-100 shadow-sm flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input 
              type="text" 
              placeholder="Buscar producto por nombre..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-rose-50/50 border border-rose-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all text-base"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-rose-500 transition-colors text-xl font-bold"
              >
                ×
              </button>
            )}
          </div>
          <div className="relative sm:w-64">
            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-rose-50/50 border border-rose-200 text-stone-800 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all appearance-none cursor-pointer text-base"
            >
              <option value="all">Todas las categorías</option>
              <option value="sublimacion">Sublimación</option>
              <option value="remeras">Remeras</option>
              <option value="cumpleaños">Decoración</option>
              <option value="tazas">Tazas</option>
              <option value="accesorios">Accesorios</option>
            </select>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            VISTA MÓVIL: TARJETAS DE PRODUCTOS
            ═══════════════════════════════════════════════════ */}
        <div className="md:hidden space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-serif font-medium text-stone-800">Listado</h2>
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
              {filteredProducts.length} {searchTerm || filterCategory !== 'all' ? 'encontrados' : 'registrados'}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white/60 rounded-2xl p-8 text-center text-stone-400 border border-rose-100">
              <div className="flex justify-center mb-3"><FaSearch className="text-3xl text-rose-300" /></div>
              <p className="font-medium text-stone-600">No se encontraron productos</p>
              <p className="text-sm mt-1">Intenta ajustar los filtros o la búsqueda.</p>
            </div>
          ) : (
            currentProducts.map((prod) => (
              <div key={prod._id} className="bg-white rounded-2xl p-4 border border-rose-100 shadow-sm active:scale-[0.99] transition-transform">
                {/* Cabecera de la tarjeta */}
                <div className="flex gap-4 mb-4">
                  <div className="w-20 h-20 rounded-xl bg-rose-100 overflow-hidden flex-shrink-0 border border-rose-200">
                    {prod.imagen ? (
                      <img src={prod.imagen} alt={prod.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-rose-300">
                        <FaBoxOpen className="text-2xl" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-stone-800 text-base break-words leading-tight">{prod.nombre}</h3>
                    <p className="text-xs text-stone-500 truncate mt-0.5">{prod.descripcion}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="inline-flex px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-bold uppercase">
                        {prod.categoria}
                      </span>
                      {prod.destacado && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[10px] font-bold uppercase">
                          <FaStar className="w-2 h-2" /> Destacado
                        </span>
                      )}
                      {prod.nuevo && (
                        <span className="inline-flex px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-bold uppercase">
                          Nuevo
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 👈 BADGE DE STOCK VISIBLE Y ELEGANTE (MÓVIL) */}
                <button
                  onClick={() => handleOpenStockModal(prod)}
                  className="w-full mb-3 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-sm border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-all active:scale-95"
                >
                  <FaBoxes className="text-indigo-500" />
                  Stock disponible: <span className="text-indigo-900 text-base">{prod.stock} unidades</span>
                </button>

                {/* Datos financieros en grilla */}
                <div className="space-y-3 mb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-rose-50/50 p-3 rounded-xl">
                      <p className="text-[10px] uppercase text-stone-400 font-bold mb-0.5">Costo Prod.</p>
                      <p className="font-semibold text-stone-700 text-sm break-words">{formatPrice(prod.costoTotalProduccion)}</p>
                    </div>
                    <div className="bg-rose-50/50 p-3 rounded-xl">
                      <p className="text-[10px] uppercase text-stone-400 font-bold mb-0.5">Precio Unit.</p>
                      <p className="font-bold text-stone-800 text-sm break-words">{formatPrice(prod.precioFinalManual)}</p>
                    </div>
                  </div>
                  
                  {/* 👈 BOTÓN DE PRECIO MAYORISTA (MÓVIL) */}
                  <button
                    onClick={() => handleOpenPriceModal(prod)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-all active:scale-95"
                  >
                    <div className="flex items-center gap-2">
                      <FaTags className="text-emerald-500" />
                      <span className="text-[10px] uppercase text-emerald-700 font-bold">Precio Mayorista</span>
                    </div>
                    <span className="font-bold text-emerald-800 text-base">
                      {prod.precioMayorista ? formatPrice(prod.precioMayorista) : 'Sin definir'}
                    </span>
                  </button>

                  <div className={`p-3 rounded-xl border flex justify-between items-center ${
                    prod.estaEnPerdida 
                      ? 'bg-red-50 border-red-200' 
                      : 'bg-emerald-50 border-emerald-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {prod.estaEnPerdida ? <FaExclamationTriangle className="text-red-500" /> : <FaCheckCircle className="text-emerald-500" />}
                      <span className={`text-[10px] uppercase font-bold ${prod.estaEnPerdida ? 'text-red-600' : 'text-emerald-600'}`}>
                        Margen de Ganancia
                      </span>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-base ${prod.estaEnPerdida ? 'text-red-600' : 'text-emerald-600'}`}>
                        {prod.estaEnPerdida ? 'Pérdida' : `${prod.margenGananciaPorcentaje}%`}
                      </p>
                      <p className={`text-xs ${prod.estaEnPerdida ? 'text-red-500' : 'text-emerald-500'}`}>
                        {formatPrice(prod.precioFinalManual - prod.costoTotalProduccion)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-rose-100">
                  <button 
                    onClick={() => handleToggleDestacado(prod._id, prod.destacado)}
                    disabled={togglingId === prod._id}
                    className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl font-semibold text-xs transition-all active:scale-95 ${
                      prod.destacado 
                        ? 'bg-amber-100 text-amber-700 active:bg-amber-200' 
                        : 'bg-stone-100 text-stone-500 active:bg-stone-200'
                    }`}
                  >
                    <FaStar className={`w-4 h-4 ${togglingId === prod._id ? 'animate-pulse' : ''}`} />
                    {prod.destacado ? 'Quitar' : 'Destacar'}
                  </button>
                  
                  <button 
                    onClick={() => router.push(`/gestion/productos/editar/${prod._id}`)} 
                    className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl bg-stone-100 text-stone-600 font-semibold text-xs active:bg-stone-200 transition-all active:scale-95"
                  >
                    <FaEdit className="w-4 h-4" />
                    Editar
                  </button>
                  
                  <button 
                    onClick={() => handleDelete(prod._id, prod.nombre)} 
                    className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl bg-rose-50 text-rose-600 font-semibold text-xs active:bg-rose-100 transition-all active:scale-95"
                  >
                    <FaTrash className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ═══════════════════════════════════════════════════
            VISTA ESCRITORIO: TABLA (Oculta en móvil)
            ═══════════════════════════════════════════════════ */}
        <div className="hidden md:block bg-white/80 backdrop-blur-xl rounded-[2rem] border border-rose-100 shadow-[0_8px_30px_rgb(253,164,175,0.15)] overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-20 h-20 mx-auto bg-rose-50 rounded-full flex items-center justify-center mb-4">
                <FaSearch className="text-3xl text-rose-300" />
              </div>
              <p className="text-stone-600 font-medium text-lg">No se encontraron productos</p>
              <p className="text-stone-400 text-sm mt-1">Intenta ajustar los filtros o crea un nuevo producto.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-rose-50/50 text-stone-500 text-xs uppercase tracking-wider font-bold border-b border-rose-100">
                    <th className="px-6 py-5">Producto</th>
                    <th className="px-6 py-5 text-center">Stock</th>
                    <th className="px-6 py-5 text-right">P. Unitario</th>
                    <th className="px-6 py-5 text-right">P. Mayorista</th>
                    <th className="px-6 py-5 text-center">Margen</th>
                    <th className="px-6 py-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-100">
                  {currentProducts.map((prod) => (
                    <tr key={prod._id} className="group hover:bg-rose-50/30 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-rose-100 overflow-hidden flex-shrink-0 border border-rose-200">
                            {prod.imagen ? (
                              <img src={prod.imagen} alt={prod.nombre} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-rose-300">
                                <FaBoxOpen className="text-xl" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-stone-800 text-base break-words">{prod.nombre}</p>
                            <p className="text-xs text-stone-500 truncate max-w-[200px]">{prod.descripcion}</p>
                            <div className="flex gap-2 mt-1">
                              {prod.destacado && <span className="text-[9px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded flex items-center gap-1"><FaStar className="w-2.5 h-2.5" /> DESTACADO</span>}
                              {prod.nuevo && <span className="text-[9px] font-bold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">NUEVO</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-5 text-center">
                        <button 
                          onClick={() => handleOpenStockModal(prod)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-sm border border-indigo-100 hover:bg-indigo-100 hover:shadow-sm transition-all cursor-pointer"
                        >
                          <FaBoxes className="w-3.5 h-3.5 text-indigo-500" />
                          {prod.stock} und.
                        </button>
                      </td>

                      <td className="px-6 py-5 text-right font-bold text-stone-800 text-lg">
                        {formatPrice(prod.precioFinalManual)}
                      </td>

                      {/* 👈 CELDA DE PRECIO MAYORISTA (ESCRITORIO) */}
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => handleOpenPriceModal(prod)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-sm border border-emerald-100 hover:bg-emerald-100 transition-all cursor-pointer"
                        >
                          <FaTags className="w-3.5 h-3.5 text-emerald-500" />
                          {prod.precioMayorista ? formatPrice(prod.precioMayorista) : '---'}
                        </button>
                      </td>

                      <td className="px-6 py-5 text-center">
                        {prod.estaEnPerdida ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase border border-red-200 mb-1">
                              <FaExclamationTriangle className="w-3 h-3" /> Pérdida
                            </span>
                            <span className="text-xs text-red-500 font-medium">
                              {formatPrice(prod.precioFinalManual - prod.costoTotalProduccion)}
                            </span>
                          </div>
                        ) : (
                          <div className="inline-flex flex-col items-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase border border-emerald-200 mb-1">
                              <FaCheckCircle className="w-3 h-3" /> {prod.margenGananciaPorcentaje}%
                            </span>
                            <span className="text-xs text-emerald-600 font-medium">
                              +{formatPrice(prod.precioFinalManual - prod.costoTotalProduccion)}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenPriceModal(prod)}
                            className="p-2.5 rounded-xl hover:bg-emerald-50 text-emerald-400 hover:text-emerald-600 transition-all"
                            title="Actualizar Precio Mayorista"
                          >
                            <FaTags className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleOpenStockModal(prod)}
                            className="p-2.5 rounded-xl hover:bg-indigo-50 text-indigo-400 hover:text-indigo-600 transition-all"
                            title="Actualizar Stock"
                          >
                            <FaBoxes className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleToggleDestacado(prod._id, prod.destacado)}
                            disabled={togglingId === prod._id}
                            className={`p-2.5 rounded-xl hover:bg-white hover:shadow-md transition-all ${
                              prod.destacado 
                                ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50' 
                                : 'text-stone-300 hover:text-amber-400 hover:bg-amber-50'
                            }`}
                            title={prod.destacado ? "Quitar de destacados" : "Marcar como destacado"}
                          >
                            <FaStar className={`w-5 h-5 ${togglingId === prod._id ? 'animate-pulse' : ''}`} />
                          </button>
                          <button
                            onClick={() => router.push(`/gestion/productos/editar/${prod._id}`)}
                            className="p-2.5 rounded-xl hover:bg-white hover:shadow-md text-stone-400 hover:text-blue-500 transition-all"
                            title="Editar"
                          >
                            <FaEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(prod._id, prod.nombre)}
                            className="p-2.5 rounded-xl hover:bg-white hover:shadow-md text-stone-400 hover:text-red-500 transition-all"
                            title="Eliminar"
                          >
                            <FaTrash className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 📄 PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-rose-100">
            <p className="text-stone-500 text-sm text-center sm:text-left">
              Página <span className="text-stone-800 font-bold">{currentPage}</span> de <span className="text-stone-800 font-bold">{totalPages}</span>
            </p>
            <div className="flex items-center justify-center sm:justify-end gap-3">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-rose-200 text-stone-600 hover:bg-rose-50 hover:border-rose-300 active:scale-95"
              >
                <FaChevronLeft className="w-3.5 h-3.5" /> Anterior
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-rose-200 text-stone-600 hover:bg-rose-50 hover:border-rose-300 active:scale-95"
              >
                Siguiente <FaChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ═══════════════════════════════════════════════════
          👈 MODAL DE ACTUALIZACIÓN DE STOCK (PREMIUM)
          ═══════════════════════════════════════════════════ */}
      {isStockModalOpen && selectedProductForStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-rose-100 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 border-b border-indigo-100">
              <h3 className="text-xl font-serif font-bold text-stone-800 flex items-center gap-2">
                <FaBoxes className="text-indigo-500" />
                Actualizar Stock
              </h3>
              <p className="text-sm text-stone-500 mt-1">
                Producto: <span className="font-semibold text-stone-700">{selectedProductForStock.nombre}</span>
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={() => setStockInput(prev => Math.max(0, prev - 1))}
                  className="w-12 h-12 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center text-xl font-bold transition-colors active:scale-95"
                >
                  -
                </button>
                
                <div className="text-center">
                  <input 
                    type="number" 
                    min="0"
                    value={stockInput}
                    onChange={(e) => setStockInput(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-32 text-center text-4xl font-bold text-stone-800 bg-transparent border-b-2 border-indigo-200 focus:border-indigo-500 focus:outline-none py-2"
                  />
                  <p className="text-xs text-stone-400 uppercase font-bold tracking-wider mt-1">Unidades</p>
                </div>

                <button 
                  onClick={() => setStockInput(prev => prev + 1)}
                  className="w-12 h-12 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-600 flex items-center justify-center text-xl font-bold transition-colors active:scale-95"
                >
                  +
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsStockModalOpen(false)}
                  disabled={updatingStock}
                  className="flex-1 py-3 rounded-xl border border-stone-200 text-stone-600 font-semibold hover:bg-stone-50 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveStock}
                  disabled={updatingStock}
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 !text-white font-bold shadow-lg shadow-rose-200 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {updatingStock ? (
                    <>
                      <svg className="animate-spin h-4 w-4 !text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="!text-white">Guardando...</span>
                    </>
                  ) : (
                    <span className="!text-white">Guardar Stock</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          💰 MODAL DE ACTUALIZACIÓN DE PRECIO MAYORISTA
          ═══════════════════════════════════════════════════ */}
      {isPriceModalOpen && selectedProductForPrice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-rose-100 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 border-b border-emerald-100">
              <h3 className="text-xl font-serif font-bold text-stone-800 flex items-center gap-2">
                <FaTags className="text-emerald-500" />
                Actualizar Precio Mayorista
              </h3>
              <p className="text-sm text-stone-500 mt-1">
                Producto: <span className="font-semibold text-stone-700">{selectedProductForPrice.nombre}</span>
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-center">
                <div className="text-center w-full">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-lg">$</span>
                    <input 
                      type="number" 
                      min="0"
                      value={priceInput}
                      onChange={(e) => setPriceInput(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-center text-4xl font-bold text-stone-800 bg-transparent border-b-2 border-emerald-200 focus:border-emerald-500 focus:outline-none py-2 pl-8"
                      placeholder="0"
                    />
                  </div>
                  <p className="text-xs text-stone-400 uppercase font-bold tracking-wider mt-2">Precio por mayor (ARS)</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsPriceModalOpen(false)}
                  disabled={updatingPrice}
                  className="flex-1 py-3 rounded-xl border border-stone-200 text-stone-600 font-semibold hover:bg-stone-50 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSavePrice}
                  disabled={updatingPrice}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 !text-white font-bold shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {updatingPrice ? (
                    <>
                      <svg className="animate-spin h-4 w-4 !text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="!text-white">Guardando...</span>
                    </>
                  ) : (
                    <span className="!text-white">Guardar Precio</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}