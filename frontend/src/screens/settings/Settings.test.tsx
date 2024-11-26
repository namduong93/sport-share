// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { screen, waitFor } from '@testing-library/react';
import { contextRender } from '../../test_utils/contextRender';
import { Settings } from './Settings';
import { server } from '../../test_utils/mock_server';
import userEvent from '@testing-library/user-event';

server.listen();

describe('Settings', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    await waitFor(() => contextRender(<Settings />));

    expect(screen.getByText('Settings Page')).toBeVisible();

    const updatePasswordDiv = screen.getByText(/Update Password/i);
    const faqsDiv = screen.getByText(/FAQs/i);
    const appearancesDiv = screen.getByText(/Appearances/);
    const creditsDiv = screen.getByText(/Credits/);

    expect(updatePasswordDiv).toBeVisible();
    expect(faqsDiv).toBeVisible();
    expect(appearancesDiv).toBeVisible();
    expect(creditsDiv).toBeVisible();

    // Then Open appearances
    const lightButton = screen.getByText('Light');
    expect(lightButton).toBeInstanceOf(HTMLButtonElement);

    const appearancesContainer = lightButton.parentElement;

    expect(appearancesContainer).toHaveStyle('max-height: 0');

    await userEvent.click(appearancesDiv);
    expect(appearancesContainer).toHaveStyle('max-height: 100%');

    expect(screen.getByText('Dark')).toBeInstanceOf(HTMLButtonElement);
    expect(screen.getByText('Christmas')).toBeInstanceOf(HTMLButtonElement);
    expect(screen.getByText('Colour Blind')).toBeInstanceOf(HTMLButtonElement);

    // Then Open Update Password
    let updatePasswordForm = document.getElementsByClassName('update-password--form-0')[0];
    expect(updatePasswordForm).toBeUndefined();

    await userEvent.click(updatePasswordDiv);
    updatePasswordForm = document.getElementsByClassName('update-password--form-0')[0];
    expect(updatePasswordForm).toBeVisible();

    expect(screen.getByText(/Current Password/i)).toBeVisible();
    expect(screen.getByText('New Password')).toBeVisible();
    expect(screen.getByText(/Confirm New Password/i)).toBeVisible();
    
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    expect(passwordInputs.length).toBe(3);
    expect(document.getElementsByClassName('update-password--StyledButton-0')[0]).toBeVisible();
    
  });

});