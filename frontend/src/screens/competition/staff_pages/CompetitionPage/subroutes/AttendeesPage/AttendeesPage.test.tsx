// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { render, screen, waitFor } from '@testing-library/react';
import { server } from '../../../../../../test_utils/mock_server';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../../../../../../themes/defaultTheme';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CompetitionPage } from '../../CompetitionPage';
import { AttendeesDisplay } from './AttendeesPage';

server.listen();

describe('AttendeesPage', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    await waitFor(() => render(
      <ThemeProvider theme={defaultTheme} >
        <MemoryRouter initialEntries={['/site']}>
          <Routes>
            <Route path='/site' element={<CompetitionPage />}>
              <Route index element={<AttendeesDisplay />} />
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

    // attendees page things
    expect(screen.getByText('Download')).toBeVisible();
    
    expect(screen.getAllByText(/Full Name/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Gender/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Role/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/University/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Shirt Size/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Dietary Needs/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Allergies/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Accessibility/i).length).toBeGreaterThan(0);

    expect(screen.getAllByText('test uni').length).toBeGreaterThan(0);
    expect(screen.getAllByText('test name').length).toBeGreaterThan(0);
    expect(screen.getAllByText('M').length).toBeGreaterThan(0);
    expect(screen.getAllByText('MXL').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Participant').length).toBeGreaterThan(0);


    const siteTextList = screen.getAllByText('test site');
    siteTextList.forEach(
      (siteText) => {
        const sideBar = siteText.parentElement?.parentElement?.parentElement;
        expect(sideBar).toHaveStyle('width: 0')
      }
    );
    
  });

});