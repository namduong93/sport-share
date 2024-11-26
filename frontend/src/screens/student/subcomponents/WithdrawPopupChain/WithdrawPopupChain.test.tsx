// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '../../../../test_utils/mock_server';
import { contextRender } from '../../../../test_utils/contextRender';
import { WithdrawPopupChain } from './WithdrawPopupChain';

server.listen();

describe('WithdrawPopupChain', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    await waitFor(() => contextRender(<WithdrawPopupChain handleClose={() => {}} />));

    expect(screen.getByText(/Do you still/i)).toBeVisible();
    
    const proceedButton = screen.getByText('Proceed');
    expect(proceedButton).toBeInstanceOf(HTMLButtonElement);
    expect(screen.getByText('Cancel')).toBeInstanceOf(HTMLButtonElement);

    await userEvent.click(proceedButton);
    expect(screen.getByText(/Are you sure/i)).toBeVisible();

    const yesButton = screen.getByText('Yes');
    expect(yesButton).toBeInstanceOf(HTMLButtonElement);
    expect(screen.getByText('No')).toBeInstanceOf(HTMLButtonElement);

    await userEvent.click(yesButton);
    expect(screen.getByText(/Copy and send your/i)).toBeVisible();

    expect(screen.getByText('code1234')).toBeVisible();

  });

});