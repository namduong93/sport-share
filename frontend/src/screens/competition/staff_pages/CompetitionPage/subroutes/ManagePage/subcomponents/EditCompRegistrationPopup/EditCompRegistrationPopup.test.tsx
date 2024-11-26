// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { screen, waitFor } from '@testing-library/react';
import { contextRender } from '../../../../../../../../test_utils/contextRender';
import { server } from '../../../../../../../../test_utils/mock_server';
import { EditCompRegoPopUp } from './EditCompRegoPopUp';
import { useState } from 'react';
import { EditCourse, EditRego } from '../../../../../../../../../shared_types/Competition/staff/Edit';
import { CourseCategory } from '../../../../../../../../../shared_types/University/Course';

server.listen();


const testCourses = {
  [CourseCategory.Introduction]: '1511',
  [CourseCategory.DataStructures]: '2521',
  [CourseCategory.AlgorithmDesign]: '3121',
  [CourseCategory.ProgrammingChallenges]: '4128',
};

const testRegoFields = {
  enableCodeforcesField: true,
  enableNationalPrizesField: true,
  enableInternationalPrizesField: true,
  enableRegionalParticipationField: true,
};

const TestEditCompRegistrationPopup = () => {
  const [regoFields, setRegoFields] = useState<EditRego>(testRegoFields);

  const [courses, setCourses] = useState<EditCourse>(testCourses)

  return (
  <EditCompRegoPopUp
      heading={<></>}
      onClose={() => {}}
      onSubmit={() => {}}
      editCourses={courses}
      setCourses={(category: CourseCategory, val) => setCourses((p) => ({ ...p, [category]: val }))}
      regoFields={regoFields}
      setRegoFields={setRegoFields}
    />
  )
}

describe('EditCompRegistrationPopup', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    await waitFor(() => contextRender(
      <TestEditCompRegistrationPopup />
    ));

    expect(screen.getByText(/Please toggle the fields/i)).toBeVisible();
    expect(screen.getByText(/Input the relevant/i)).toBeVisible();

    expect(screen.getByText('Codeforces')).toBeVisible();
    expect(screen.getByText(/ICPC Regional Participation/i)).toBeVisible();
    expect(screen.getByText('National Olympiad Prizes')).toBeVisible();
    expect(screen.getByText('International Olympiad Prizes')).toBeVisible();

    expect(screen.getByText(/Introduction to Programming/i)).toBeVisible();
    expect(screen.getByText(/Data Structures and Algorithms/i)).toBeVisible();
    expect(screen.getByText(/Algorithm Design and Analysis/i)).toBeVisible();
    expect(screen.getByText(/Programming Challenges and Problems/i)).toBeVisible();

    
    expect(screen.getByDisplayValue(testCourses[CourseCategory.Introduction])).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByDisplayValue(testCourses[CourseCategory.DataStructures])).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByDisplayValue(testCourses[CourseCategory.AlgorithmDesign])).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByDisplayValue(testCourses[CourseCategory.ProgrammingChallenges])).toBeInstanceOf(HTMLInputElement);

    expect(document.getElementsByClassName('toggle-button--StyledToggleContainer-0').length).toBe(4);

  });

});