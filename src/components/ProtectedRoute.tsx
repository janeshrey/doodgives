import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === null) {
      setLoading(false);
      router.push("/signin");
    } else {
      setLoading(false);
    }
  }, [user, router]);

  if (loading) return <p>Loading...</p>; // Prevents immediate redirect

  return <>{children}</>;
}