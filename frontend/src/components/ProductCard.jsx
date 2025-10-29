import '../styles/ProductCard.css';

function ProductCard({ product }) {
    return (
        <div className="product-card">
            {product.images?.[0] && (
                <img src={`http://localhost:5000/${product.images[0]}`} 
                alt={product.title}
                className='product-img'
                />
            )}
            <h3>{product.title}</h3>
            <p className='price'>${product.price}</p>
            <p>{product.description}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Contact:</strong>{product.contact}</p>
        </div>
    );
}

export default ProductCard;