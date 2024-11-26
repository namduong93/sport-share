// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { screen } from '@testing-library/react';
import { contextRender } from '../../../../../test_utils/contextRender';
import { RegisterFormProvider } from '../../RegisterFormProvider';
import { InstitutionDataInput } from './InstitutionDataInput';

describe('SiteDataInput', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    contextRender(
      <RegisterFormProvider>
        <InstitutionDataInput />
      </RegisterFormProvider>
    )
    // ACT

    // EXPECT
    expect(screen.getAllByText('Institution Information').length).toBe(2);

    expect(screen.getByText('Institution')).toBeVisible();
    expect(screen.getByRole('combobox')).toBeVisible();

    // If the user is a student there will also be a Student Identifier Number field
  });
});