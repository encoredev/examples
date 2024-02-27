import React, { useContext, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseContext } from "../lib/firebase.tsx";

const Login = () => {
  const { auth } = useContext(FirebaseContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");

  const loginWithUsernameAndPassword = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth!, email, password);
      navigate("/");
    } catch {
      setNotice("You entered a wrong username or password.");
    }
  };

  return (
    <div className="center">
      <div>
        <form className="loginForm">
          {notice && <div role="alert">{notice}</div>}
          <div>
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input
              type="email"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="exampleInputPassword1">Password</label>
            <input
              type="password"
              id="exampleInputPassword1"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button type="submit" onClick={loginWithUsernameAndPassword}>
              Submit
            </button>
          </div>
          <div>
            <span>
              <Link to="/signup">Sign up for an account</Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
