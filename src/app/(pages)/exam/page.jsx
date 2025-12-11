"use client";
import { AvailableExams } from "../../components";
import { useState, useEffect } from 'react';
import { Fetch_to } from "../../utilities";
import { useRouter } from 'next/navigation';

export default function ExamPage() {
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


  return <AvailableExams email={email} />;
}
