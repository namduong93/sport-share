// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { render, screen, waitFor } from '@testing-library/react';
import { server } from '../../../../test_utils/mock_server';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../../../../themes/defaultTheme';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { TeamProfile } from '../../TeamProfile';
import { testTeam } from '../../../../test_utils/testTeam';
import { TeamManage } from './TeamManage';

server.listen();

describe('TeamDetails', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    await waitFor(() => render(
      <ThemeProvider theme={defaultTheme}>
        <MemoryRouter initialEntries={['/teammanage']}>
          <Routes>
            <Route path='/teammanage' element={<TeamProfile />}>
              <Route index element={<TeamManage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    ));

    expect(screen.getByText(testTeam.coach.name)).toBeVisible();
    expect(screen.getByText(testTeam.coach.email)).toBeVisible();
    expect(screen.getByText(testTeam.coach.bio)).toBeVisible();

    expect(screen.getByText(/Competition Details and Announcements/i)).toBeVisible();

    expect(screen.getByText('Invite a Friend').parentElement).toBeInstanceOf(HTMLButtonElement);
    expect(screen.getByText('Join a Team').parentElement).toBeInstanceOf(HTMLButtonElement);
    expect(screen.getByText('Change Team Name').parentElement).toBeInstanceOf(HTMLButtonElement);
    expect(screen.getByText('Change Team Site').parentElement).toBeInstanceOf(HTMLButtonElement);
    
  });

});