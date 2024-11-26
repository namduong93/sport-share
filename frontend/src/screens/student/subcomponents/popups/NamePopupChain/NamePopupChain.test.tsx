// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { screen, waitFor } from '@testing-library/react';
import { server } from '../../../../../test_utils/mock_server';
import { contextRender } from '../../../../../test_utils/contextRender';
import { NamePopupChain } from './NamePopupChain';
import userEvent from '@testing-library/user-event';

server.listen();


describe('NamePopupChain', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    await waitFor(() => contextRender(<NamePopupChain handleClose={() => {}} />));
    
    expect(screen.getByText(/Change Team Name/)).toBeVisible();

    const nameInput = screen.getByPlaceholderText(/Enter new name/i);
    expect(nameInput).toBeInstanceOf(HTMLInputElement);

    await userEvent.type(nameInput, 'test new name');

    expect(screen.queryByText(/Are you sure/i)).toBeNull();
    const requestButton = screen.getByText('Request');
    await userEvent.click(requestButton);
    
    expect(screen.getByText(/Are you sure/i)).toBeVisible();

    const yesButton = screen.getByText('Yes');
    expect(yesButton).toBeInstanceOf(HTMLButtonElement);
    expect(screen.getByText('No')).toBeInstanceOf(HTMLButtonElement);
    
    await userEvent.click(yesButton);

    expect(screen.getByText(/Your team's new name/i)).toBeVisible();
  
  });

});