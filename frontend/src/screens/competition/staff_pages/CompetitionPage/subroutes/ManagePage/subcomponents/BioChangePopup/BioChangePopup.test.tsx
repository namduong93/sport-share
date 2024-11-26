// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { screen, waitFor } from '@testing-library/react';
import { contextRender } from '../../../../../../../../test_utils/contextRender';
import { BioChangePopUp } from './BioChangePopUp';
import { server } from '../../../../../../../../test_utils/mock_server';

server.listen();

describe('BioChangePopup', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    await waitFor(() => contextRender(
      <BioChangePopUp
        onClose={() => {}}
        onNext={() => {}}
        bioValue='test bio'
        announcementValue='test announcement'
        onBioChange={() => {}}
        onAnnouncementChange={() => {}}
      />
    ));

    expect(screen.getByText(/Update your Contact Bio/i)).toBeVisible();
    expect(screen.getByText(/Update Announcements to Your Teams/i)).toBeVisible();

    const textAreas = screen.getAllByRole('textbox');
    expect(textAreas.some((textArea) => (textArea as HTMLTextAreaElement).value === 'test bio')).toBe(true);
    expect(textAreas.some((textArea) => (textArea as HTMLTextAreaElement).value === 'test announcement')).toBe(true);
    
    expect(screen.getByText('Save Changes')).toBeInstanceOf(HTMLButtonElement);
    
  });

});