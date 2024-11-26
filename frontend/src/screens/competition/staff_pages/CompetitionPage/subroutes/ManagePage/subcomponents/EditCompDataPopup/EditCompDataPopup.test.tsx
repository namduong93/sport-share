// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 

import { contextRender } from '../../../../../../../../test_utils/contextRender';
import { server } from '../../../../../../../../test_utils/mock_server';
import { screen, waitFor } from '@testing-library/dom';
import { EditCompDataPopup } from './EditCompDataPopup';
import { testCompDetails } from '../../../../../../../../test_utils/testCompDetails';
import { useState } from 'react';
import { CompetitionInformation } from '../../../../../../../../../shared_types/Competition/CompetitionDetails';

server.listen();

const TestEditCompDataPopup = () => {

  const [competitionData, setCompetitionData] = useState<CompetitionInformation>(testCompDetails);

  return (
  <EditCompDataPopup
    onClose={() => {}}
    onSubmit={() => {}}
    competitionInfo={competitionData}
    setCompetitionInfo={setCompetitionData}
  />)
}

describe('EditCompDataPopup', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    await waitFor(() => contextRender(<TestEditCompDataPopup />));

    expect(screen.getByText('Edit Competition Details')).toBeVisible();

    expect(screen.getByText('Competition Information')).toBeVisible();

    expect(screen.getByText('Competition Name')).toBeVisible();
    expect(screen.getByText('Competition Region')).toBeVisible();
    expect(screen.getByText('Competition Start')).toBeVisible();
    expect(screen.getByText('Early Bird Registration Deadline')).toBeVisible();
    expect(screen.getByText('General Registration Deadline')).toBeVisible();
    expect(screen.getByText('Competition Code')).toBeVisible();
    expect(screen.getByText('Site Locations')).toBeVisible();
    expect(screen.getByText('Institution')).toBeVisible();

    expect(screen.getByDisplayValue(testCompDetails.name)).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByDisplayValue(testCompDetails.region)).toBeInstanceOf(HTMLInputElement);

    expect(screen.getByDisplayValue(testCompDetails.code)).toBeInstanceOf(HTMLInputElement);

    expect(screen.getByText(testCompDetails.siteLocations[0].universityName)).toBeVisible();
    expect(screen.getByText(testCompDetails.siteLocations[0].defaultSite)).toBeVisible();

    expect(screen.getByDisplayValue(testCompDetails.information)).toBeInstanceOf(HTMLTextAreaElement);

    expect(screen.getByText('Save Changes')).toBeVisible();

  });

});