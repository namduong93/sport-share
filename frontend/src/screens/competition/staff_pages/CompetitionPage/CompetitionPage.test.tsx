// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { screen, waitFor } from '@testing-library/react';
import { server } from '../../../../test_utils/mock_server';
import { contextRender } from '../../../../test_utils/contextRender';
import { CompetitionPage } from './CompetitionPage';

server.listen();

describe('CompetitionPage', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    await waitFor(() => contextRender(<CompetitionPage />));

    expect(screen.getByText(/Admin Page/i)).toBeVisible();
    expect(screen.getByText('Teams')).toBeVisible();
    expect(screen.getByText('Students')).toBeVisible();
    expect(screen.getByText('Staff')).toBeVisible();
    expect(screen.getByText('Site')).toBeVisible();
    expect(screen.getByText('Manage')).toBeVisible();

    expect(screen.getByText('Sort')).toBeVisible();
    expect(screen.getByText('Filter')).toBeVisible();
    expect(screen.getByText('Search')).toBeVisible();

  });

});