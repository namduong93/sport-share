import { useParams } from "react-router-dom";
import { useCompetitionOutletContext } from "../../../../hooks/useCompetitionOutletContext";
import { useEffect, useState } from "react";
import { CompetitionRole } from "../../../../../../../../../shared_types/Competition/CompetitionRole";
import { sendRequest } from "../../../../../../../../utility/request";
import { CompetitionSiteCapacity } from "../../../../../../../../../shared_types/Competition/CompetitionSite";
import {
  StyledButton,
  StyledCloseButton,
  StyledContainer,
  StyledModal,
  StyledModalOverlay,
  StyledView,
} from "./EditSiteCapacity.styles";
import { FaTimes } from "react-icons/fa";
import { StyledHeading } from "../../ManagePage.styles";
import { StyledText } from "../EditCompRegistrationPopup/EditCompRegistrationPopup.styles";
import { AdvancedDropdown } from "../../../../../../../../components/AdvancedDropdown/AdvancedDropdown";
import { NumberInputLight } from "../../../../../../../../components/general_utility/NumberInputLight";

interface EditSiteCapacityPopUpProps {
  heading: React.ReactNode;
  onClose: () => void;
};

/**
 * `EditSiteCapacityPopUp is a React web page component that displays a pop up for editing the capacity of
 * sites associated with that competition.
 * @param {EditSiteCapacityPopUpProps} - The title for the pop-up and allow the user to handle closing the pop-up.
 * @returns JSX.Element - A styled container presenting a text input field to change the capacity of the site
 * selected from a dropdow
 */
export const EditSiteCapacityPopUp: React.FC<EditSiteCapacityPopUpProps> = ({
  heading,
  onClose,
}) => {
  const { compId } = useParams();
  const { roles, siteOptionsState: [siteOptions, setSiteOptions] } = useCompetitionOutletContext("manage");

  const [selectedSite, setSelectedSite] = useState<{ value: string; label: string }>({label: "", value: "0"});
  const [capacity, setCapacity] = useState<number>(0);
  const [currentCapacity, setCurrentCapacity] = useState<number>(0);

  const [siteCapacities, setSiteCapacities] = useState<
    CompetitionSiteCapacity[] | undefined
  >();

  useEffect(() => {
    const fetchSiteCapacities = async () => {
      const ids = roles.includes(CompetitionRole.Admin)
        ? siteOptions.map((site) => site.value)
        : [];

      const response = await sendRequest.get<{
        site: CompetitionSiteCapacity[];
      }>("/competition/site/capacity", { compId, ids });

      const { site: siteCapacities } = response.data;
      setSiteCapacities(siteCapacities);
    };
    fetchSiteCapacities();
  }, []);

  useEffect(() => {
    const newCapacity = siteCapacities?.find(
      (site) => site.id === parseInt(selectedSite.value)
    );
    console.log(newCapacity);
    setCurrentCapacity(newCapacity?.capacity || 0);
  }, [selectedSite, siteCapacities]);

  useEffect(() => {
    setSelectedSite(siteOptions[0]);
  }, [siteOptions]);

  const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCapacity = Number(e.target.value);
    if (newCapacity >= 0) {
      setCapacity(newCapacity);
    }
  };

  const handleSubmit = async () => {
    // Update with the site and capacity
    onClose();

    await sendRequest.put("/competition/site/capacity/update", {
      compId,
      siteId: parseInt(selectedSite.value),
      capacity,
    });
  };

  return (
    <StyledModalOverlay className="edit-site-capacity-pop-up--StyledModalOverlay-0">
      <StyledModal className="edit-site-capacity-pop-up--StyledModal-0">
        <StyledView className="edit-site-capacity-pop-up--StyledView-0">
          <StyledCloseButton
            onClick={onClose}
            className="edit-site-capacity-pop-up--StyledCloseButton-0">
            <FaTimes />
          </StyledCloseButton>
          <StyledContainer className="edit-site-capacity-pop-up--StyledContainer-0">
            <StyledHeading className="edit-site-capacity-pop-up--StyledHeading-0">{heading}</StyledHeading>
            <div style={{ display: "flex", alignContent: "center" }}>
              <StyledText className="edit-site-capacity-pop-up--StyledText-0">
                <em>Capacity is the number of participants your site can host.</em>
              </StyledText>
            </div>
            {roles.includes(CompetitionRole.Admin) && 
            <div style={{ width: '100%', maxWidth: '300px' }}>
              <AdvancedDropdown
                setCurrentSelected={setSelectedSite}
                optionsState={[siteOptions, setSiteOptions]}
                style={{ width: "100%" }}
                isExtendable={false}
                defaultSearchTerm={selectedSite.label}
              />
            </div>
            
            }
            <NumberInputLight
              style={{ width: '100%', maxWidth: '300px' }}
              label="Provide a capacity"
              value={currentCapacity}
              onChange={handleCapacityChange}
              currentCapacity={currentCapacity}
            />
            <StyledButton
              onClick={handleSubmit}
              disabled={capacity <= 0}
              className="edit-site-capacity-pop-up--StyledButton-0">Save Changes</StyledButton>
          </StyledContainer>
        </StyledView>
      </StyledModal>
    </StyledModalOverlay>
  );
};
