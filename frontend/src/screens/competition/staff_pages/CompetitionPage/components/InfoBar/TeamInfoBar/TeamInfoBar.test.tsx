// IMPORTANT!!!!! Make sure you import these from vitest
import { beforeAll, describe, expect, it, vi } from 'vitest';
// 
import { screen, waitFor } from '@testing-library/react';
import { server } from '../../../../../../../test_utils/mock_server';
import { contextRender } from '../../../../../../../test_utils/contextRender';
import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { TeamInfoBar } from './TeamInfoBar';
import { testTeam } from '../../../../../../../test_utils/testTeam';
import { TeamDetails } from '../../../../../../../../shared_types/Competition/team/TeamDetails';
import { ButtonConfiguration } from '../../../hooks/useCompetitionOutletContext';
import { testSite } from '../../../../../../../test_utils/testSite';

server.listen();

const TestTeamInfoBar = () => {

  const [isOpen, setIsOpen] = useState(true);
  const [teamList, setTeamList] = useState<TeamDetails[]>([testTeam]);
  const [buttonConfiguration, setButtonConfiguration] = useState<ButtonConfiguration>({
    enableAttendeesButtons: false,
    enableStaffButtons: false,
    enableStudentButtons: false,
    enableTeamButtons: true,
    enableTeamsChangedButtons: false,
  });
  const [siteOptions, setSiteOptions] = useState([{ value: String(testSite.id), label: testSite.name}]);

  return (
  <TeamInfoBar
    isOpenState={[isOpen, setIsOpen]}
    isEditable={true}
    teamDetails={testTeam}
    teamListState={[teamList, setTeamList]}
    buttonConfigurationState={[buttonConfiguration, setButtonConfiguration]}
    siteOptionsState={[siteOptions, setSiteOptions]}
  />);
}

beforeAll(() => {
  // add a mock scroll into view because that isn't implemented here
  Element.prototype.scrollIntoView = vi.fn();
})

describe('TeamInfoBar', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    await waitFor(() => contextRender(<TestTeamInfoBar />));

    expect(screen.getByText('Coach:')).toBeVisible();
    expect(screen.getByText('Status:')).toBeVisible();
    expect(screen.getByText('Level:')).toBeVisible();
    expect(screen.getByText('Site:')).toBeVisible();
    expect(screen.getByText('Seat:')).toBeVisible();
    expect(screen.getByText('Members')).toBeVisible();
    expect(screen.getByText('Name:')).toBeVisible();
    expect(screen.getByText('Email:')).toBeVisible();
    expect(screen.getByText('Bio:')).toBeVisible();
    expect(screen.getByText('ICPC Eligible:')).toBeVisible();
    expect(screen.getByText('Boersen Eligible:')).toBeVisible();
    expect(screen.getByText('National Prizes:')).toBeVisible();
    expect(screen.getByText('International Prizes:')).toBeVisible();
    expect(screen.getByText('Codeforces Rating:')).toBeVisible();
    expect(screen.getByText('Past Regional:')).toBeVisible();

    expect(screen.getByText(testTeam.teamName)).toBeVisible();
    expect(screen.getByText(testTeam.coach.name)).toBeVisible();
    expect(screen.getByText(testTeam.status)).toBeVisible();
    expect(screen.getByText(testTeam.teamLevel)).toBeVisible();
    expect(screen.getByText(testTeam.teamSite)).toBeVisible();
    if (testTeam.teamSeat) expect(screen.getByText(testTeam.teamSeat)).toBeVisible();

    const editTeamButton = document.getElementsByClassName('team-info-bar--StyledEditIconButton-0')[0];
    await userEvent.click(editTeamButton);
    expect(screen.getByDisplayValue(testTeam.teamName)).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByDisplayValue(testTeam.teamSite)).toBeInstanceOf(HTMLInputElement);
    if (testTeam.teamSeat) expect(screen.getByDisplayValue(testTeam.teamSeat)).toBeInstanceOf(HTMLInputElement);

    const testMember = testTeam.students[0];
    expect(screen.getByText(testMember.name)).toBeVisible();
    expect(screen.getByText(testMember.email)).toBeVisible();
    expect(screen.getByText(testMember.bio)).toBeVisible();

    if (testMember.nationalPrizes) expect(screen.getByText(testMember.nationalPrizes)).toBeVisible();
    if (testMember.internationalPrizes) expect(screen.getByText(testMember.internationalPrizes)).toBeVisible();
    expect(screen.getByText(testMember.codeforcesRating)).toBeVisible();

    const editMemberButton = document.getElementsByClassName('team-student-info-card--StyledEditIconButton-0')[0];
    await userEvent.click(editMemberButton);
    expect(screen.getByDisplayValue(testMember.bio)).toBeInstanceOf(HTMLTextAreaElement);
    if (testMember.nationalPrizes) expect(screen.getByDisplayValue(testMember.nationalPrizes)).toBeInstanceOf(HTMLTextAreaElement);
    if (testMember.internationalPrizes) expect(screen.getByDisplayValue(testMember.internationalPrizes)).toBeInstanceOf(HTMLTextAreaElement);
    expect(screen.getByDisplayValue(testMember.codeforcesRating)).toBeInstanceOf(HTMLInputElement);
    
  });

});