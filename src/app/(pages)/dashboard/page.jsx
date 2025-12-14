"use client";
import { Dashboard } from "../../components";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Fetch_to } from "../../utilities";


export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState();
  
  useEffect(() => {
        async function check() {
            const response = await Fetch_to("/services/jwt/verify");
            if (!response.success) return router.push("/");
            setEmail(response.data.message.data[0].email);
        }
        check();
    }, []);

  return (
   <>
    <Dashboard email={email} />
   </>
  );
}