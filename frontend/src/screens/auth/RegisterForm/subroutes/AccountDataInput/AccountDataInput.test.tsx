// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { screen } from '@testing-library/react';
import { contextRender } from '../../../../../test_utils/contextRender';
import { AccountDataInput } from './AccountDataInput';
import { RegisterFormProvider } from '../../RegisterFormProvider';

describe('AccountDataInput', () => {
  it('Renders correctly', () => {
    // ARRANGE
    contextRender(
      <RegisterFormProvider>
        <AccountDataInput />
      </RegisterFormProvider>
    )
    // ACT

    // EXPECT
    expect(screen.getAllByText('Account Information').length).toBe(2);
    expect(screen.getByText('First Name')).toBeInstanceOf(HTMLLabelElement)
    expect(screen.getByText('Last Name')).toBeInstanceOf(HTMLLabelElement)
    expect(screen.getByText('Preferred Name')).toBeInstanceOf(HTMLLabelElement)
    expect(screen.getByText('Gender')).toBeInstanceOf(HTMLLabelElement)
    expect(screen.getByText('Preferred Pronouns')).toBeInstanceOf(HTMLLabelElement)

    expect(screen.getByPlaceholderText('John')).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByPlaceholderText('Smith')).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByPlaceholderText('Please Enter')).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByPlaceholderText('example@email.com')).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByPlaceholderText('Enter your password')).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByPlaceholderText('Re-enter your password')).toBeInstanceOf(HTMLInputElement);


    expect(screen.getAllByRole('combobox').length).toBe(2);
    
   
  });
});