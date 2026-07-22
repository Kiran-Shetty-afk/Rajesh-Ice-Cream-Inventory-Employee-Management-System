import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from './StatCard';
import { Activity } from 'lucide-react';
import React from 'react';

describe('StatCard component', () => {
  it('renders label, value, and detail', () => {
    render(
      <StatCard 
        label="Total Sales" 
        value="$50,000" 
        detail="Updated just now" 
        icon={Activity} 
      />
    );

    expect(screen.getByText('Total Sales')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
    expect(screen.getByText('Updated just now')).toBeInTheDocument();
  });
});
