import SaveProductForm from "./components/SaveProductForm";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import ProductsTable from "./components/ProductsTable";
import Navbar from "./components/NavBar";
import UsersList from "./components/UsersList";
import Login from "./components/Login";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/add-product" element={<SaveProductForm />} />
        <Route path="/products" element={<ProductsTable />} />
        <Route path="/users" element={<UsersList />} />
      </Routes>
    </ApolloProvider>
  );
}

export default App;
