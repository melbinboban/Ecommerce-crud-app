import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../App";

export default function ProductList() {
  const navigate = useNavigate();
  const { products, setProducts, loading, setLoading } = useProducts();
  const [error, setError] = React.useState(null);

  // Fetch products only once when component mounts
  useEffect(() => {
    // Only fetch if products array is empty
    if (products.length === 0) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products");

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError("Failed to load products. Please try again later.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <div className="error">
        {error}
        <button
          className="btn btn-primary"
          onClick={fetchProducts}
          style={{ marginTop: "20px" }}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show products
  return (
    <div className="container">
      <h2 className="page-title">Our Products ({products.length})</h2>
      {products.length === 0 ? (
        <div style={{ textAlign: "center", color: "white", padding: "40px" }}>
          <p style={{ fontSize: "1.2rem" }}>
            No products found. Add your first product!
          </p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <img
                src={product.image}
                alt={product.title}
                className="product-image"
              />
              <h3 className="product-title">{product.title}</h3>
              <p className="product-price">${product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
