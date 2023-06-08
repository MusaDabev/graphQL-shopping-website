import React from "react";
import { useQuery, gql } from "@apollo/client";
import Navbar from "./NavBar";

const GET_USER = gql`
  query getUser($userId: ID!) {
    getUser(id: $userId) {
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

const ShoppingCart = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;

  const { loading, error, data } = useQuery(GET_USER, {
    variables: { userId },
  });

  if (data) {
    console.log(data.getUser);
  }

  if (loading) {
    return <p>Loading cart items...</p>;
  }

  if (error) {
    return <p>Error fetching cart items.</p>;
  }

  const cartItems = data.getUser.cart;

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h2>Shopping Cart</h2>
        {cartItems && cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.description}</td>
                  <td>{item.price}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default ShoppingCart;
