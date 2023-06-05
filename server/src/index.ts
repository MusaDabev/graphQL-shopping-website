import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

// MongoDB connection URL
const connectionString = process.env.MONGODB_ATLAS_CONNECTION_STRING;

const dbName = process.env.DB_NAME;

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

// Mongoose model
const User = mongoose.model("User", userSchema);

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String,
  quantity: Number,
});

const Product = mongoose.model("Product", productSchema);

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
    ): Product
  }

  type User {
    id: ID!
    name: String
    email: String
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

// Define resolvers for the schema
const resolvers = {
  Query: {
    getUser: async (_: any, { id }: { id: string }) => {
      try {
        const user = await User.findById(id);
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
