// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { render, screen, waitFor } from '@testing-library/react';
import { server } from '../../../../../../../../test_utils/mock_server';

import { EditSiteCapacityPopUp } from './EditSiteCapacityPopUp';
import { ThemeProvider } from 'styled-components';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { defaultTheme } from '../../../../../../../../themes/defaultTheme';
import { CompetitionPage } from '../../../../CompetitionPage';

server.listen();

const TestEditSiteCapacityPopup = () => {
  return (
    <EditSiteCapacityPopUp
      heading={<>test heading</>}
      onClose={() => {}}
    />
  )
}

describe('EditSiteCapacityPopup', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    await waitFor(() => render(
      <ThemeProvider theme={defaultTheme} >
        <MemoryRouter initialEntries={['/editsitecapacity/1']}>
          <Routes>
            <Route path='/editsitecapacity/:compId' element={<CompetitionPage />}>
              <Route index element={<TestEditSiteCapacityPopup />} />
            </Route>

          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    ));

    expect(screen.getByText('test heading')).toBeVisible();
    expect(screen.getByText(/Capacity is the number/i)).toBeVisible();
    expect(screen.getByText('Provide a capacity')).toBeVisible();
    
  });

});