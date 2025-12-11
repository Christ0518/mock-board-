'use client';
import Admin_page from '../../components/admin_page';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Fetch_to } from "../../utilities";

export default function AdminPage() {
  const router = useRouter();

   useEffect(() => {
          async function check() {
              const response = await Fetch_to("/services/jwt/verify");
              if (!response.success) return router.push("/");
          }
          check();
      }, []);

  return <Admin_page />;
}