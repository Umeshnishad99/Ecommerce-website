
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

function ProductDetail() {
    const { id } = useParams();
    const baseUrl =
        import.meta.env.VITE_DJANGO_BASE_URL || "http://localhost:8000";

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {addToCart} = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/products/${id}/`);

                if (!response.ok) {
                    throw new Error("Failed to fetch product details");
                }

                const data = await response.json();
                setProduct(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <p className="text-gray-600 text-base sm:text-lg">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <p className="text-red-500 text-center text-sm sm:text-base">
                    Error: {error}
                </p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <p className="text-gray-600 text-sm sm:text-base">
                    No product found.
                </p>
            </div>
        );
    }

    const handleAddToCart =()=>{
        if(!localStorage.getItem('access_token')){
            window.location.href ='/login'
            return;
        }
        addToCart(product.id);
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-3 py-6 sm:px-5 sm:py-10">
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md w-full max-w-4xl">

                <div className="flex flex-col md:flex-row gap-5 sm:gap-8">

                    {/* Product Image */}
                    <div className="w-full md:w-1/2">
                        <img
                            src={`${baseUrl}${product.image}`}
                            alt={product.name}
                            className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg"
                        />
                    </div>

                    {/* Product Information */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center">

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 break-words">
                            {product.name}
                        </h1>

                        <p className="text-gray-600 text-sm sm:text-base leading-6 sm:leading-7 mb-4">
                            {product.description}
                        </p>

                        <p className="text-gray-800 font-bold text-xl sm:text-2xl mb-5">
                            ${product.price}
                        </p>

                        <button
                            onClick={handleAddToCart}
                            className="w-full sm:w-auto bg-blue-500 text-white px-5 py-2.5 sm:py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300 text-sm sm:text-base"
                        >
                            Add to Cart
                        </button>
                        {/* Home Button */}
                        <div className="mt-4">

                        <a href="/"
                            className="text-blue-600 hover:underline"
                        >
                            &larr; Back to Products
                        </a>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
