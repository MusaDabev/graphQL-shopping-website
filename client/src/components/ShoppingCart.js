import React from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import Navbar from "./NavBar";
import { MdRemoveShoppingCart } from "react-icons/md";

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

const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($userId: ID!, $itemId: ID!) {
    removeFromCart(userId: $userId, itemId: $itemId)
  }
`;

const ShoppingCart = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;

  const { loading, error, data } = useQuery(GET_USER, {
    variables: { userId },
  });

  const [removeFromCart] = useMutation(REMOVE_FROM_CART, {
    onCompleted: (data) => {
      // Handle successful removal
      // You may want to update the UI or refetch cart items here
      console.log(data)
    },
    onError: (error) => {
      // Handle error
    },
  });

  const handleRemoveFromCart = (itemId) => {
    removeFromCart({
      variables: { userId, itemId },
    });
  };

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
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.description}</td>
                  <td>{item.price}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <MdRemoveShoppingCart role="button" size="1.6rem" onClick={() => handleRemoveFromCart(item.id)} />
                  </td>
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
