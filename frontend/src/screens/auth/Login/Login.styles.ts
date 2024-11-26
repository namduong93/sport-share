import { styled } from "styled-components";

export const StyledFormContainer = styled.form`
  display: flex;
  width: 500px;
  height: 500px;
  flex-shrink: 1;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.fonts.colour};
`;

export const StyledSignUpLink = styled.span`
  cursor: pointer;
  text-decoration: underline;
  color: ${({ theme }) => theme.colours.primaryLight};
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

export const StyledImage = styled.img`
  width: 100%;
`;

export const StyledTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-style: ${({ theme }) => theme.fonts.style};
`;

export const StyledInputContainer = styled.div`
  width: 68%;
`;

export const StyledForgotPassword = styled.label`
  text-decoration: underline;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-size: 12px;
  cursor: pointer;
  margin-top: -16px;
`;
