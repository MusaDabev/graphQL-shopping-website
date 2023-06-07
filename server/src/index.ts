import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

// MongoDB connection URL
const connectionString = process.env.MONGODB_ATLAS_CONNECTION_STRING;

const dbName = process.env.DB_NAME;

const typeDefs = `#graphql
  type Query {
    getUser(id: ID!): User
    getProduct(id: ID!): Product
    getProducts: [Product]
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): User,
    createProduct(
      title: String!
      description: String!
      price: Float!
      image: String!
      quantity: Int!
    ): Product,
    addToCart(userId: ID!, productId: ID!): User,
    deleteProduct(id: ID!): Boolean,
  }

  type User {
    id: ID!
    name: String
    email: String
    cart: [Product]
  }

  type Product {
    id: ID!
    title: String
    description: String
    price: Float
    image: String
    quantity: Int
  }
`;

// Define the models
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  cart: IProduct[];
}

interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
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
  cart: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
});

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

const User = mongoose.model<IUser>('User', UserSchema);
const Product = mongoose.model<IProduct>('Product', ProductSchema);

// Define resolvers for the schema
const resolvers = {
  Query: {
    getUser: async (_: any, { id }: { id: string }) => {
      try {
        const user = (await User.findById(id)).populate('cart');
        return user;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch user");
      }
    },
    getProduct: async (_, { id }) => {
      try {
        const product = await Product.findById(id);
        return product;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch product");
      }
    },
    getProducts: async () => {
      try {
        const products = await Product.find();
        return products;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch products");
      }
    },

  },
  Mutation: {
    createProduct: async (
      _: any,
      {
        title,
        description,
        price,
        image,
        quantity,
      }: {
        title: string;
        description: string;
        price: number;
        image: string;
        quantity: number;
      }
    ) => {
      try {
        const product = new Product({
          title,
          description,
          price,
          image,
          quantity,
        });
        await product.save();
        return product;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to create product");
      }
    },
    createUser: async (
      _: any,
      {
        name,
        email,
        password,
      }: { name: string; email: string; password: string }
    ) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const user = new User({ name, email, password: hashedPassword }); // Save the hashed password
        await user.save();
        return user;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to create user");
      }
    },
    addToCart: async (_, { userId, productId }) => {
      const user = await User.findById(userId);
      const product = await Product.findById(productId);

      if (!user || !product) {
        throw new Error('User or product not found');
      }

      user.cart.push(product);
      await user.save();

      return user;
    },
    deleteProduct: async (_, { id }) => {
      try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
          throw new Error('Product not found');
        }
        return true;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to delete product');
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Connect to MongoDB Atlas
mongoose
  .connect(connectionString, { dbName })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
  });

const port: number = Number(process.env.PORT) || 4000;
const { url } = await startStandaloneServer(server, {
  listen: { port },
});
console.log(`🚀  Server ready at: ${url}`);
