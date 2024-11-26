import { useState } from "react";
import { useParams } from "react-router-dom";
import { sendRequest } from "../../../../../utility/request";
import { NamePopup1 } from "./subcomponents/NamePopup1/NamePopup1";
import { SecondStepPopup } from "../SecondStepPopup";
import { ThirdStepPopup } from "../ThirdStepPopup";
import { StyledHeading } from "./NamePopupChain.styles";

interface NamePopupChainProps {
  handleClose: () => void;
};

/**
 * A component for handling the multi-step process of changing a team name, starting with
 * a pop-up prompting users to enter the new name, then confirming the change, and finally displaying a
 * confirmation message that the change is pending approval from the coach.
 *
 * @param {NamePopupChainProps} props - React NamePopUpChainProps as specified above
 *
 * @returns {JSX.Element} - A modal component that displays different steps of the team name change process.
 */
export const NamePopupChain: React.FC<NamePopupChainProps> = ({
  handleClose,
}) => {
  const { compId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [newTeamName, setNewTeamName] = useState("");

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleCloseWithReset = () => {
    setCurrentStep(1);
    handleClose();
  };

  const handleSubmit = async () => {
    try {
      await sendRequest.put("/competition/student/team_name_change", {
        compId,
        newTeamName,
      });
      setCurrentStep((prevStep) => prevStep + 1);
    } catch (error) {
      console.error("Error requesting a team name change:", error);
    }
  };

  const renderModal = () => {
    switch (currentStep) {
      case 1:
        return (
          <NamePopup1
            heading={<StyledHeading className="name-popup-chain--StyledHeading-0">Change Team{"\n Name"}</StyledHeading>}
            onClose={handleCloseWithReset}
            onNext={handleNext}
            text="Enter new name"
            inputValue={newTeamName}
            setInputValue={setNewTeamName}
          />
        );
      case 2:
        return (
          <SecondStepPopup
            heading={
              <StyledHeading className="name-popup-chain--StyledHeading-1">Are you sure you would{"\nlike to change your Team's"}{" "}
                {"\nname?"}
              </StyledHeading>
            }
            onClose={handleCloseWithReset}
            onNext={handleSubmit}
          />
        );
      case 3:
        return (
          <ThirdStepPopup
            heading={
              <StyledHeading className="name-popup-chain--StyledHeading-2">Your team's new name{"\nis now pending approval"}{" "}
                {"\nfrom your coach"}
              </StyledHeading>
            }
            onClose={handleCloseWithReset}
          />
        );
      default:
        return null;
    }
  };

  return <div>{renderModal()}</div>;
};
