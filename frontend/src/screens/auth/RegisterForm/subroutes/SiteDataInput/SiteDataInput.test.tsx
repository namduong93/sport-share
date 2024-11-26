// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { screen } from '@testing-library/react';
import { contextRender } from '../../../../../test_utils/contextRender';
import { RegisterFormProvider } from '../../RegisterFormProvider';
import { SiteDataInput } from './SiteDataInput';

describe('SiteDataInput', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    contextRender(
      <RegisterFormProvider>
        <SiteDataInput />
      </RegisterFormProvider>
    )
    // ACT

    // EXPECT
    expect(screen.getAllByText('Site Information').length).toBe(2);

    expect(screen.getByText('T-Shirt Size')).toBeVisible();
    expect(screen.getByText(/Sizing Guide/i)).toBeVisible();

    expect(screen.getByText('Food Allergies')).toBeVisible();
    
    expect(screen.getByText(/Please let us know/i)).toBeVisible();
    expect(screen.getByText('Dietary Requirements')).toBeVisible();
    expect(screen.getByLabelText(/Vegan/i)).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByLabelText(/Vegetarian/i)).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByLabelText(/Gluten Free/i)).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByLabelText(/Halal/i)).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByLabelText(/Kosher/i)).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByLabelText(/Other/i)).toBeInstanceOf(HTMLInputElement);

    expect(screen.getByRole('combobox')).toBeInstanceOf(HTMLSelectElement);
    expect(screen.getAllByRole('option').length).toBe(17);

    expect(screen.getByText('Accessibility Requirements')).toBeVisible();
    expect(screen.getByText(/Please Inform us/i)).toBeVisible();

    screen.getAllByPlaceholderText('Enter a description').forEach(
      (textarea) => expect(textarea).toBeInstanceOf(HTMLTextAreaElement)
    )
  
  });
});