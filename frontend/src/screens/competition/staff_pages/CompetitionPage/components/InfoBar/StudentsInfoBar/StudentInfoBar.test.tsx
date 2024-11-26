// IMPORTANT!!!!! Make sure you import these from vitest
import { beforeAll, describe, expect, it, vi } from 'vitest';
// 
import { screen, waitFor } from '@testing-library/react';
import { server } from '../../../../../../../test_utils/mock_server';
import { contextRender } from '../../../../../../../test_utils/contextRender';
import { useState } from 'react';
import { StudentsInfoBar } from './StudentsInfoBar';
import { StudentInfo } from '../../../../../../../../shared_types/Competition/student/StudentInfo';
import { testStudent } from '../../../../../../../test_utils/testStudent';
import userEvent from '@testing-library/user-event';

server.listen();

const TestStudentsInfoBar = () => {

  const [isOpen, setIsOpen] = useState(true);
  const [staffList, setStaffList] = useState<StudentInfo[]>([testStudent]);

  return (<StudentsInfoBar studentsState={[staffList, setStaffList]} isOpenState={[isOpen, setIsOpen]} studentInfo={testStudent} />);
}

beforeAll(() => {
  // add a mock scroll into view because that isn't implemented here
  Element.prototype.scrollIntoView = vi.fn();
})

describe('StudentsInfoBar', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    await waitFor(() => contextRender(<TestStudentsInfoBar />));

    expect(screen.getByText('Name:')).toBeVisible();
    expect(screen.getByText('Preferred Name:')).toBeVisible();
    expect(screen.getByText('Email:')).toBeVisible();
    expect(screen.getByText('Gender:')).toBeVisible();
    expect(screen.getByText('Pronouns:')).toBeVisible();
    expect(screen.getByText('Shirt Size:')).toBeVisible();
    expect(screen.getByText('Allergies:')).toBeVisible();
    expect(screen.getByText('Dietary Requirements:')).toBeVisible();
    expect(screen.getByText('Accessibility Info:')).toBeVisible();
    expect(screen.getByText('Student Id:')).toBeVisible();
    expect(screen.getByText('Team:')).toBeVisible();
    expect(screen.getByText('Site:')).toBeVisible();

    expect(screen.getByText('Roles:')).toBeVisible();
    expect(screen.getByText('Bio:')).toBeVisible();
    expect(screen.getByText('ICPC Eligible:')).toBeVisible();
    expect(screen.getByText(/boersen Eligible:/i)).toBeVisible();
    expect(screen.getByText('Level:')).toBeVisible();
    expect(screen.getByText('Degree Year:')).toBeVisible();
    expect(screen.getByText('Degree:')).toBeVisible();
    expect(screen.getByText('Is Remote:')).toBeVisible();
    expect(screen.getByText('Is Official:')).toBeVisible();
    expect(screen.getByText('Preferred Contact:')).toBeVisible();
    expect(screen.getByText('National Prizes:')).toBeVisible();
    expect(screen.getByText('International Prizes:')).toBeVisible();
    expect(screen.getByText('Codeforces Rating:')).toBeVisible();
    expect(screen.getByText('Status:')).toBeVisible();

    expect(screen.getByText(testStudent.name)).toBeVisible();
    expect(screen.getByText(testStudent.preferredName)).toBeVisible();
    expect(screen.getByText(testStudent.email)).toBeVisible();
    expect(screen.getByText(testStudent.sex)).toBeVisible();
    expect(screen.getByText(testStudent.pronouns)).toBeVisible();
    expect(screen.getByText(testStudent.tshirtSize)).toBeVisible();
    if (testStudent.allergies) expect(screen.getByText(testStudent.allergies)).toBeVisible();
    if (testStudent.dietaryReqs) expect(screen.getByText(testStudent.dietaryReqs)).toBeVisible();
    if (testStudent.accessibilityReqs) expect(screen.getByText(testStudent.accessibilityReqs)).toBeVisible();
    expect(screen.getByText(testStudent.studentId)).toBeVisible();
    expect(screen.getByText(testStudent.teamName)).toBeVisible();
    expect(screen.getByText(testStudent.siteName)).toBeVisible();

    expect(screen.getByText(testStudent.roles[0])).toBeVisible();
    
    
    expect(screen.getByText(testStudent.bio)).toBeVisible();
    expect(screen.getByText(testStudent.level)).toBeVisible();
    expect(screen.getByText(testStudent.degreeYear)).toBeVisible();
    expect(screen.getByText(testStudent.degree)).toBeVisible();

    expect(screen.getByText(testStudent.preferredContact)).toBeVisible();
    if (testStudent.nationalPrizes) expect(screen.getByText(testStudent.nationalPrizes)).toBeVisible();
    if (testStudent.internationalPrizes) expect(screen.getByText(testStudent.internationalPrizes)).toBeVisible();
    expect(screen.getByText(testStudent.codeforcesRating)).toBeVisible();
    expect(screen.getByText(testStudent.status)).toBeVisible();

    const editButton = document.getElementsByClassName('students-info-bar--StyledEditIconButton-0')[0];
    await userEvent.click(editButton);

    expect(screen.getByDisplayValue(testStudent.bio)).toBeInstanceOf(HTMLTextAreaElement);
    
    expect(screen.getByDisplayValue(testStudent.level)).toBeInstanceOf(HTMLSelectElement);
    expect(screen.getByDisplayValue(testStudent.degreeYear)).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByDisplayValue(testStudent.degree)).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByDisplayValue(testStudent.preferredContact)).toBeInstanceOf(HTMLInputElement);
    if (testStudent.nationalPrizes) expect(screen.getByDisplayValue(testStudent.nationalPrizes)).toBeInstanceOf(HTMLInputElement);
    if (testStudent.internationalPrizes) expect(screen.getByDisplayValue(testStudent.internationalPrizes)).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByDisplayValue(testStudent.codeforcesRating)).toBeInstanceOf(HTMLInputElement);
    
  });

});