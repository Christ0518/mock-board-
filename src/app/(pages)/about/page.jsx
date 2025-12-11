'use client';
import About from '../../components/about';
import { useState, useEffect } from 'react';
import { Fetch_to } from "../../utilities";
import { useRouter } from 'next/navigation';


export default function AboutPage() {
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


  return <About email={email} />;
}