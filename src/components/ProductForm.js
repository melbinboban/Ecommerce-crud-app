import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../App";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const { getProduct, addProduct, updateProduct } = useProducts();

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    image: "",
    category: "",
  });

  // Validation errors
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // If editing, load product data
  useEffect(() => {
    if (isEditMode) {
      const product = getProduct(id);
      if (product) {
        setFormData({
          title: product.title,
          price: product.price.toString(),
          description: product.description,
          image: product.image,
          category: product.category,
        });
      } else {
        // If product not found in state, try fetching from API
        fetchProductFromAPI();
      }
    }
  }, [id, isEditMode]);

  const fetchProductFromAPI = async () => {
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      const data = await response.json();

      setFormData({
        title: data.title,
        price: data.price.toString(),
        description: data.description,
        image: data.image,
        category: data.category,
      });
    } catch (err) {
      alert("Failed to load product for editing.");
      console.error("Error:", err);
      navigate("/");
    }
  };

  // Validate form before submitting
  const validateForm = () => {
    const newErrors = {};

    // Check title
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    // Check price
    if (
      !formData.price ||
      isNaN(formData.price) ||
      parseFloat(formData.price) <= 0
    ) {
      newErrors.price = "Please enter a valid price greater than 0";
    }

    // Check description
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    // Check image URL
    if (!formData.image.trim()) {
      newErrors.image = "Image URL is required";
    }

    // Check category
    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before submitting
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const productData = {
        title: formData.title,
        price: parseFloat(formData.price),
        description: formData.description,
        image: formData.image,
        category: formData.category,
      };

      if (isEditMode) {
        // Update existing product
        updateProduct(id, productData);
        alert("Product updated successfully!");
      } else {
        // Add new product
        const newProduct = addProduct(productData);
        alert("Product added successfully!");
        console.log("New product created:", newProduct);
      }

      // Navigate back to home page
      navigate("/");
    } catch (err) {
      alert("Failed to save product. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>{isEditMode ? "Edit Product" : "Add New Product"}</h2>
        <form onSubmit={handleSubmit}>
          {/* Title Field */}
          <div className={`form-group ${errors.title ? "has-error" : ""}`}>
            <label htmlFor="title">Product Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter product title"
            />
            {errors.title && (
              <div className="error-message">{errors.title}</div>
            )}
          </div>

          {/* Price Field */}
          <div className={`form-group ${errors.price ? "has-error" : ""}`}>
            <label htmlFor="price">Price ($) *</label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
            />
            {errors.price && (
              <div className="error-message">{errors.price}</div>
            )}
          </div>

          {/* Category Field */}
          <div className={`form-group ${errors.category ? "has-error" : ""}`}>
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="jewelery">Jewelery</option>
              <option value="men's clothing">Men's Clothing</option>
              <option value="women's clothing">Women's Clothing</option>
            </select>
            {errors.category && (
              <div className="error-message">{errors.category}</div>
            )}
          </div>

          {/* Description Field */}
          <div
            className={`form-group ${errors.description ? "has-error" : ""}`}
          >
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
            />
            {errors.description && (
              <div className="error-message">{errors.description}</div>
            )}
          </div>

          {/* Image URL Field */}
          <div className={`form-group ${errors.image ? "has-error" : ""}`}>
            <label htmlFor="image">Image URL *</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            {errors.image && (
              <div className="error-message">{errors.image}</div>
            )}
            {formData.image && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={formData.image}
                  alt="Preview"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    objectFit: "contain",
                    borderRadius: "8px",
                    border: "2px solid #e0e0e0",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="button-group">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isEditMode
                ? "Update Product"
                : "Add Product"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
