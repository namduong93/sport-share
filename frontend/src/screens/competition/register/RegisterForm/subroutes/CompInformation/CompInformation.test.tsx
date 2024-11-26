// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
//
import { screen } from '@testing-library/react';
import { CompRegisterFormProvider } from '../../CompRegisterFormProvider';
import { contextRender } from '../../../../../../test_utils/contextRender';
import { CompetitionInformation } from './CompInformation';


describe('CompExperienceInput', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    contextRender(
      <CompRegisterFormProvider>
        <CompetitionInformation />
      </CompRegisterFormProvider>
    )
    // ACT

    // EXPECT
    expect(screen.getAllByText('Competition Information').length).toBe(2);

  });
});