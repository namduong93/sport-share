// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { screen, waitFor } from '@testing-library/react';
import { server } from '../../../../../../../test_utils/mock_server';
import { contextRender } from '../../../../../../../test_utils/contextRender';
import { AttendeesInfoBar } from './AttendeesInfoBar';
import { useState } from 'react';
import { testAttendee } from '../../../../../../../test_utils/testAttendee';

server.listen();

const TestAttendeesInfoBar = () => {

  const [isOpen, setIsOpen] = useState(true);

  return (<AttendeesInfoBar isOpenState={[isOpen, setIsOpen]} attendeesDetails={testAttendee} />);
}

describe('CompetitionPage', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    await waitFor(() => contextRender(<TestAttendeesInfoBar />));

    expect(screen.getByText('Name:')).toBeVisible();
    expect(screen.getByText('Preferred Name:')).toBeVisible();
    expect(screen.getByText('Email:')).toBeVisible();
    expect(screen.getByText('Gender:')).toBeVisible();
    expect(screen.getByText('Shirt Size:')).toBeVisible();
    expect(screen.getByText('Dietary Requirements:')).toBeVisible();
    expect(screen.getByText('Allergies:')).toBeVisible();
    expect(screen.getByText('Accessibility Needs:')).toBeVisible();
    expect(screen.getByText('Roles:')).toBeVisible();
    expect(screen.getByText('Site:')).toBeVisible();
    expect(screen.getByText('Site Capacity:')).toBeVisible();
    expect(screen.getByText('Pending Site:')).toBeVisible();
    expect(screen.getByText('Pending Site Capacity:')).toBeVisible();

    expect(screen.getByText(testAttendee.name)).toBeVisible();
    expect(screen.getByText(testAttendee.name)).toBeVisible();
    expect(screen.getByText(testAttendee.email)).toBeVisible();
    expect(screen.getByText(testAttendee.sex)).toBeVisible();
    expect(screen.getByText(testAttendee.tshirtSize)).toBeVisible();
    if (testAttendee.dietaryNeeds) expect(screen.getByText(testAttendee.dietaryNeeds)).toBeVisible();
    if (testAttendee.allergies) expect(screen.getByText(testAttendee.allergies)).toBeVisible();
    if (testAttendee.accessibilityNeeds) expect(screen.getByText(testAttendee.accessibilityNeeds)).toBeVisible();
    expect(screen.getByText(testAttendee.roles[0])).toBeVisible();
    expect(screen.getByText(testAttendee.siteName)).toBeVisible();
    expect(screen.getByText(testAttendee.siteCapacity)).toBeVisible();
    if (testAttendee.pendingSiteName) expect(screen.getByText(testAttendee.pendingSiteName)).toBeVisible();
    if (testAttendee.pendingSiteCapacity) expect(screen.getByText(testAttendee.pendingSiteCapacity)).toBeVisible();

  });

});