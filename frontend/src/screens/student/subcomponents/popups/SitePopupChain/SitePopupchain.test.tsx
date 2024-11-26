// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { screen, waitFor } from '@testing-library/react';
import { server } from '../../../../../test_utils/mock_server';
import { contextRender } from '../../../../../test_utils/contextRender';
import userEvent from '@testing-library/user-event';
import { SitePopupChain } from './SitePopupChain';
import { useState } from 'react';

server.listen();


const TestSitePopup = () => {

  const [siteOptions, setSiteOptions] = useState([{ value: '1', label: 'test site option' }]);
  return (<SitePopupChain siteOptionsState={[siteOptions, setSiteOptions]} handleClose={() => {}} />)
}

describe('SitePopupChain', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    await waitFor(() => contextRender(<TestSitePopup />));

    expect(screen.getByText(/Change Team Site Location/i)).toBeVisible();

    const dropdownInput = screen.getByRole('textbox');
    expect(dropdownInput).toBeInstanceOf(HTMLInputElement);
    
    expect(screen.queryByText('test site option')).toBeNull();
    await userEvent.click(dropdownInput);
    const siteOption = screen.getByText('test site option');
    expect(siteOption).toBeVisible();
    await userEvent.click(siteOption);

    const requestButton = screen.getByText(/Request/i);
    expect(requestButton).toBeInstanceOf(HTMLButtonElement);

    await userEvent.click(requestButton);

    expect(screen.getByText(/Are you sure/i)).toBeVisible();

    const yesButton = screen.getByText('Yes');
    expect(yesButton).toBeInstanceOf(HTMLButtonElement);
    expect(screen.getByText('No')).toBeInstanceOf(HTMLButtonElement);

    await userEvent.click(yesButton);
    expect(screen.getByText(/Your team's new site location/i)).toBeVisible();

  });

});