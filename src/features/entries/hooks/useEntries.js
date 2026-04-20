import { useState } from 'react';

export function useEntries() {
  const [entries] = useState([
    {
      id: '1',
      name: 'Ashly',
      email: 'ashly@example.com',
      consentNewsletter: true,
      createdAt: '2026-04-19'
    }
  ]);

  return { entries };
}
