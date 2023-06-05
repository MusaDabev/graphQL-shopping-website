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

const typeDefs = `#graphql
    type Query {
        getUser(id: ID!): User
    }

    type Mutation {
    createUser(name: String!, email: String!, password: String!): User
  }

    type User {
        id: ID!
        name: String
        email: String
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
  },
  Mutation: {
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
