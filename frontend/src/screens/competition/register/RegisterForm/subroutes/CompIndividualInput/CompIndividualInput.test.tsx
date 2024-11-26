// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { screen } from '@testing-library/react';
import { contextRender } from '../../../../../../test_utils/contextRender';
import { CompRegisterFormProvider } from '../../CompRegisterFormProvider';
import { CompIndividualInput } from '../CompIndividualInput/CompIndividualInput';


describe('CompIndividualInput', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    contextRender(
      <CompRegisterFormProvider>
        <CompIndividualInput />
      </CompRegisterFormProvider>
    )
    // ACT

    // EXPECT
    expect(screen.getAllByText('Individual Information').length).toBe(2);

    expect(screen.getAllByText('Degree').length).toBe(2);
    expect(screen.getByText(/ICPC Eligibility/)).toBeVisible();
    expect(screen.getByText(/Competition Level/)).toBeVisible();

    expect(screen.getByLabelText(/Level A/i)).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByLabelText(/Level B/i)).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByLabelText(/No Preference/i)).toBeInstanceOf(HTMLInputElement);

    expect(screen.getByText(/Site Attendance/)).toBeVisible();
    expect(screen.getByLabelText(/On Site/i)).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByLabelText(/Remotely/i)).toBeInstanceOf(HTMLInputElement);


    expect(screen.getByText(/Competition Biography/)).toBeVisible();
    expect(screen.getByPlaceholderText(/Enter a description/i)).toBeInstanceOf(HTMLTextAreaElement);

    screen.getAllByPlaceholderText(/Please enter/i).forEach(
      (input) => expect(input).toBeInstanceOf(HTMLInputElement)
    );

  });
});