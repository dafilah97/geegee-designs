"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl mb-2">Admin Portal</h1>
          <p className="text-gray-500 text-sm">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg border border-red-100 text-center font-medium">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">Email Address</label>
            <input 
              required 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none transition-all"
              placeholder="gaetshosebe@gmail.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">Password</label>
            <input 
              required 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-900 transition-colors disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
