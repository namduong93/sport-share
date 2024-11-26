// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { render, screen, waitFor } from '@testing-library/react';
import { server } from '../../../../../../test_utils/mock_server';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../../../../../../themes/defaultTheme';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CompetitionPage } from '../../CompetitionPage';
import { StaffPage } from './StaffPage';
import { StaffAccess } from '../../../../../../../shared_types/Competition/staff/StaffInfo';

server.listen();

describe('StaffPage', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    await waitFor(() => render(
      <ThemeProvider theme={defaultTheme} >
        <MemoryRouter initialEntries={['/staff']}>
          <Routes>
            <Route path='/staff' element={<CompetitionPage />}>
              <Route index element={<StaffPage />} />
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

    // staff page things
    
    expect(screen.getAllByText(/Full Name/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Role/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Affiliation/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Access/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Email/i).length).toBeGreaterThan(0);
    
    expect(screen.getAllByText('test uni').length).toBeGreaterThan(0);
    expect(screen.getAllByText('person 1 name').length).toBeGreaterThan(0);
    expect(screen.getAllByText('person 2 name').length).toBeGreaterThan(0);
    expect(screen.getAllByText('person1@example.com').length).toBeGreaterThan(0);
    expect(screen.getAllByText('person2@example.com').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Coach').length).toBeGreaterThan(0);
    expect(screen.getAllByText(StaffAccess.Pending).length).toBeGreaterThan(0);
    

    // expect(screen.getAllByText('test name').length).toBeGreaterThan(0);
    // expect(screen.getAllByText('Coach').length).toBeGreaterThan(0);


    const bioTextList = screen.getAllByText('he/him');
    bioTextList.forEach(
      (bioText) => {
        const sideBar = bioText.parentElement?.parentElement?.parentElement;
        expect(sideBar).toHaveStyle('width: 0')
      }
    );
    
  });

});