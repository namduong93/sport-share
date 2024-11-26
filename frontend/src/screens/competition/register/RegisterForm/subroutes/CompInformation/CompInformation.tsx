import { CompetitionInformation as CompetitionDetails } from "../../../../../../../shared_types/Competition/CompetitionDetails";

import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { sendRequest } from "../../../../../../utility/request";
import { StyledFlexBackground } from "../../../../../../components/general_utility/Background";
import { CompRegistrationProgressBar } from "../../../../../../components/progress_bar/ProgressBar";
import {
  StyledButton,
  StyledButtonContainer,
  StyledContainer,
  StyledContentContainer,
  StyledTitle,
} from "./CompInformation.styles";
import { MarkdownDisplay } from "../../../../../general_components/MarkdownDisplay";

export const defaultCompInformation = `
This form is for registering to participate in the 2024 South Pacific ICPC Preliminary Contest.
The Preliminary Contest will be held on 31st August 2024, and the top qualifying teams will progress to the Regional Finals,
to be held in Sydney on 19th and 20th October 2024. The full qualification rules can be found at: [sppcontests.org/regional-qualification-rules](https://sppcontests.org/regional-qualification-rules/).
A team is official if all three team members meet the ICPC eligibility rules.
The full eligibility rules can be found at: [icpc.global/regionals/rules](https://icpc.global/regionals/rules/),
but the most notable criteria are:
- enrolled in a degree program at the team's institution (in particular, high school teams are unofficial)
- taking at least 1/2 load, or co-op, exchange or intern student
- have not competed in two ICPC World Finals
- have not competed in ICPC regional contests in five different years
- commenced post-secondary studies in 2020 or later OR born in 2001 or later

Official teams will be charged a registration fee of $100, typically paid by the institution.
Each team member will receive a T-shirt if the team is registered in this form and on [icpc.global](https://icpc.global) by 31st July 2024.
Unofficial (including high school) teams are not charged any registration fee,
will not receive T-shirts, and do not need to be registered on icpc.global.
To help check eligibility, every official competitor must use the email address
associated with their institution of study, and must also provide the email address that is linked to their icpc.global account.
Additionally, all teams must choose whether to compete in Level A or Level B.
- The Level A problem set will be significantly more challenging than the
  Level B problem set and is designed to differentiate between the best teams in the region.
- The Level B problem set is aimed towards less experienced teams.
- There will be awards for the top teams in each Level. Only teams competing
  in Level A will be considered for qualification to Regional Finals.
- If you have not previously competed in Regional Finals nor had a top 10 result in the 2024 SPAR contests,
  we strongly advise you to register for Level B.
  `;

/**
 * A React web page form component displaying the background information for a competition
 *
 * @returns {JSX.Element} - A form UI containing competition information
 */
export const CompetitionInformation: FC = () => {
  const navigate = useNavigate();
  const { code } = useParams<{ code?: string }>();
  const [compInformation, setCompInformation] = useState<string>(defaultCompInformation);

  useEffect(() => {
    const fetchCompInformation = async () => {
      try {
        const response = await sendRequest.get<{
          competition: CompetitionDetails;
        }>("/competition/details", { compId: code });
        const { competition } = response.data;
        setCompInformation(competition.information);
        console.log(competition.information);
      } catch (err: unknown) {
        console.error(err);
      }
    };

    fetchCompInformation();
  });

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleNext = () => {
    navigate(`/competition/individual/${code}`);
  };

  return (
    <StyledFlexBackground
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
      className="comp-information--StyledFlexBackground-0">
      <CompRegistrationProgressBar progressNumber={0} />
      <StyledContainer className="comp-information--StyledContainer-0">
        <StyledContentContainer className="comp-information--StyledContentContainer-0">
          <StyledTitle className="comp-information--StyledTitle-0">Competition Information</StyledTitle>
          <MarkdownDisplay content={compInformation !== null ? compInformation : defaultCompInformation} />
          <StyledButtonContainer className="comp-information--StyledButtonContainer-0">
            <StyledButton onClick={handleBack} className="comp-information--StyledButton-0">Back</StyledButton>
            <StyledButton onClick={handleNext} className="comp-information--StyledButton-1">Next</StyledButton>
          </StyledButtonContainer>
        </StyledContentContainer>
      </StyledContainer>
    </StyledFlexBackground>
  );
};
