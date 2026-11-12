import mongoose, { Schema, Document } from 'mongoose';

export interface ICategoria extends Document {
  nombre: string;
  slug: string;
  parentId: mongoose.Types.ObjectId | null;
  activo: boolean;
}

const CategoriaSchema = new Schema<ICategoria>(
  {
    nombre: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Categoria', default: null }, // 👈 Clave para subcategorías
    activo: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.Categoria || mongoose.model<ICategoria>('Categoria', CategoriaSchema);