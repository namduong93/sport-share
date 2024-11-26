import { RenderOptions, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { defaultTheme } from "../themes/defaultTheme";
import { ReactNode } from "react";

export const contextRender = (element: ReactNode, options?: RenderOptions) => {
  return render(
    <ThemeProvider theme={defaultTheme}>
      <MemoryRouter>
        {element}
      </MemoryRouter>
    </ThemeProvider>,
    options
  )
}