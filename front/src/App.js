import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Catalog from "./pages/Catalog";
import Footer from "./components/Footer";
import Main from "./pages/Main";
import {useState} from "react";
import Discounts from "./pages/Discounts";

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
                  <Route
                      path="/product"
                      element={<Catalog filters={filters} setFilters={setFilters}/>}
                  />
                  {/*<Route*/}
                  {/*    path="/product?cat=1"*/}
                  {/*    element={<Catalog filters={filters} setFilters={setFilters} categoryId={"1"} />}*/}
                  {/*/>*/}
                  {/*<Route*/}
                  {/*    path="/product/2"*/}
                  {/*    element={<Catalog filters={filters} setFilters={setFilters} categoryId={"2"} />}*/}
                  {/*/>*/}
                  {/*<Route*/}
                  {/*    path="/product/3"*/}
                  {/*    element={<Catalog filters={filters} setFilters={setFilters} categoryId={"3"} />}*/}
                  {/*/>*/}
                  {/*<Route*/}
                  {/*    path="/product/4"*/}
                  {/*    element={<Catalog filters={filters} setFilters={setFilters} categoryId={"4"} />}*/}
                  {/*/>*/}
                  <Route
                      path="/discounts"
                      element={<Discounts filters={filters} setFilters={setFilters}/>}
                  />
              </Routes>
          </Router>
  );
}

export default App;
