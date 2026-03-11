"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { rtdb } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function DatabaseViewPage() {
  const router = useRouter();
  const [data, setData] = useState<object | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Security check
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const playerName = localStorage.getItem('playerName');
    
    if (!isAdmin || playerName !== 'rahee') {
      router.push('/login');
    } else {
      setIsAuthorized(true);
      const dbRef = ref(rtdb);
      const unsubscribe = onValue(dbRef, (snapshot) => {
        setData(snapshot.val());
        setIsLoading(false);
      }, (error) => {
        console.error("Database read error:", error);
        setIsLoading(false);
      });

      return () => unsubscribe();
    }
  }, [router]);

  if (!isAuthorized) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <p>Redirecting...</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
        <CardHeader className='flex-row items-center justify-between'>
          <CardTitle>Realtime Database Viewer</CardTitle>
          <Button asChild variant="outline">
            <Link href="/main-menu">Back to Menu</Link>
          </Button>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="ml-2">Loading Database...</p>
            </div>
          ) : (
            <ScrollArea className="h-full w-full rounded-md border p-4">
              <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
