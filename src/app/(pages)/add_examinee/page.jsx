'use client';
import Add_examinee from '../../components/';
import { useState, useEffect } from 'react';
import { Fetch_to } from "../../utilities";
import { useRouter } from 'next/navigation';

export default function Add_examineePage() {
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

  return <Add_examinee email={email} />;
}