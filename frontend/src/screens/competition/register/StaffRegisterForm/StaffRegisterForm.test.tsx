// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { screen } from '@testing-library/react';
import { contextRender } from '../../../../test_utils/contextRender';
import { StaffRegisterForm } from './StaffRegisterForm';
import userEvent from '@testing-library/user-event';


describe('PasswordRecovery', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    contextRender(<StaffRegisterForm />)
    // ACT

    // EXPECT
    const coachCheckbox = screen.getByLabelText('Coach');
    const siteCoordinatorCheckbox = screen.getByLabelText('Site Coordinator');
    const adminCheckbox = screen.getByLabelText('Administrator');

    expect(coachCheckbox).toBeInstanceOf(HTMLInputElement);
    expect(siteCoordinatorCheckbox).toBeInstanceOf(HTMLInputElement);
    expect(adminCheckbox).toBeInstanceOf(HTMLInputElement);
    
    await userEvent.click(coachCheckbox);
    expect(screen.getByText('Competition Biography')).toBeVisible();
    expect(screen.getByPlaceholderText(/Enter a description/i)).toBeInstanceOf(HTMLTextAreaElement);


    await userEvent.click(siteCoordinatorCheckbox);
    expect(screen.getByText('Site Overseeing')).toBeVisible();
    expect(screen.getByText('Capacity Constraints')).toBeVisible();
    expect(screen.getByPlaceholderText(/Enter a description/i)).toBeInstanceOf(HTMLTextAreaElement);
  });
});