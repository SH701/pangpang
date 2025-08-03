"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "./loadingscreen";

export default function ClientLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);
  return <>{loading ? <LoadingScreen /> : children}</>;
}