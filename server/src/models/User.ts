import mongoose, { Schema, Document } from "mongoose";
import { IProduct } from "./Product.js";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    cart: IProduct[];
  }

const UserSchema: Schema = new Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    cart: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  });

export const User = mongoose.model<IUser>("User", UserSchema);