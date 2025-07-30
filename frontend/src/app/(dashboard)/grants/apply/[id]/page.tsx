import React from 'react';
import { GrantApplicationClient } from './GrantApplicationClient';

interface GrantApplicationPageProps {
  params: {
    id: string;
  };
}

// Static fallbacks for build-time generation
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
    { id: '9' },
    { id: '10' },
  ];
}

export default function GrantApplicationPage({ params }: GrantApplicationPageProps) {
  return <GrantApplicationClient grantId={params.id} />;
} 