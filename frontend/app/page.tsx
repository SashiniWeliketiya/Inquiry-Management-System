'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('alice@coffeeninja.lk');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error("Unable to connect to the backend server. Please check if the backend is running on port 5000.");
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative bg-cover bg-center p-4"
      style={{
        backgroundImage: `url('/coffee-bg.jpg')`,
      }}
    >
      {/* Background Dark Overlay for Contrast */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />

      {/* Login Card with Glassmorphism Effect */}
      <div className="relative z-10 bg-white/85 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/30">
        <h1 className="text-2xl font-bold text-center text-amber-900 mb-1">
          Coffee Ninja (Pvt) Ltd
        </h1>
        <p className="text-sm text-amber-800/80 text-center mb-6 font-medium">
          Staff Inquiry Management Portal
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100/90 text-red-700 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none bg-white/90 text-gray-800 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none bg-white/90 text-gray-800 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-800 hover:bg-amber-900 text-white font-semibold py-2.5 rounded-lg transition duration-200 disabled:opacity-50 shadow-md"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}