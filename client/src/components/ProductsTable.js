import React from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import Navbar from "./NavBar";
import { AiOutlineShoppingCart } from "react-icons/ai";

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

const ADD_TO_CART = gql`
  mutation AddToCart($userId: ID!, $productId: ID!) {
    addToCart(userId: $userId, productId: $productId) {
      id
      name
      email
      cart {
        id
        title
        description
        price
        image
        quantity
      }
    }
  }
`;

const ProductsTable = () => {
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  const [addToCartMutation] = useMutation(ADD_TO_CART);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const products = data.getProducts;

  const addToCart = (productId) => {
    addToCartMutation({
      variables: { userId, productId },
    })
      .then((response) => {
        console.log(response.data.addToCart);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Navbar />
      <div className="p-4">
        <Link className="btn btn-primary mb-2" to="/add-product">
          Add product
        </Link>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Add to cart</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.title}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>
                  <AiOutlineShoppingCart
                    role="button"
                    size="2rem"
                    onClick={() => addToCart(product.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProductsTable;
