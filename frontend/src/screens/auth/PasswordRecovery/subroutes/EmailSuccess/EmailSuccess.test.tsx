// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { screen } from '@testing-library/react';
import { contextRender } from '../../../../../test_utils/contextRender';
import { EmailSuccess } from './EmailSuccess';

describe('EmailSuccess', () => {
  it('Renders correctly', () => {
    // ARRANGE
    contextRender(<EmailSuccess />)
    // ACT

    // EXPECT
    
    expect(screen.getByText('Resend Email')).toBeInstanceOf(HTMLButtonElement);
    expect(screen.getByText(/An email.*/i)).toBeVisible(); // the message maybe could change in future
  });
});