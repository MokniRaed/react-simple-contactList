import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate()

  const submitLogin = () => {
    axios
      .post("http://localhost:5000/login", user)
      .then((response) => {
        response.status === 200
          ? navigate("/dashboard")
          : console.log("failed to connect");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2>Enter your login informations</h2>
      <input
        name="email"
        type="email"
        placeholder="email@gmail.com"
        onChange={(event) => setUser({ ...user, email: event.target.value })}
      />
      <input
        name="password"
        c
        type="password"
        placeholder="*******"
        onChange={(event) => setUser({ ...user, password: event.target.value })}
      />
      <button onClick={() => submitLogin()}>Login</button>
    </div>
  );
}

export default Login;
