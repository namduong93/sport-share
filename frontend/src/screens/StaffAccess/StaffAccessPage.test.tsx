// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { screen, waitFor } from '@testing-library/react';
import { contextRender } from '../../test_utils/contextRender';
import { server } from '../../test_utils/mock_server';
import { StaffAccessPage } from './StaffAccessPage';

server.listen();

describe('StaffAccessPage', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    await waitFor(() => contextRender(<StaffAccessPage />));

    expect(screen.getAllByText(/Full Name/i).length).toBe(3); // 1 for wide and 2 for narrow (on narrow each person has their own Full Name title)
    expect(screen.getAllByText(/UNSW/i).length).toBe(4); // 2 for wide 2 for narrow
    expect(screen.getAllByRole('combobox').length).toBe(4);
    expect(screen.getAllByRole('option').length).toBe(3*4);

    expect(screen.getAllByText('person 1 name').length).toBe(2); // 1 For narrow and 1 wide
    expect(screen.getAllByText('person 2 name').length).toBe(2);

  });

});