import { useEffect, useState } from "react";
import { sendRequest } from "../../../../../../../utility/request";
import {
  StyledAddButton,
  StyledAddButtonContainer,
  StyledContainer,
  StyledDoubleInputContainer,
  StyledTitle,
} from "./SiteLocationDataInput.styles";
import { StyledLabel } from "../../CompDataInput.styles";
import { AdvancedDropdown } from "../../../../../../../components/AdvancedDropdown/AdvancedDropdown";
import TextInputLight from "../../../../../../../components/general_utility/TextInputLight";

interface SiteLocationFormProps {
  onAddLocation: (
    currentOption: {
      value: string;
      label: string;
    },
    defaultSite: string
  ) => void;
};

interface University {
  id: string;
  name: string;
};

/**
 * `SiteLocationDataInput` is a React functional component that facilitates the selection and input of site locations
 * associated with a competition. It provides a dropdown to select an institution and a text input field to specify a
 * default site location. Users can add the selected institution and site location to the parent component's state.
 *
 * @returns JSX.Element - A styled container with inputs for selecting a university and specifying its default site location,
 * along with a button to add the entry.
 */
const SiteLocationDataInput: React.FC<SiteLocationFormProps> = ({
  onAddLocation,
}) => {
  const [defaultSite, setDefaultSite] = useState("");
  const [institutionOptions, setInstitutionOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);

  const [currentOption, setCurrentOption] = useState({ value: "", label: "" });

  const handleAddLocation = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (currentOption.label) {
      onAddLocation(currentOption, defaultSite);
    }
  };

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await sendRequest.get<{ universities: University[] }>(
          "/universities/list"
        );
        const universities = response.data;

        const options = universities.universities.map((university) => ({
          value: String(university.id), // String conversion needed since backend sends as number
          label: university.name,
        }));

        setInstitutionOptions(options);
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };

    fetchUniversities();
  }, []);

  return (
    <StyledContainer className="site-location-data-input--StyledContainer-0">
      <StyledTitle className="site-location-data-input--StyledTitle-0">Site Locations</StyledTitle>
      <StyledDoubleInputContainer className="site-location-data-input--StyledDoubleInputContainer-0">
        <div style={{ display: 'flex', flexDirection: 'column', width: '45%' }}>
          <StyledLabel className="site-location-data-input--StyledLabel-0">Institution</StyledLabel>
          <AdvancedDropdown
            setCurrentSelected={setCurrentOption}
            optionsState={[institutionOptions, setInstitutionOptions]}
            style={{ width: "100%" }}
          />
        </div>
        <TextInputLight
          label="Default Site Location"
          placeholder="Please type"
          type="text"
          required={false}
          value={defaultSite}
          onChange={(e) => setDefaultSite(e.target.value)}
          width="45%"
        />
      </StyledDoubleInputContainer>
      <StyledAddButtonContainer className="site-location-data-input--StyledAddButtonContainer-0">
        <StyledAddButton
          onClick={handleAddLocation}
          className="site-location-data-input--StyledAddButton-0">+</StyledAddButton>
      </StyledAddButtonContainer>
    </StyledContainer>
  );
};

export default SiteLocationDataInput;
