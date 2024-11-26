// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 

import { screen } from '@testing-library/react';
import { EmailForm } from './EmailForm';
import { contextRender } from '../../../../../test_utils/contextRender';

describe('EmailForm', () => {
  it('Renders correctly', () => {
    // ARRANGE
    contextRender(<EmailForm />);
    // ACT

    // EXPECT
    expect(screen.getByRole('heading', {
      level: 1
    })).toHaveTextContent('Recover Password');

    expect(screen.getByPlaceholderText('email@example.com')).toBeInstanceOf(HTMLInputElement);

    expect(screen.getByText('Get Recovery Code')).toBeInstanceOf(HTMLButtonElement);
  });
});