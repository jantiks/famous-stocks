// src/components/Home.tsx
import React from 'react';
import SenatorTable from './SentaorTable';
import { mockSenators } from '../interfaces/Senator';

const Home: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Senator Trading Dashboard</h1>
      <SenatorTable senators={mockSenators} />
    </div>
  );
};

export default Home;