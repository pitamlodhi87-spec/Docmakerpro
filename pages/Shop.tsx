
import React, { useEffect, useState } from 'react';
import { ShoppingBag, CreditCard, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
}

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetch('http://localhost:3000/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
         console.error(err);
         setLoading(false);
      });
  }, []);

  const handleBuy = async (productId: number, price: number) => {
    if (!userId) {
        navigate('/login');
        return;
    }

    // 1. UPI Intent Flow (Simulated)
    const upiId = "merchant@upi"; 
    const upiLink = `upi://pay?pa=${upiId}&pn=FileMaker&am=${price}&cu=INR`;
    
    // In a real mobile app, we would do: window.location.href = upiLink;
    // For this web simulation, we confirm and call backend.
    
    if (window.confirm(`Pay ₹${price} via UPI? This will simulate a successful transaction.`)) {
        try {
            const res = await fetch('http://localhost:3000/product/buy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, productId })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Payment Successful! Product added to your account.');
            } else {
                alert(data.error);
            }
        } catch(e) {
            alert("Transaction failed");
        }
    }
  };

  if (loading) return <div className="text-center py-10">Loading Products...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center py-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Premium Tools Shop</h1>
        <p className="text-gray-500">Upgrade your experience with our premium products.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {products.length === 0 ? (
             <div className="col-span-3 text-center text-gray-500 bg-gray-50 p-10 rounded-xl">
                 No products available. Admin needs to add products.
             </div>
         ) : (
             products.map(product => (
                 <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 text-center">
                        <ShoppingBag size={48} className="mx-auto text-chrome-blue mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">{product.title}</h3>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                        <div className="text-3xl font-extrabold text-gray-900 mb-4 text-center">
                           ₹{product.price}
                        </div>
                        <p className="text-gray-600 mb-6 flex-grow">{product.description}</p>
                        <button 
                          onClick={() => handleBuy(product.id, product.price)}
                          className="w-full bg-chrome-blue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                           <CreditCard size={18} /> Buy with UPI
                        </button>
                    </div>
                 </div>
             ))
         )}
      </div>
    </div>
  );
};

export default Shop;
