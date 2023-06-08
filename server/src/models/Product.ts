import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    title: string;
    description: string;
    price: number;
    image: string;
    quantity: number;
  }

const ProductSchema: Schema = new Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  });

export const Product = mongoose.model<IProduct>("Product", ProductSchema);