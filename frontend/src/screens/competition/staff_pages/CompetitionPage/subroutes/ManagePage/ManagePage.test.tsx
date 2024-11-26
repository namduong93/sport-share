// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { render, screen, waitFor } from '@testing-library/react';

import { ThemeProvider } from 'styled-components';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { server } from '../../../../../../test_utils/mock_server';
import { CompetitionPage } from '../../CompetitionPage';
import { ManagePage } from './ManagePage';
import { defaultTheme } from '../../../../../../themes/defaultTheme';

server.listen();



describe('ManagePage', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    await waitFor(() => render(
      <ThemeProvider theme={defaultTheme} >
        <MemoryRouter initialEntries={['/managepage/1']}>
          <Routes>
            <Route path='/managepage/:compId' element={<CompetitionPage />}>
              <Route index element={<ManagePage />} />
            </Route>

          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    ));

    expect(screen.getByText('Admin Page')).toBeVisible();
    expect(screen.getAllByRole('textbox').length).toBe(2);
    expect(screen.getByText(/Copy Competition Code/i)).toBeVisible();
    expect(screen.getByText(/Edit Competition Details/i).parentElement).toBeInstanceOf(HTMLButtonElement);
    expect(screen.getByText(/Update Registration Form/i).parentElement).toBeInstanceOf(HTMLButtonElement);
    expect(screen.getByText(/Assign Seats to Teams/i).parentElement).toBeInstanceOf(HTMLButtonElement);
    expect(screen.getByText(/Update Your Bio and Announcements/i).parentElement).toBeInstanceOf(HTMLButtonElement);
    expect(screen.getByText(/Update Your Site Capacity/i).parentElement).toBeInstanceOf(HTMLButtonElement);

    expect(screen.getByText('Sort').parentElement?.parentElement).toBeInstanceOf(HTMLButtonElement);
    expect(screen.getByText('Filter').parentElement?.parentElement).toBeInstanceOf(HTMLButtonElement);
    expect(screen.getByText('Search')).toBeVisible();

  });

});