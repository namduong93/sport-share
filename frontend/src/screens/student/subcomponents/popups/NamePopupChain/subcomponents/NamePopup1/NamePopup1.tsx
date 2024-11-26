import { FaTimes } from "react-icons/fa";
import {
  StyledButton,
  StyledCloseButton,
  StyledModal,
} from "./NamePopup1.styles";
import TextInputLight from "../../../../../../../components/general_utility/TextInputLight";

interface NamePopup1Props {
  heading: React.ReactNode;
  onClose: () => void;
  onNext: () => void;
  text: string;
  inputValue: string;
  setInputValue: (value: string) => void;
};

/**
 * `NamePopUp1` is a React web page component that displays a pop up for editing a team's name. It provides
 * a text input field to allow users to change their team name
 *
 * @returns JSX.Element - A styled container presenting information and a text input to allow users to
 * change their team name
 */
export const NamePopup1: React.FC<NamePopup1Props> = ({
  heading,
  onClose,
  onNext,
  text,
  inputValue,
  setInputValue,
}) => {
  const isButtonDisabled = () => {
    return inputValue === "";
  };

  return <>
    <StyledModal className="--StyledModal-0">
      <StyledCloseButton onClick={onClose} className="--StyledCloseButton-0">
        <FaTimes />
      </StyledCloseButton>
      <div>{heading}</div>
      <span style={{ marginBottom: "20px" }}>
        Your Coach will review <br /> your change, where you will
        <br />
        receive a notification <br /> with the results of the review
      </span>
      <TextInputLight
        label=""
        placeholder={text}
        required={false}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        width="80%"
      />
      <StyledButton
        disabled={isButtonDisabled()}
        onClick={onNext}
        className="--StyledButton-0">Request</StyledButton>
    </StyledModal>
  </>;
};
