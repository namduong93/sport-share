// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 

import { screen } from '@testing-library/react';
import { contextRender } from '../../../test_utils/contextRender';
import { Login } from './Login';


describe('Login', () => {
  it('Renders correctly', () => {
    // ARRANGE
    contextRender(<Login />);
    // ACT

    // EXPECT
    expect(screen.getByPlaceholderText('Enter your password')).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByPlaceholderText('email@example.com')).toBeInstanceOf(HTMLInputElement);

    expect(screen.getByText('Sign Up')).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByText('Forgot Password?')).toBeInstanceOf(HTMLLabelElement);
  });
});