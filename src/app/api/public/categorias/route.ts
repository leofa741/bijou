import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongoose';
import ProductoModel from '@/app/models/Producto';

export async function GET() {
  try {
    await connectDB();
    
    // distinct() devuelve un array con los valores únicos de ese campo
    const categorias = await ProductoModel.distinct('categoria');
    
    // Filtramos vacíos y formateamos para el frontend
    const footerLinks = categorias
      .filter((cat: string) => cat && cat.trim() !== '')
      .map((cat: string) => {
        const cleanCat = cat.toLowerCase().trim();
        const label = cleanCat.charAt(0).toUpperCase() + cleanCat.slice(1); // Ej: "accesorios" -> "Accesorios"
        
        return {
          label: label,
          slug: cleanCat, // 👈 Útil para que el frontend sepa el identificador limpio
          href: `/categoria/${cleanCat}` // 👈 URL limpia y profesional (SEO friendly)
        };
      });

    return NextResponse.json({ success: true, footerLinks });
  } catch (error) {
    console.error('❌ Error obteniendo categorías:', error);
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}