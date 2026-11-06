import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/app/lib/mongoose';
import DisenoPersonalizadoModel from '@/app/models/DisenoPersonalizado';

export async function GET(req: NextRequest) {
  try {
    // 🔑 CORRECCIÓN: Quitar el 'secret' forzado. getToken leerá la cookie con NEXTAUTH_SECRET
    const token = await getToken({ req });
    
    if (!token || !['admin', 'superadmin', 'vendedor'].includes(token.role as string)) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const estado = searchParams.get('estado');

    // Si hay un filtro de estado y no es 'todos', lo aplicamos
    const query = estado && estado !== 'todos' ? { estado } : {};
    
    const disenos = await DisenoPersonalizadoModel.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, disenos });

  } catch (error) {
    console.error('❌ Error listando diseños (admin):', error);
    return NextResponse.json({ message: 'Error interno' }, { status: 500 });
  }
}