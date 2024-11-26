// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { render, screen, waitFor } from '@testing-library/react';
import { server } from '../../../../test_utils/mock_server';
import { TeamDetails } from './TeamDetails';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../../../../themes/defaultTheme';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { TeamProfile } from '../../TeamProfile';
import { testTeam } from '../../../../test_utils/testTeam';

server.listen();

describe('TeamDetails', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    await waitFor(() => render(
      <ThemeProvider theme={defaultTheme}>
        <MemoryRouter initialEntries={['/teamdetails']}>
          <Routes>
            <Route path='/teamdetails' element={<TeamProfile />}>
              <Route index element={<TeamDetails />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    ));

    expect(screen.getByText('Team Name:')).toBeVisible();
    expect(screen.getByText('Site Location:')).toBeVisible();
    expect(screen.getByText('Seat:')).toBeVisible();
    expect(screen.getByText('Level:')).toBeVisible();
    
    expect(screen.getByText(testTeam.teamName)).toBeVisible();
    expect(screen.getByText(testTeam.teamSite)).toBeVisible();
    if (testTeam.teamSeat) expect(screen.getByText(testTeam.teamSeat)).toBeVisible();
    expect(screen.getByText(testTeam.teamLevel)).toBeVisible();

    testTeam.students.forEach((student) => {
      expect(screen.getByText(student.preferredName)).toBeVisible();
      expect(screen.getByText(student.email)).toBeVisible();
      expect(screen.getByText(student.bio)).toBeVisible();
    })
    
  });

});