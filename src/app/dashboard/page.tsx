"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { auth } from "@/lib/firebase";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/signin"); // Redirect if not logged in
    }
  }, [user, router]);

  if (!user) return <p>Loading...</p>;

  return (
    
      <div className="p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>Welcome, {user?.email}</p>
        
        <button onClick={logout} className="p-2 bg-red-500 text-white rounded mt-4">
          Sign Out
        </button>
      </div>
    
  );
}
