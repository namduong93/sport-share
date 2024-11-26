// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { render, screen, waitFor } from '@testing-library/react';
import { server } from '../../../../../../../../test_utils/mock_server';
import { AssignSeats } from './AssignSeats';
import { useState } from 'react';
import { testTeam } from '../../../../../../../../test_utils/testTeam';
import { testSite } from '../../../../../../../../test_utils/testSite';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../../../../../../../../themes/defaultTheme';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

server.listen();

const TestAssignSeats = () => {
  const [teamList, setTeamList] = useState([testTeam]);
  const [siteOption, setSiteOption] = useState({ value: String(testSite.id), label: testSite.name});

  return (
    <AssignSeats
      siteName='test site'
      siteCapacity={100}
      teamListState={[teamList, setTeamList]}
      siteOptionState={[siteOption, setSiteOption]}
    />
  )
}

describe('AssignSeats', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    await waitFor(() => render(
      <ThemeProvider theme={defaultTheme} >
        <MemoryRouter initialEntries={['/1']}>
          <Routes>
            <Route path='/:compId' element={<TestAssignSeats />} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    ));

    expect(screen.getByText(`Manage Seats for ${testSite.name}`)).toBeVisible();
    expect(screen.getByText('A Teams to Assign:0')).toBeVisible();
    expect(screen.getByText('B Teams to Assign:1')).toBeVisible();
    expect(screen.getByText('Team Seats Available:0')).toBeVisible();
    expect(screen.getByText('Select Seat Input Method')).toBeVisible();
    expect(screen.getByText('Levels A and B Seating')).toBeVisible();

    const inputsRadio = screen.getByLabelText('Inputs');
    expect(inputsRadio).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByLabelText('Text')).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByLabelText('Together')).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByLabelText('Separate')).toBeInstanceOf(HTMLInputElement);

    await userEvent.click(inputsRadio);
    expect(screen.getByText('Level A')).toBeVisible();
    expect(screen.getByText('Level B')).toBeVisible();

    const roomNameTitleList = screen.getAllByText('Room Name');
    expect(roomNameTitleList.length).toBe(2);
    roomNameTitleList.forEach((title) => expect(title).toBeVisible());

    const roomInputList = screen.getAllByPlaceholderText('Bongo');
    expect(roomInputList.length).toBe(2);
    roomInputList.forEach((title) => expect(title).toBeInstanceOf(HTMLInputElement));

    const roomCodesTextAreaList = screen.getAllByPlaceholderText(/00, 01, 02/);
    expect(roomCodesTextAreaList.length).toBe(2);
    roomCodesTextAreaList.forEach((title) => expect(title).toBeInstanceOf(HTMLTextAreaElement));

    expect(screen.getByText('Add Room')).toBeInstanceOf(HTMLButtonElement);
    
  });

});