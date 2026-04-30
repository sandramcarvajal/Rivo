import React from 'react';

export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
