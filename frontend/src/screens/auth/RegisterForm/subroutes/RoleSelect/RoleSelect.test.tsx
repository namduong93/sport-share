// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
// 
import { screen } from '@testing-library/react';
import { contextRender } from '../../../../../test_utils/contextRender';
import { RegisterFormProvider } from '../../RegisterFormProvider';
import { RoleSelect } from './RoleSelect';
import userEvent from "@testing-library/user-event";

describe('RoleSelect', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    contextRender(
      <RegisterFormProvider>
        <RoleSelect />
      </RegisterFormProvider>
    )
    // ACT

    // EXPECT
    const studentButton = screen.getByText('Student');
    const staffButton = screen.getByText('Staff');

    expect(studentButton).toBeInstanceOf(HTMLButtonElement);
    expect(staffButton).toBeInstanceOf(HTMLButtonElement);

    await userEvent.click(studentButton);
    expect(studentButton).not.toHaveStyle('border: none');

    await userEvent.click(staffButton);
    expect(staffButton).not.toHaveStyle('border: none');
    expect(studentButton).toHaveStyle('border: none');
  });
});