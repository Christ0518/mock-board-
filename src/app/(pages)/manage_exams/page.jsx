"use client";
import { Manage_exams } from '../../components';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Fetch_to } from "../../utilities";

export default function ManageUsersPage() {
  const router = useRouter();
    const [email, setEmail] = useState();
    
    useEffect(() => {
          async function check() {
              const response = await Fetch_to("/services/jwt/verify");
              if (!response.success) return router.push("/");
              setEmail(response.data.message.email);
          }
          check();
      }, []);

  return <Manage_exams email={email} />;
}