import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

async function connectDB() {
  // ✅ 1. MOVER LA VALIDACIÓN ADENTRO DE LA FUNCIÓN
  const MONGODB_URI = process.env.MONGODB_CNN;
  
  if (!MONGODB_URI) {
    throw new Error('Falta la variable de entorno MONGODB_CNN. Verifica las variables en Render.');
  }

  // 2. El resto de la lógica de caché se mantiene igual
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error('❌ Error conectando MongoDB:', error);
    throw error;
  }

  return cached.conn;
}

export default connectDB;