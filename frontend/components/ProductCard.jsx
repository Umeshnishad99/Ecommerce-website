import { Link } from 'react-router-dom'
function ProductCard({ product }) {
    const baseUrl = import.meta.env.VITE_DJANGO_BASE_URL || 'http://localhost:8000';
    return (
        <Link to={`/product/${product.id}`} className="bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform p-4 cursor-pointer">
            <div className="bg-white p-4 rounded shadow mb-4 hover:shadow-lg transition-shadow duration-300">
                <img src={`${baseUrl}${product.image}`} alt={product.name} className="w-full h-48 object-cover rounded mb-4" />
                <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-gray-800 font-bold">${product.price}</p>
            </div>
        </Link>
    )
}

export default ProductCard