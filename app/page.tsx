'use client';
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState<{ id: number; name: string; street: string; number: string; neighborhood: string; complement: string; }[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setData(data);
    }
    fetchData().catch(console.error);
    console.log(data);
  }, []);

  return (
    <div className='flex flex-col bg-white'>
      <h1>TESTANDO A API</h1>
      <div>
        {data && data.map(e => (
          <div key={e.id}>
            <p >{e.name}</p>
            <p >{e.street}</p>
            <p >{e.number}</p>
            <p >{e.neighborhood}</p>
            <p >{e.complement}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
