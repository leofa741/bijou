import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongoose';
import ProductoModel from '@/app/models/Producto';

export async function GET(req: NextRequest) {
  console.log("==================================================");
  console.log("🚨 API /api/gestion/categorias HA SIDO LLAMADA 🚨");
  console.log("==================================================");
  
  try {
    await connectDB();
    
    // 1. OBTENER TODOS los productos activos (sin filtros raros)
    const todosLosProductos = await ProductoModel.find({ activo: true })
      .select('categoria subcategoria')
      .lean();
    
    console.log("📦 PRODUCTOS ENCONTRADOS EN LA BD:", JSON.stringify(todosLosProductos, null, 2));

    // 2. AGRUPAR manualmente (a prueba de fallos, sin distinct ni regex)
    const mapaCategorias = new Map<string, Set<string>>();

    todosLosProductos.forEach((p: any) => {
      const cat = p.categoria?.trim();
      const sub = p.subcategoria?.trim();

      if (cat) {
        if (!mapaCategorias.has(cat)) {
          mapaCategorias.set(cat, new Set<string>());
        }
        if (sub) {
          mapaCategorias.get(cat)!.add(sub);
        }
      }
    });

    console.log("🗺️ MAPA DE CATEGORÍAS Y SUBCATEGORÍAS:", Array.from(mapaCategorias.entries()));

    // 3. CONSTRUIR el formato exacto que pide el Navbar
    const resultadoFinal = Array.from(mapaCategorias.entries()).map(([nombreCat, subsSet]) => {
      const catSlug = nombreCat.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      
      const hijas = Array.from(subsSet).map(subNombre => {
        const subSlug = subNombre.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
        return {
          _id: `sub-${subSlug}`,
          nombre: subNombre,
          slug: subSlug
        };
      });

      return {
        _id: `cat-${catSlug}`,
        nombre: nombreCat,
        slug: catSlug,
        hijas: hijas.length > 0 ? hijas : undefined // Si hay hijas, las envía. Si no, undefined.
      };
    });

    console.log("✅ RESULTADO FINAL ENVIADO AL NAVBAR:", JSON.stringify(resultadoFinal, null, 2));
    console.log("==================================================");

    return NextResponse.json({ success: true, categorias: resultadoFinal }, { status: 200 });

  } catch (error) {
    console.error('❌ ERROR CRÍTICO EN API CATEGORÍAS:', error);
    return NextResponse.json({ success: false, message: 'Error interno', error: String(error) }, { status: 500 });
  }
}