"use client";
import { Dashboard } from "../../components";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Fetch_to } from "../../utilities";


export default function DashboardPage() {
  const router = useRouter();
  
  useEffect(() => {
        async function check() {
            const response = await Fetch_to("/services/jwt/verify");
            if (!response.success) return router.push("/");
        }
        check();
    }, []);

  return (
   <>
    <Dashboard />
   </>
  );
}