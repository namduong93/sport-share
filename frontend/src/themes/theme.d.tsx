import "styled-components";

/**
 * Establishes a standard theme for all components across the frontend, including
 * standardization of colors, fonts, background styles, and layout properties for
 * different UI elements.
 *
 * @module styled-components
 */
declare module "styled-components" {
  export interface DefaultTheme {
    background: string;
    colours: {
      primaryLight: string;
      primaryDark: string;
      secondaryLight: string;
      secondaryDark: string;
      cancel: string;
      cancelDark: string;
      confirm: string;
      confirmDark: string;
      sidebarBackground: string;
      optionUnselected: string;
      optionSelected: string;
      filterText: string;
      sidebarLine: string;
      staffOption: string;
      error: string;
      notifDate: string;
      notifLight: string;
      notifDark: string;
      progressStart: string;
      progressEnd: string;
      progressBackground: string;
      userInfoCardHeader: string;
      cardBackground: string;
    };
    themes: {
      light: string;
      dark: string;
      christmas: string;
      colourblind: string;
    };
    teamProfile: {
      invite: string;
      inviteBorder: string;
      join: string;
      joinBorder: string;
      name: string;
      nameBorder: string;
      site: string;
      siteBorder: string;
    };
    staffActions: {
      code: string;
      codeBorder: string;
      competition: string;
      competitionBorder: string;
      registration: string;
      registrationBorder: string;
      seat: string;
      seatBorder: string;
      contact: string;
      contactBorder: string;
      capacity: string;
      capacityBorder: string;
    };
    teamView: {
      pending: string;
      unregistered: string;
      registered: string;
      levelA: string;
      levelB: string;
    };
    roles: {
      participantBackground: string;
      participantText: string;
      coachText: string;
      coachBackground: string;
      siteCoordinatorText: string;
      siteCoordinatorBackground: string;
      adminText: string;
      adminBackground: string;
      studentText: string;
      studentBackground: string;
    };
    access: {
      acceptedBackground: string;
      acceptedText: string;
      rejectedBackground: string;
      rejectedText: string;
      pendingBackground: string;
      pendingText: string;
    };
    fonts: {
      fontFamily: string;
      fontSizes: {
        small: string;
        medium: string;
        large: string;
        subheading: string;
        heading: string;
        title: string;
      };
      fontWeights: {
        regular: number;
        medium: number;
        bold: number;
      };
      spacing: {
        normal: string;
        wide: string;
      };
      colour: string;
      descriptor: string;
      email: string;
      style: string;
    };
  }
}
