"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Diamond } from "lucide-react";

const SplashScreen = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      router.push("/login");
    }, 3000); // 3-second splash screen

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="text-center">
        <div
          className={`mx-auto transition-all duration-1000 ease-in-out ${
            isMounted ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          <Diamond className="w-24 h-24 text-primary mx-auto animate-pulse" />
        </div>
        <h1
          className={`font-headline text-5xl font-bold tracking-tighter mt-4 transition-opacity duration-1000 delay-500 ease-in-out ${
            isMounted ? "opacity-100" : "opacity-0"
          }`}
        >
          Rahee Cards
        </h1>
        <p
          className={`text-muted-foreground mt-2 transition-opacity duration-1000 delay-1000 ease-in-out ${
            isMounted ? "opacity-100" : "opacity-0"
          }`}
        >
          The strategic trading card game
        </p>
      </div>
    </div>
  );
};

export default function Home() {
  return <SplashScreen />;
}

