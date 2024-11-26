// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { screen, waitFor } from '@testing-library/react';
import { contextRender } from '../../test_utils/contextRender';
import { server } from '../../test_utils/mock_server';
import userEvent from '@testing-library/user-event';
import { Account } from './Account';
import { useState } from 'react';
import { DashInfo } from '../dashboard/hooks/useDashInfo';

server.listen();

const TestAccount = () => {
  const [, setDashInfo] = useState<DashInfo>({
    preferredName: 'test preferred',
    affiliation: 'test affiliation',
    profilePic: 'test profilepic'
  });
  return (
  <>
    <Account setDashInfo={setDashInfo} />
  </>)
}

describe('Account', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    await waitFor(() => contextRender(<TestAccount />));


    expect(screen.getByText('test name')).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByText('test preferred name')).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByText('test@example.com')).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByText('test affiliation')).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByText('Male')).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByText('He/Him')).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByText('MXL')).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByText('test chicken nuggets')).toBeInstanceOf(HTMLDivElement);

    const editButton = document.getElementsByClassName('account--StyledEditIconButton-0')[0];
    await userEvent.click(editButton);

    expect(screen.getByDisplayValue('test name')).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByDisplayValue('test preferred name')).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByDisplayValue('test@example.com')).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByDisplayValue('test affiliation')).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByDisplayValue('He/Him')).toBeInstanceOf(HTMLSelectElement);
    expect(screen.getByDisplayValue('Male')).toBeInstanceOf(HTMLSelectElement);
    expect(screen.getByDisplayValue('Mens XL')).toBeInstanceOf(HTMLSelectElement);
    expect(screen.getByDisplayValue('test chicken nuggets')).toBeInstanceOf(HTMLInputElement);

  });

});