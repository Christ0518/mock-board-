'use client';
import Admin_page from '../../components/admin_page';
import { useState, useEffect } from 'react';
import { Fetch_to } from "../../utilities";
import { useRouter } from 'next/navigation';

export default function AdminPage() {
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

  return <Admin_page email={email} />;
}