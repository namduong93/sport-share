// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { screen, waitFor } from '@testing-library/react';
import { server } from '../../../../../../../test_utils/mock_server';
import { contextRender } from '../../../../../../../test_utils/contextRender';
import { useState } from 'react';
import { StaffInfoBar } from './StaffInfoBar';
import { testStaff } from '../../../../../../../test_utils/testStaff';
import { StaffInfo } from '../../../../../../../../shared_types/Competition/staff/StaffInfo';
import userEvent from '@testing-library/user-event';

server.listen();

const TestStaffInfoBar = () => {

  const [isOpen, setIsOpen] = useState(true);
  const [staffList, setStaffList] = useState<StaffInfo[]>([testStaff]);

  return (<StaffInfoBar staffListState={[staffList, setStaffList]} isOpenState={[isOpen, setIsOpen]} staffInfo={testStaff} />);
}

describe('StaffInfoBar', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    await waitFor(() => contextRender(<TestStaffInfoBar />));

    expect(screen.getByText('University Name:')).toBeVisible();
    expect(screen.getByText('Name:')).toBeVisible();
    expect(screen.getByText('Email:')).toBeVisible();
    expect(screen.getByText('Gender:')).toBeVisible();
    expect(screen.getByText('Pronouns:')).toBeVisible();
    expect(screen.getByText('Shirt Size:')).toBeVisible();
    expect(screen.getByText('Allergies:')).toBeVisible();
    expect(screen.getByText('Dietary Requirements:')).toBeVisible();
    expect(screen.getByText('Accessibility Requirements:')).toBeVisible();
    
    expect(screen.getByText('Bio:')).toBeVisible();
    expect(screen.getByText('Roles:')).toBeVisible();
    expect(screen.getByText('Access:')).toBeVisible();

    expect(screen.getByText(testStaff.universityName!));
    expect(screen.getByText(testStaff.name));
    expect(screen.getByText(testStaff.email));
    expect(screen.getByText(testStaff.sex));
    expect(screen.getByText(testStaff.pronouns));
    expect(screen.getByText(testStaff.tshirtSize));
    if (testStaff.allergies) expect(screen.getByText(testStaff.allergies));
    if (testStaff.dietaryReqs) expect(screen.getByText(testStaff.dietaryReqs));
    if (testStaff.accessibilityReqs) expect(screen.getByText(testStaff.accessibilityReqs));
    
    if (testStaff.bio) expect(screen.getByText(testStaff.bio));
    if (testStaff.roles.length) expect(screen.getByText(testStaff.roles[0]));
    if (testStaff.access) expect(screen.getByText(testStaff.access));

    const editButton = document.getElementsByClassName('staff-info-bar--StyledEditIconButton-0')[0];
    
    await userEvent.click(editButton);
    expect(screen.getByRole('textbox')).toBeInstanceOf(HTMLTextAreaElement);

    expect(screen.getAllByRole('checkbox').length).toBe(3);
    expect(screen.getAllByRole('radio').length).toBe(3);

  });

});