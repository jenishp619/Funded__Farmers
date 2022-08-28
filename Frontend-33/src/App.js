import "./App.css";
//import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { BrowserRouter, Route, Routes, Link, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Homepage from "./components/Homepage";
import ProductDetails from "./components/ProductDetails";
import Fileupload from "./components/uploadpage";
import { Register } from "./components/Register";
import { Login } from "./components/Login";
import { Confirmation } from "./components/Confirmation";
import Logout from "./components/Logout";
import { Grid, Box } from "@mui/material";
import Visualizations from "./components/Visualization";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
          <a class="navbar-brand" href="/">
            Farmer's Market
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
              <a class="nav-item nav-link" href="/register">
                Register
              </a>
              <a class="nav-item nav-link" href="/getproducts">
                All Products
              </a>
              <a class="nav-item nav-link" href="/uploadproducts">
                Add products
              </a>
              <a
                class="nav-item nav-link"
                href="https://farmer33.herokuapp.com/visualization"
              >
                Visualizations
              </a>
              <a class="nav-item nav-link" href="/logout">
                Logout
              </a>
            </div>
          </div>
        </nav>
        <Box sx={{ height: "100vh", width: "100vw" }}>
          <Routes>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/confirmation" element={<Confirmation />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/" element={<Login />}></Route>
            <Route path="/visualization" element={<Visualizations />}></Route>
            <Route
              path="/get-product-details/:uuid"
              element={<ProductDetails />}
            ></Route>
            <Route path="/getproducts" element={<Homepage />}></Route>
            <Route path="/uploadproducts" element={<Fileupload />}></Route>
            <Route path="/logout" element={<Logout />}></Route>
          </Routes>
        </Box>
      </BrowserRouter>
    </div>
  );
}
export default App;
