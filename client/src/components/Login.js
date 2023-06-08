import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        email
      }
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

  const handleLogin = async () => {
    try {
      const { data } = await login({
        variables: { email, password },
      });

      // Check if the login was successful
      if (data && data.login && data.login.user) {
        const user = data.login.user;
        console.log(user)

        // Save the user in local storage
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect to the products page
        window.location.href = '/';
      }
    } catch (error) {
      console.error("Failed to perform login:", error);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-4">
          <h2 className="text-center my-4">Login</h2>
          <form>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <div className="text-center">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </form>

          {loading && (
            <div className="text-center mt-3">
              <p className="text-muted">Logging in...</p>
            </div>
          )}

          {error && (
            <div className="text-center mt-3">
              <p className="text-danger">Error occurred while logging in.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
