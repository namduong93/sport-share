// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { screen, waitFor } from '@testing-library/react';
import { server } from '../../test_utils/mock_server';
import { contextRender } from '../../test_utils/contextRender';
import { Dashboard } from './Dashboard';
import { testDashInfo } from '../../test_utils/testDashInfo';

server.listen();

describe('CompetitionPage', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    await waitFor(() => contextRender(<Dashboard dashInfo={testDashInfo} />));

    expect(screen.getByText('Dashboard')).toBeVisible();

    expect(screen.getByText('test comp')).toBeVisible();
    expect(screen.getByText('Australia')).toBeVisible();
    expect(screen.getByText('Admin')).toBeVisible();
    expect(screen.getByText('Site-Coordinator')).toBeVisible();
    expect(screen.getByText('Coach')).toBeVisible();

    expect(screen.getByText('Register').parentElement?.parentElement).toBeInstanceOf(HTMLButtonElement);
    expect(screen.getByText('Create').parentElement?.parentElement).toBeInstanceOf(HTMLButtonElement);
    expect(screen.getByText('Sort').parentElement?.parentElement).toBeInstanceOf(HTMLButtonElement);
    expect(screen.getByText('Filter').parentElement?.parentElement).toBeInstanceOf(HTMLButtonElement);
    expect(screen.getByText('Search')).toBeVisible();

  });

});