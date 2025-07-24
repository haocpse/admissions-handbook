import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { GoogleLogin } from '@react-oauth/google';
import "./Login.css";

const Login = () => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [accountRe, setAccountRe] = useState('');
  const [passwordRe, setPasswordRe] = useState('');
  const [emailRe, setEmailRe] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const container = document.querySelector(".login-container");
    const registerBtn = document.querySelector(".register-btn");
    const loginBtn = document.querySelector(".login-btn");

    const handleRegisterClick = () => {
      container.classList.add("active");
    };
    const handleLoginClick = () => {
      container.classList.remove("active");
    };

    registerBtn.addEventListener("click", handleRegisterClick);
    loginBtn.addEventListener("click", handleLoginClick);

    return () => {
      registerBtn.removeEventListener("click", handleRegisterClick);
      loginBtn.removeEventListener("click", handleLoginClick);
    };
  }, []);

  function getRoleFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const roles = decodedToken.scope || decodedToken.roles || decodedToken.authorities;
      return roles;
    }
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/login", {
        username: account,
        password: password
      });
      toast.success("Login Successfully")
      console.log(response.data);
      localStorage.setItem('token', response.data.data.accessToken);
      const roles = getRoleFromToken();
      console.log(roles);
      if (roles === "ADMIN" || roles === "STAFF" ) {
        navigate('/admin')
      } else if (roles === "USER") {
        navigate('/')
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      toast.error("Login fail");
    } finally {
      setIsLoading(false);
    }
  }
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/register", {
        username: accountRe,
        password: passwordRe,
        email: emailRe
      });
      toast.success("Register Successfully");
      navigate('/login')
    } catch (error) {
      console.error(error)
      toast.error("Register Fail")
    }
  }

  const handleGoogleLogin = async (credentialResponse) => {
  try {
    const token = credentialResponse.credential;
    const decoded = jwtDecode(token);
    const response = await axios.post('/api/auth/gmail-login', {
      email: decoded.email,
      name: decoded.name
    });

    localStorage.setItem('token', response.data.data.accessToken);
    toast.success("Login Successfully");

    const roles = getRoleFromToken();
    if (roles === "ADMIN") {
      navigate('/admin');
    } else if (roles === "USER") {
      navigate('/');
    } else {
      navigate('/');
    }
  } catch (error) {
    console.error("Google Login Error:", error);
    toast.error("Google Login Failed");
  }
};


  return (
    // login
    <div className="login-page">
      <div className="login-container">
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        <div className="form-box login">
          <form onSubmit={handleLogin}>
            <h1>Login</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                required
                value={account}
                onChange={(e) => setAccount(e.target.value)}
              />
              <i className="bx bxs-user"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i className="bx bxs-lock-alt"></i>
            </div>
            <div className="forgot-link">
              <a href="#">Forgot Password?</a>
            </div>
            <button type="submit" className="button" disabled={isLoading}>
              {isLoading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : "LOGIN"}
            </button>
            <p>or login with social platforms</p>
            <div className="social-icons">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  console.log("Login Failed");
                  toast.error("Google Login Failed");
                }}
              />
            </div>
          </form>
        </div>


        {/*dang ki */}
        <div className="form-box register">
          <form onSubmit={handleRegister}>
            <h1>Registration</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                required
                value={accountRe}
                onChange={(e) => setAccountRe(e.target.value)}
              />
              <i className="bx bxs-user"></i>
            </div>
            <div className="input-box">
              <input
                type="text"
                placeholder="Email"
                required
                value={emailRe}
                onChange={(e) => setEmailRe(e.target.value)}
              />
              <i className="bx bxs-envelope"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                required
                value={passwordRe}
                onChange={(e) => setPasswordRe(e.target.value)}
              />
              <i className="bx bxs-lock-alt"></i>
            </div>
            <button type="submit" className="button" disabled={isLoading}>
              {isLoading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : "REGISTER"}
            </button>
            <p>or register with social platforms</p>
            <div className="social-icons">
              <a href="/login"><i className="bx bxl-google"></i></a>
            </div>
          </form>
        </div>

        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Welcome to 360Book !</h1>
            <p>Don't have an account?</p>
            <button className="button register-btn">Register</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button className="button login-btn">Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
