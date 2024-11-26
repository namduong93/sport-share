// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { screen, waitFor } from '@testing-library/react';
import { EditCompUserDetails } from './EditCompUserDetails';
import { server } from '../../../../test_utils/mock_server';
import { contextRender } from '../../../../test_utils/contextRender';
import { testStudent } from '../../../../test_utils/testStudent';

server.listen();

const TestEditCompUserDetails = () => {

  return (
  <>
    <EditCompUserDetails student={testStudent}  onSubmit={async () => true} onClose={() => {}} />
  </>)
}

describe('EditCompUserDetails', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    await waitFor(() => contextRender(<TestEditCompUserDetails />));

    expect(screen.getAllByText('Degree').length).toBe(2);
    expect(screen.getByText(/ICPC Eligibility/i)).toBeVisible();
    expect(screen.getByText(/Competition Biography/i)).toBeVisible();
    expect(screen.getByText(/Competition Level/i)).toBeVisible();
    expect(screen.getByText(/Site Attendance/i)).toBeVisible();
    expect(screen.getByText(/Preferred Contact Method/)).toBeVisible();

    expect(screen.getByDisplayValue('3rd')).toBeInstanceOf(HTMLSelectElement);
    expect(screen.getByDisplayValue(testStudent.degree)).toBeInstanceOf(HTMLInputElement);

    expect(screen.getByLabelText('Yes')).toBeChecked();
    expect(screen.getByLabelText('No')).not.toBeChecked();

    expect(screen.getByLabelText('Level A')).toBeChecked();
    expect(screen.getByLabelText('Level B')).not.toBeChecked();
    expect(screen.getByLabelText('No Preference')).not.toBeChecked();

    expect(screen.getByLabelText('Attending On Site')).toBeChecked();
    expect(screen.getByLabelText('Attending Remotely')).not.toBeChecked();

    expect(screen.getByDisplayValue(testStudent.bio)).toBeInstanceOf(HTMLTextAreaElement);

    const [platform, handle] = testStudent.preferredContact.split(':');
    
    expect(screen.getByDisplayValue(platform)).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByDisplayValue(handle)).toBeInstanceOf(HTMLInputElement);
    
  });

});