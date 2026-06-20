import mongoose, { Schema, Document } from "mongoose";

export interface IResturant extends Document {
  name: string;
  description?: string;
  image: string;
  owner: mongoose.Types.ObjectId;
  phone: number;
  isVerified: boolean;
  autoLocation: {
    type: "Point"; // ← plain string literal, not { type: String }
    coordinates: [number, number]; // ← plain tuple, not { type: [Number] }
  };
  formattedAddress?: string; // ← plain string, not { type: String }
  isOpen: boolean;
  createdAt: Date;
}

const schema = new Schema<IResturant>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    image: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    phone: { type: Number, required: true },
    isVerified: { type: Boolean, default: false },
    autoLocation: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number], index: "2dsphere" },
    },
    formattedAddress: { type: String },
    isOpen: { type: Boolean, default: false },
  },
  { timestamps: true },
);

schema.index({ autoLocation: "2dsphere" });
export default mongoose.model<IResturant>("Resturant", schema);
