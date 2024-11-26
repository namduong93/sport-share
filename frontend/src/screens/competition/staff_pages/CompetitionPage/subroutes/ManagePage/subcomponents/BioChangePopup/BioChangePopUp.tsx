import { FC } from "react";
import {
  StyledButton,
  StyledCloseButton,
  StyledContainer,
  StyledContentBio,
  StyledContentMarkdown,
  StyledEditorContainer,
  StyledModal,
  StyledModalOverlay,
  StyledTextarea,
  StyledView,
} from "./BioChangePopup.styles";
import { FaTimes } from "react-icons/fa";
import { StyledHeading } from "../../ManagePage.styles";
import ReactMarkdownEditorLite from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import MarkdownIt from "markdown-it";

interface BioChangePopUpProps {
  onClose: () => void;
  onNext: () => void;
  bioValue: string | undefined;
  announcementValue: string;
  onBioChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAnnouncementChange: (value: string) => void;
}

/**
 * `BioChangePopUp` is a React web page component that displays a pop up for staff to edit their contact
 * bio and customise announcements to be sent to teams registered in the competition
 *
 * @returns JSX.Element - A styled container presenting a text and markdown editor to customise biography and
 * announcements
 */
export const BioChangePopUp: FC<BioChangePopUpProps> = ({
  onClose,
  onNext,
  bioValue,
  onBioChange,
  announcementValue,
  onAnnouncementChange,
}) => {
  const isButtonDisabled = () => bioValue === "" && announcementValue === "";

  return (
    <StyledModalOverlay className="bio-change-pop-up--StyledModalOverlay-0">
      <StyledModal className="bio-change-pop-up--StyledModal-0">
        <StyledView className="bio-change-pop-up--StyledView-0">
          <StyledCloseButton onClick={onClose} className="bio-change-pop-up--StyledCloseButton-0">
            <FaTimes />
          </StyledCloseButton>
          <StyledContainer className="bio-change-pop-up--StyledContainer-0">
            <StyledContentBio className="bio-change-pop-up--StyledContentBio-0">
              <StyledHeading className="bio-change-pop-up--StyledHeading-0">Update Your Contact Bio</StyledHeading>
              <StyledTextarea
                value={bioValue}
                onChange={onBioChange}
                $height="100px"
                required={false}
                placeholder={bioValue}
                className="bio-change-pop-up--StyledTextarea-0" />
            </StyledContentBio>
            <StyledContentMarkdown className="bio-change-pop-up--StyledContentMarkdown-0">
              <StyledHeading className="bio-change-pop-up--StyledHeading-1">Update Announcements to Your Teams</StyledHeading>
              <StyledEditorContainer className="bio-change-pop-up--StyledEditorContainer-0">
                <ReactMarkdownEditorLite
                  value={announcementValue}
                  onChange={({ text }) => onAnnouncementChange(text)}
                  style={{ height: "100%" }}
                  renderHTML={(text: string) => MarkdownIt().render(text)}
                  config={{
                    placeholder: "Write announcement here...",
                    toolbar: [
                      "bold",
                      "italic",
                      "strikethrough",
                      "header",
                      "|",
                      "unordered-list",
                      "ordered-list",
                      "quote",
                      "|",
                      "link",
                      "image",
                      "|",
                      "preview",
                      "undo",
                      "redo",
                    ],
                  }}
                />
              </StyledEditorContainer>
            </StyledContentMarkdown>
          </StyledContainer>
          <StyledButton
            disabled={isButtonDisabled()}
            onClick={onNext}
            className="bio-change-pop-up--StyledButton-0">Save Changes</StyledButton>
        </StyledView>
      </StyledModal>
    </StyledModalOverlay>
  );
};
