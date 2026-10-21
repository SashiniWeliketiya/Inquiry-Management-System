'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Inquiry {
  id: number;
  customer_name: string;
  contact_info: string;
  subject: string;
  description: string;
  status: 'New' | 'In Progress' | 'Resolved';
  created_at: string;
}

export default function DashboardPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // New Inquiry Form State
  const [formData, setFormData] = useState({
    customer_name: '',
    contact_info: '',
    subject: '',
    description: '',
  });

  const router = useRouter();

  const fetchInquiries = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    setLoading(true);
    try {
      const url = statusFilter
        ? `http://localhost:5000/api/inquiries?status=${statusFilter}`
        : 'http://localhost:5000/api/inquiries';

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch inquiries');
      const data = await res.json();
      setInquiries(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const handleCreateInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:5000/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create inquiry');
      }

      setFormData({ customer_name: '', contact_info: '', subject: '', description: '' });
      fetchInquiries();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:5000/api/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error);
      }

      fetchInquiries();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- Delete Handler Function ---
  const handleDeleteInquiry = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:5000/api/inquiries/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete inquiry');
      }

      // Remove deleted inquiry from local state instantly
      setInquiries((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <div 
      className="min-h-screen relative bg-cover bg-center flex flex-col"
      style={{
        backgroundImage: `url('/coffee-bg.jpg')`,
      }}
    >
      {/* Dark Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="bg-amber-950/80 backdrop-blur-md text-white p-4 px-6 flex justify-between items-center shadow-lg border-b border-amber-900/30">
          <h1 className="text-xl font-bold tracking-wide">Coffee Ninja Workspace</h1>
          <button
            onClick={handleLogout}
            className="bg-amber-700 hover:bg-amber-800 px-4 py-1.5 rounded-lg text-sm font-medium transition shadow"
          >
            Sign Out
          </button>
        </nav>

        {/* Dashboard Grid Container */}
        <div className="max-w-6xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
          
          {/* Form Column */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl h-fit border border-white/40">
            <h2 className="text-lg font-bold mb-4 text-amber-950">Record New Inquiry</h2>
            <form onSubmit={handleCreateInquiry} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700">Customer Name</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 bg-white/80 p-2.5 rounded-lg text-sm mt-1 focus:ring-2 focus:ring-amber-600 outline-none"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700">Contact Info</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 bg-white/80 p-2.5 rounded-lg text-sm mt-1 focus:ring-2 focus:ring-amber-600 outline-none"
                  value={formData.contact_info}
                  onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700">Subject</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 bg-white/80 p-2.5 rounded-lg text-sm mt-1 focus:ring-2 focus:ring-amber-600 outline-none"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700">Description</label>
                <textarea
                  required
                  rows={3}
                  className="w-full border border-gray-300 bg-white/80 p-2.5 rounded-lg text-sm mt-1 focus:ring-2 focus:ring-amber-600 outline-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-amber-800 hover:bg-amber-900 text-white font-semibold py-2.5 rounded-lg text-sm transition shadow-md"
              >
                Submit Inquiry
              </button>
            </form>
          </div>

          {/* List Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex justify-between items-center bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/40">
              <h2 className="text-lg font-bold text-amber-950">Inquiry Overview</h2>
              <select
                className="border border-gray-300 bg-white/90 p-2 rounded-lg text-sm focus:ring-2 focus:ring-amber-600 outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {loading ? (
              <p className="text-white font-medium text-center py-8">Loading inquiries...</p>
            ) : inquiries.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl text-center text-gray-600 border border-white/40">
                No inquiries found.
              </div>
            ) : (
              <div className="space-y-3">
                {inquiries.map((item) => (
                  <div key={item.id} className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border-l-4 border-amber-800 flex justify-between items-start border border-white/40">
                    <div>
                      <h3 className="font-bold text-gray-900">{item.subject}</h3>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {item.customer_name} ({item.contact_info})
                      </p>
                      <p className="text-sm text-gray-700 mt-2">{item.description}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2.5 py-1 text-xs rounded-full font-semibold ${
                        item.status === 'New' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        item.status === 'In Progress' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                        {item.status}
                      </span>

                      {/* Quick Action Buttons */}
                      <div className="flex flex-wrap justify-end gap-1 mt-2">
                        {item.status === 'New' && (
                          <button
                            onClick={() => handleStatusUpdate(item.id, 'In Progress')}
                            className="text-xs bg-amber-600 text-white px-2.5 py-1 rounded-lg hover:bg-amber-700 transition font-medium"
                          >
                            Start Progress
                          </button>
                        )}
                        {item.status === 'In Progress' && (
                          <button
                            onClick={() => handleStatusUpdate(item.id, 'Resolved')}
                            className="text-xs bg-green-600 text-white px-2.5 py-1 rounded-lg hover:bg-green-700 transition font-medium"
                          >
                            Resolve
                          </button>
                        )}
                        {item.status === 'Resolved' && (
                          <button
                            onClick={() => handleStatusUpdate(item.id, 'In Progress')}
                            className="text-xs bg-gray-600 text-white px-2.5 py-1 rounded-lg hover:bg-gray-700 transition font-medium"
                          >
                            Reopen
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteInquiry(item.id)}
                          className="text-xs bg-red-600 text-white px-2.5 py-1 rounded-lg hover:bg-red-700 transition font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}