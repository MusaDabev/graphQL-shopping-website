import React from "react";
import { useQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";
import Navbar from "./NavBar";

const GET_PRODUCTS = gql`
  query GetProducts {
    getProducts {
      id
      title
      description
      price
      image
      quantity
    }
  }
`;

const ProductsTable = () => {
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const products = data.getProducts;

  return (
    <>
      <Navbar />
      <Link className="btn btn-primary" to="/add-product">Add product</Link>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Image</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.title}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>{product.image}</td>
              <td>{product.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ProductsTable;
