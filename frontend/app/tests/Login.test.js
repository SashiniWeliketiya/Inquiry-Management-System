import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App'; 

test('renders Coffee Ninja portal branding or login form', () => {
  render(<App />);
  const brandElement = screen.getByText(/Coffee Ninja/i);
  expect(brandElement).toBeInTheDocument();
});

const handleDelete = async (inquiryId) => {
  if (!window.confirm('Are you sure you want to delete this inquiry?')) return;

  try {
    const response = await fetch(`http://localhost:5000/api/inquiries/${inquiryId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });

    if (response.ok) {
      
      setInquiries((prev) => prev.filter((item) => item.id !== inquiryId));
    } else {
      alert('Failed to delete the inquiry.');
    }
  } catch (error) {
    console.error('Error deleting inquiry:', error);
  }
};