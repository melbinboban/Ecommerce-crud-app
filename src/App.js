import React, { createContext, useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import ProductForm from "./components/ProductForm";
import "./App.css";

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within ProductProvider");
  }
  return context;
};

// Product Provider Component
function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add a new product
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(), // Generate unique ID using timestamp
      rating: { rate: 0, count: 0 },
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  // Update an existing product
  const updateProduct = (id, updatedData) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === parseInt(id) ? { ...product, ...updatedData } : product
      )
    );
  };

  // Delete a product
  const deleteProduct = (id) => {
    setProducts((prev) =>
      prev.filter((product) => product.id !== parseInt(id))
    );
  };

  // Get a single product by ID
  const getProduct = (id) => {
    return products.find((product) => product.id === parseInt(id));
  };

  const value = {
    products,
    setProducts,
    loading,
    setLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export default function App() {
  return (
    <ProductProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/add-product" element={<ProductForm />} />
            <Route path="/edit-product/:id" element={<ProductForm />} />
          </Routes>
        </div>
      </Router>
    </ProductProvider>
  );
}
