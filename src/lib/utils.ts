import React from 'react';

export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export function toTitleCase(str: string = ""): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
