'use client';
import{ Form  } from '../../components/';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Fetch_to } from "../../utilities";

export default function FormPage() {
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

  return < Form  email={email} />;
}