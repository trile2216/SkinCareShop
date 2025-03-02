import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductForm = ({ product, onSubmit }) => {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [skinTypes, setSkinTypes] = useState([]);

    useEffect(() => {
        // Fetch categories
        axios.get("http://localhost:5286/api/categories")
            .then(response => setCategories(response.data))
            .catch(error => console.error("Error fetching categories:", error));

        // Fetch brands  
        axios.get("http://localhost:5286/api/brands")
            .then(response => setBrands(response.data))
            .catch(error => console.error("Error fetching brands:", error));

        // Fetch skin types
        axios.get("http://localhost:5286/api/skintypes")
            .then(response => setSkinTypes(response.data))
            .catch(error => console.error("Error fetching skin types:", error));
    }, []);

    return (
        <form onSubmit={onSubmit}>
            {/* Other form fields */}

            <div className="mb-4">
                <label className="block mb-2">Category</label>
                <select
                    name="categoryId"
                    value={product.categoryId}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block mb-2">Brand</label>
                <select
                    name="brandId"
                    value={product.brandId}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                >
                    <option value="">Select Brand</option>
                    {brands.map(brand => (
                        <option key={brand.id} value={brand.id}>
                            {brand.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block mb-2">Skin Types</label>
                <div className="space-y-2">
                    {skinTypes.map(skinType => (
                        <label key={skinType.id} className="flex items-center">
                            <input
                                type="checkbox"
                                name="skinTypes"
                                value={skinType.id}
                                checked={product.skinTypes?.includes(skinType.id)}
                                onChange={handleSkinTypeChange}
                                className="mr-2"
                            />
                            {skinType.name}
                        </label>
                    ))}
                </div>
            </div>

            {/* Submit button */}
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Save Product
            </button>
        </form>
    );
};

export default ProductForm; 