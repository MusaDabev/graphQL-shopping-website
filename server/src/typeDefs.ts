export const typeDefs = `#graphql
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