import React from "react";
import { useQuery, gql } from "@apollo/client";
import Navbar from "./NavBar";

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      name
      email
    }
  }
`;

const UsersList = () => {
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const users = data.getUsers;

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <strong>{user.name}</strong> - {user.email}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default UsersList;
