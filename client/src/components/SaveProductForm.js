import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";

import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./NavBar";

const SAVE_PRODUCT = gql`
  mutation SaveProduct(
    $title: String!
    $description: String!
    $price: Float!
    $image: String!
    $quantity: Int!
  ) {
    createProduct(
      title: $title
      description: $description
      price: $price
      image: $image
      quantity: $quantity
    ) {
      id
      title
      description
      price
      image
      quantity
    }
  }
`;

function SaveProductForm() {
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    price: 0,
    image: "",
    quantity: 0,
  });

  const [saveProduct, { loading, error }] = useMutation(SAVE_PRODUCT);

  const handleInputChange = (event) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveProduct({
      variables: {
        title: formState.title,
        description: formState.description,
        price: parseFloat(formState.price),
        image: formState.image,
        quantity: parseInt(formState.quantity),
      },
    })
      .then((result) => {
        console.log(result.data.createProduct);
        // Handle successful product creation
        // Reset the form
        setFormState({
          title: "",
          description: "",
          price: 0,
          image: "",
          quantity: 0,
        });
      })
      .catch((error) => {
        console.error(error);
        // Handle error
      });
  };

  return (
    <>
      <Navbar />
      <div className="container mt-3">
        <h1>Create Product</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={formState.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              id="description"
              name="description"
              className="form-control"
              value={formState.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              className="form-control"
              value={formState.price}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Image:</label>
            <input
              type="text"
              id="image"
              name="image"
              className="form-control"
              value={formState.image}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              className="form-control"
              value={formState.quantity}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="btn btn-primary mt-2">
            Save Product
          </button>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
        </form>
      </div>
    </>
  );
}

export default SaveProductForm;
