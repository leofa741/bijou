import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongoose';
import ProductoModel from '@/app/models/Producto';
import InsumoModel from '@/app/models/Insumo';
import { verifyAdmin } from '@/app/lib/auth';

// ✅ GET: Obtener todos los productos (¡ESTO ES LO QUE FALTABA Y CAUSABA EL ERROR 405!)
export async function GET(req: NextRequest) {
    try {
        const admin = await verifyAdmin(req);
        if (!admin) {
            return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
        }

        await connectDB();
        
        // Obtenemos todos los productos ordenados por fecha de creación (más reciente primero)
        const productos = await ProductoModel.find({}).sort({ createdAt: -1 }).lean();

        return NextResponse.json({ success: true, productos }, { status: 200 });
    } catch (error) {
        console.error('❌ Error obteniendo productos:', error);
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
    }
}

// ✅ POST: Crear un nuevo producto
export async function POST(req: NextRequest) {
    try {
        const admin = await verifyAdmin(req);
        if (!admin) return NextResponse.json({ message: 'No autorizado' }, { status: 403 });

        await connectDB();
        const body = await req.json();
        
        const {
            nombre, descripcion, categoria, subcategoria, insumos, 
            tiempoManoDeObraMinutos, valorHoraManoDeObra, margenGananciaPorcentaje, 
            precioFinalManual, imagen, destacado, nuevo
        } = body;

        let costoTotalInsumos = 0;
        const insumosDetallados = [];

        if (insumos && Array.isArray(insumos) && insumos.length > 0) {
            for (const item of insumos) {
                const insumo = await InsumoModel.findById(item.insumoId);
                if (!insumo) return NextResponse.json({ message: `Insumo no encontrado: ${item.insumoId}` }, { status: 400 });

                const costoPorUnidad = insumo.costo / insumo.cantidadPaquete;
                const subtotal = costoPorUnidad * item.cantidadUsada;
                costoTotalInsumos += subtotal;

                insumosDetallados.push({
                    insumoId: insumo._id,
                    nombre: insumo.nombre,
                    cantidadUsada: item.cantidadUsada,
                    costoUnitarioCalculado: costoPorUnidad,
                    subtotalCalculado: subtotal
                });
            }
        }

        const costoManoObra = ((tiempoManoDeObraMinutos || 0) / 60) * (valorHoraManoDeObra || 0);
        const costoTotalProduccion = costoTotalInsumos + costoManoObra;
        const margenDecimal = (margenGananciaPorcentaje || 0) / 100;
        const precioSugerido = costoTotalProduccion + (costoTotalProduccion * margenDecimal);
        const precioFinal = precioFinalManual ? Number(precioFinalManual) : precioSugerido;
        const estaEnPerdida = precioFinal > 0 && precioFinal < costoTotalProduccion;

        const nuevoProducto = await ProductoModel.create({
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            categoria: categoria.trim(),
            subcategoria: subcategoria ? subcategoria.trim() : '',
            insumos: insumosDetallados,
            tiempoManoDeObraMinutos: tiempoManoDeObraMinutos || 0,
            valorHoraManoDeObra: valorHoraManoDeObra || 0,
            margenGananciaPorcentaje: margenGananciaPorcentaje || 0,
            precioFinalManual: precioFinal,
            imagen: imagen || '',
            destacado: destacado || false,
            nuevo: nuevo || false,
            costoTotalInsumos,
            costoManoObra,
            costoTotalProduccion,
            precioSugerido,
            estaEnPerdida,
            creadoPor: admin.email
        });

        return NextResponse.json({ success: true, producto: nuevoProducto }, { status: 201 });
    } catch (error: any) {
        console.error('❌ Error creando producto:', error);
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
    }
}