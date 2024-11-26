import { FC } from "react";
import { useTheme } from "styled-components";
import { TransparentResponsiveButton } from "../../../../../components/responsive_fields/ResponsiveButton";
import { FaDownload, FaStamp } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { ResponsiveActionButton } from "../../../../../components/responsive_fields/action_buttons/ResponsiveActionButton";
import { GrDocumentCsv, GrDocumentPdf } from "react-icons/gr";
import { ResponsiveButtonContainer, StyledButtonContainer } from "../subroutes/TeamPage/subcomponents/TeamPageButtons";

interface DownloadButtonProps {
  isEditingStatus?: boolean;
  isEditingNameStatus?: boolean;
  isDownloadingState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  handleEnable?: VoidFunction;
  handleDisable?: VoidFunction;
  downloadCSV: () => Promise<boolean>;
  downloadPDF: () => Promise<boolean>;
  updateTeamStatus?: () => Promise<boolean>;
  downloadQuestion: string;
  isSiteDownload: boolean;
  hasTeamsToDownload?: boolean;
  hasAttendeesToDownload?: boolean;
};

/**
 * `DownloadButtons` is a React functional component that provides download options for CSV and PDF files, as well as the ability to update team status.
 * It also includes controls for enabling and disabling the download actions based on the current state.
 *
 * @param {DownloadButtonProps} props - React DownloadButtonProps specified above
 * @returns {JSX.Element} The rendered download button component, with actions depending on the current state.
 */
export const DownloadButtons: FC<DownloadButtonProps> = ({
  isEditingStatus = false,
  isEditingNameStatus = false,
  isDownloadingState: [isDownloading, setIsDownloading],
  handleEnable = () => {},
  handleDisable = () => {},
  downloadCSV = async () => true,
  downloadPDF = async () => true,
  updateTeamStatus = async () => true,
  downloadQuestion,
  isSiteDownload,
  hasTeamsToDownload,
  // hasAttendeesToDownload,
}) => {
  const theme = useTheme();

  const enableDownloading = () => {
    setIsDownloading(true);
    handleEnable();
  };

  const disableDownloading = () => {
    setIsDownloading(false);
    handleDisable();
  };

  return (
    <>
      {!isEditingStatus && !isEditingNameStatus && !isDownloading && (
        <StyledButtonContainer>
          <TransparentResponsiveButton
            actionType="primary"
            label="Download"
            icon={<FaDownload />}
            style={{ backgroundColor: theme.colours.primaryLight }}
            onClick={enableDownloading}
            isOpen={false}
          />
        </StyledButtonContainer>
      )}
      {isDownloading && (
        <ResponsiveButtonContainer>
          <StyledButtonContainer>
            <TransparentResponsiveButton
              actionType="error"
              onClick={disableDownloading}
              label="Cancel"
              isOpen={false}
              icon={<GiCancel />}
              style={{
                backgroundColor: theme.colours.cancel,
              }}
            />
          </StyledButtonContainer>

          <StyledButtonContainer>
            <ResponsiveActionButton
              actionType="secondary"
              label="Download CSV"
              question={downloadQuestion}
              icon={<GrDocumentCsv />}
              handleSubmit={downloadCSV}
            />
          </StyledButtonContainer>

          <StyledButtonContainer>
            <ResponsiveActionButton
              actionType="primary"
              label="Download PDF"
              question={downloadQuestion}
              icon={<GrDocumentPdf />}
              handleSubmit={downloadPDF}
            />
          </StyledButtonContainer>

          {!isSiteDownload && hasTeamsToDownload && (
            <StyledButtonContainer>
              <ResponsiveActionButton
                actionType="confirm"
                label="Update Status"
                question="Are you sure you have registered these teams on ICPC and would like to update their status to 'Registered'?"
                icon={<FaStamp />}
                handleSubmit={updateTeamStatus}
              />
            </StyledButtonContainer>
          )}
        </ResponsiveButtonContainer>
      )}
    </>
  );
};
