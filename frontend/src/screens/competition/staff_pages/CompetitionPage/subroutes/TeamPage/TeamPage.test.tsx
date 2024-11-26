// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { render, screen, waitFor } from '@testing-library/react';
import { server } from '../../../../../../test_utils/mock_server';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../../../../../../themes/defaultTheme';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CompetitionPage } from '../../CompetitionPage';
import { TeamPage } from './TeamPage';


server.listen();

describe('StaffPage', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    await waitFor(() => render(
      <ThemeProvider theme={defaultTheme} >
        <MemoryRouter initialEntries={['/teams']}>
          <Routes>
            <Route path='/teams' element={<CompetitionPage />}>
              <Route index element={<TeamPage />} />
            </Route>

          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    ));

    expect(screen.getByText(/Admin Page/i)).toBeVisible();
    expect(screen.getByText('Teams')).toBeVisible();
    expect(screen.getByText('Students')).toBeVisible();
    expect(screen.getByText('Staff')).toBeVisible();
    expect(screen.getByText('Site')).toBeVisible();
    expect(screen.getByText('Manage')).toBeVisible();

    expect(screen.getByText('Sort')).toBeVisible();
    expect(screen.getByText('Filter')).toBeVisible();
    expect(screen.getByText('Search')).toBeVisible();


    expect(screen.getAllByText('test team').length).toBeGreaterThan(0);
    expect(screen.getAllByText('test student').length).toBeGreaterThan(0);
    expect(screen.getAllByText('A').length).toBeGreaterThan(0);
    expect(screen.getAllByText('B').length).toBeGreaterThan(0);
    
    const bioTextList = screen.getAllByText('test student bio');
    bioTextList.forEach(
      (bioText) => {
        const sideBar 
          = bioText.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement;
        expect(sideBar).toHaveStyle('width: 0')
      }
    );

  });

});