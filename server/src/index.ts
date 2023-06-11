import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import dotenv from "dotenv";
import {connectDB} from "./mongo.js";
import { resolvers } from "./resolvers.js";
import { typeDefs } from "./typeDefs.js";

dotenv.config();

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
