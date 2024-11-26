// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
//
import { screen, waitFor } from '@testing-library/react';
import { CompRegisterFormProvider } from '../../CompRegisterFormProvider';
import { CompExperienceInput } from './CompExperienceInput';
import { contextRender } from '../../../../../../test_utils/contextRender';


describe('CompExperienceInput', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    await waitFor(() => contextRender(
      <CompRegisterFormProvider>
        <CompExperienceInput />
      </CompRegisterFormProvider>
    ));
    // ACT

    // EXPECT

    expect(screen.getAllByText(/Competitive Experience/).length).toBe(2);
    // successfully renders the course that were given from
    // the route, (see the mock_handlers)
    expect(screen.getByText(/University Courses Complete/i)).toBeVisible();
    expect(screen.getByLabelText(/1511/)).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByLabelText(/2521/)).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByLabelText(/3121/)).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByLabelText(/4128/)).toBeInstanceOf(HTMLInputElement);

    expect(screen.getByText(/University Courses Complete/i)).toBeVisible();
    expect(screen.getByText(/Codeforces Score/i)).toBeVisible();
    expect(screen.getByPlaceholderText(/Please enter/i)).toBeInstanceOf(HTMLInputElement);

    expect(screen.getByText(/ICPC Regional Participation/i)).toBeVisible();
    
    expect(screen.getAllByLabelText('Yes').length).toBe(4);
    expect(screen.getAllByLabelText('No').length).toBe(4);

  });
});