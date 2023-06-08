import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import dotenv from "dotenv";
import {connectDB} from "./mongo.js";
import { resolvers } from "./resolvers.js";

dotenv.config();

const typeDefs = `#graphql
  type Query {
    getUser(id: ID!): User
    getUsers: [User!]!
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
    updateProduct(
      id: ID!
      title: String
      description: String
      price: Float
      image: String
      quantity: Int
    ): Product,
    login(email: String!, password: String!): AuthPayload
    removeFromCart(userId: ID!, itemId: ID!): Boolean
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

  type AuthPayload {
    user: User!
  }
`;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Connect to MongoDB Atlas
connectDB();

const port: number = Number(process.env.PORT) || 4000;
const { url } = await startStandaloneServer(server, {
  listen: { port },
});
console.log(`🚀  Server ready at: ${url}`);
