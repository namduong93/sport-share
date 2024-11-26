// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { screen } from '@testing-library/react';
import { PasswordRecovery } from './PasswordRecovery';
import { contextRender } from '../../../test_utils/contextRender';


describe('PasswordRecovery', () => {
  it('Renders correctly', () => {
    // ARRANGE
    contextRender(<PasswordRecovery />)
    // ACT

    // EXPECT
    
    expect(screen.getByRole('img')).toBeVisible();
  });
});