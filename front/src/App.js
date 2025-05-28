import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Catalog from "./pages/Catalog";
import Footer from "./components/Footer";
import Main from "./pages/Main";
import {useState} from "react";
import Discounts from "./pages/Discounts";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";

function App() {
    const [filters, setFilters] = useState({
        search: "",
        categoryId: "",
        sortOrder: ""
    });
  return (
          <Router>
              <Routes>
                  <Route path="/" element={<Main filters={filters} setFilters={setFilters}/>} />
                  <Route path="/product/search" element={<Catalog filters={filters} setFilters={setFilters} categoryId={"0"}/>} />
                  <Route path="/product/details" element={<ProductDetails filters={filters} setFilters={setFilters} />} />
                  <Route path="/login" element={<Login filters={filters} setFilters={setFilters}/>} />
                  <Route path="/register" element={<Register filters={filters} setFilters={setFilters}/>} />
                  <Route path="/wishlist" element={<Wishlist filters={filters} setFilters={setFilters}/>} />
                  <Route path="/cart" element={<Cart filters={filters} setFilters={setFilters}/>} />
                  <Route path="/orders" element={<Orders filters={filters} setFilters={setFilters}/>} />
                  <Route
                      path="/product"
                      element={<Catalog filters={filters} setFilters={setFilters}/>}
                  />
                  <Route
                      path="/discounts"
                      element={<Discounts filters={filters} setFilters={setFilters}/>}
                  />
              </Routes>
          </Router>
  );
}

export default App;
