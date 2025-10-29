import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../App";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct, deleteProduct } = useProducts();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First check if product exists in our state
    const foundProduct = getProduct(id);

    if (foundProduct) {
      setProduct(foundProduct);
      setLoading(false);
    } else {
      // If not found in state, fetch from API (for direct URL access)
      fetchProductFromAPI();
    }
  }, [id]);

  const fetchProductFromAPI = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);

      if (!response.ok) {
        throw new Error("Product not found");
      }

      const data = await response.json();
      setProduct(data);
    } catch (err) {
      console.error("Error:", err);
      alert("Product not found!");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
      alert("Product deleted successfully!");
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error">
        Product not found!
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/")}
          style={{ marginTop: "20px" }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="product-details">
        <div className="details-grid">
          <div>
            <img
              src={product.image}
              alt={product.title}
              className="details-image"
            />
          </div>
          <div className="details-info">
            <h2>{product.title}</h2>
            <span className="details-category">{product.category}</span>
            <p className="product-price details-price">${product.price}</p>

            {product.rating && (
              <div className="details-rating">
                <strong>Rating:</strong> ⭐ {product.rating.rate} / 5 (
                {product.rating.count} reviews)
              </div>
            )}

            <p className="details-description">{product.description}</p>

            <div className="button-group">
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/edit-product/${id}`)}
              >
                Edit Product
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete Product
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/")}
              >
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
