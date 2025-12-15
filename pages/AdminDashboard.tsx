
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, PlusCircle, Package } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'products'>('users');
  
  // New Product State
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (role !== 'ADMIN') {
        navigate('/login');
        return;
    }
    fetchUsers();
  }, [role, navigate]);

  const fetchUsers = async () => {
    const res = await fetch('http://localhost:3000/admin/users');
    const data = await res.json();
    setUsers(data);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/product/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: desc, price, role: 'ADMIN' })
    });
    if (res.ok) {
        alert("Product Added!");
        setTitle(''); setDesc(''); setPrice('');
    } else {
        alert("Failed to add product");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
       <div className="bg-gray-900 text-white p-8 rounded-2xl">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage users, products, and sales.</p>
       </div>

       <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('users')} 
            className={`px-6 py-2 rounded-lg font-bold ${activeTab === 'users' ? 'bg-chrome-blue text-white' : 'bg-white text-gray-600'}`}
          >
             User Management
          </button>
          <button 
            onClick={() => setActiveTab('products')} 
            className={`px-6 py-2 rounded-lg font-bold ${activeTab === 'products' ? 'bg-chrome-blue text-white' : 'bg-white text-gray-600'}`}
          >
             Add Products
          </button>
       </div>

       {activeTab === 'users' ? (
           <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                      <tr>
                          <th className="p-4">ID</th>
                          <th className="p-4">Name</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Purchases</th>
                      </tr>
                  </thead>
                  <tbody>
                      {users.map(user => (
                          <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="p-4 text-gray-500">#{user.id}</td>
                              <td className="p-4 font-medium">{user.name} <span className="text-xs text-gray-400">({user.role})</span></td>
                              <td className="p-4 text-gray-600">{user.email}</td>
                              <td className="p-4">
                                  {user.purchases && user.purchases.length > 0 ? (
                                      <div className="space-y-1">
                                          {user.purchases.map((p: any) => (
                                              <div key={p.id} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded w-fit">
                                                  {p.product.title}
                                              </div>
                                          ))}
                                      </div>
                                  ) : <span className="text-gray-400 text-sm">No purchases</span>}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
           </div>
       ) : (
           <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-2xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <PlusCircle size={20} /> Add New Product
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Product Title</label>
                      <input type="text" className="w-full border p-2 rounded" value={title} onChange={e => setTitle(e.target.value)} required />
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Price (INR)</label>
                      <input type="number" className="w-full border p-2 rounded" value={price} onChange={e => setPrice(e.target.value)} required />
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                      <textarea className="w-full border p-2 rounded" value={desc} onChange={e => setDesc(e.target.value)} required></textarea>
                  </div>
                  <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700">Publish Product</button>
              </form>
           </div>
       )}
    </div>
  );
};

export default AdminDashboard;
