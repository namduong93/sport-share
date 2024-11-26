// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { render, screen, waitFor } from '@testing-library/react';
import { server } from '../../../../../../test_utils/mock_server';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../../../../../../themes/defaultTheme';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CompetitionPage } from '../../CompetitionPage';
import { StudentPage } from './StudentPage';
import { CompetitionLevel } from '../../../../../../../shared_types/Competition/CompetitionLevel';

server.listen();

describe('StudentsPage', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    await waitFor(() => render(
      <ThemeProvider theme={defaultTheme} >
        <MemoryRouter initialEntries={['/students']}>
          <Routes>
            <Route path='/students' element={<CompetitionPage />}>
              <Route index element={<StudentPage />} />
            </Route>

          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    ));

    expect(screen.getByText(/Admin Page/i)).toBeVisible();
    expect(screen.getByText('Teams')).toBeVisible();
    expect(screen.getByText('Students')).toBeVisible();
    expect(screen.getByText('Staff')).toBeVisible();
    expect(document.getElementsByClassName('competition-page--StyledToggleOptionTextSpan-3')[0].innerHTML).toBe('Site');
    expect(screen.getByText('Manage')).toBeVisible();
    expect(screen.getByText('Sort')).toBeVisible();
    expect(screen.getByText('Filter')).toBeVisible();
    expect(screen.getByText('Search')).toBeVisible();

    // staff page things
    
    expect(screen.getAllByText(/Full Name/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Gender/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Email/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Identifier/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Status/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Team Name/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Level/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Shirt Size/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Site/i).length).toBeGreaterThan(0);
    
    expect(screen.getAllByText('test name').length).toBeGreaterThan(0);
    expect(screen.getAllByText('F').length).toBeGreaterThan(0);
    expect(screen.getAllByText('test@example.com').length).toBeGreaterThan(0);
    expect(screen.getAllByText('01234567').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Unmatched').length).toBeGreaterThan(0);
    expect(screen.getAllByText('test team name').length).toBeGreaterThan(0);
    expect(screen.getAllByText(CompetitionLevel.LevelA).length).toBeGreaterThan(0);
    expect(screen.getAllByText('MXL').length).toBeGreaterThan(0);
    expect(screen.getAllByText('test site name').length).toBeGreaterThan(0);

    const bioTextList = screen.getAllByText('test bio');
    bioTextList.forEach(
      (bioText) => {
        const sideBar = bioText.parentElement?.parentElement?.parentElement?.parentElement;
        expect(sideBar).toHaveStyle('width: 0')
      }
    );
    
  });

});