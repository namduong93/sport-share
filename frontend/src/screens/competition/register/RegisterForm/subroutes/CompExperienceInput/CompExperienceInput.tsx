import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMultiStepCompRegoForm } from "../../hooks/useMultiStepCompRegoForm";
import { sendRequest } from "../../../../../../utility/request";
import {
  Course,
  CourseCategory,
} from "../../../../../../../shared_types/University/Course";
import { EditRego } from "../../../../../../../shared_types/Competition/staff/Edit";
import { DEFAULT_REGO_FIELDS } from "../../../../staff_pages/CompetitionPage/subroutes/ManagePage/ManagePage";
import { StyledFlexBackground } from "../../../../../../components/general_utility/Background";
import { CompRegistrationProgressBar } from "../../../../../../components/progress_bar/ProgressBar";
import {
  StyledAsterisk,
  StyledButton,
  StyledButtonContainer,
  StyledContainer,
  StyledContentContainer,
  StyledTitle,
} from "./CompExperienceInput.styles";
import MultiRadio from "../../../../../../components/general_utility/MultiRadio";
import TextInput from "../../../../../../components/general_utility/TextInput";
import RadioButton from "../../../../../../components/general_utility/RadioButton";
import DescriptiveTextInput from "../../../../../../components/general_utility/DescriptiveTextInput";

/**
 * A React web page form component for collecting competitive experience data during the competition registration process.
 *
 * The `CompExperienceInput` component gathers information about the user's university courses, competitive experience,
 * and eligibility for various prizes and awards, such as Codeforces score, National and International Olympiad prizes,
 * and Boersen Prize eligibility. The component conditionally renders fields based on the competition level and user input.
 * It manages state for the competition experience, course selection, and prize eligibility through the form context.
 * Upon clicking the "Register" button, the form data is submitted to the backend for registration.
 *
 * @returns {JSX.Element} - A form UI for collecting competitive experience during the competition registration.
 */
export const CompExperienceInput: FC = () => {
  const navigate = useNavigate();
  const { code } = useParams<{ code?: string }>();
  const { formData, setFormData } = useMultiStepCompRegoForm();
  const [hasNationalPrize, setHasNationalPrize] = useState<boolean | undefined>(
    undefined
  );
  const [hasInternationalPrize, setHasInternationalPrize] = useState<
    boolean | undefined
  >(undefined);

  const handleBack = () => {
    navigate(`/competition/individual/${code}`);
  };

  const handleRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const {
      degreeYear,
      degree,
      ICPCEligibility,
      isRemote,
      competitionLevel,
      siteLocation,
      boersenEligible,
      codeforce,
      nationalPrizes,
      internationalPrizes,
      courses,
      pastRegional,
      platform,
      handle,
      competitionBio,
    } = formData;

    const competitionUser = {
      ICPCEligible: ICPCEligibility,
      competitionLevel: competitionLevel,
      siteLocation: siteLocation,
      boersenEligible: boersenEligible,
      degreeYear: degreeYear,
      degree: degree,
      isRemote: isRemote,
      nationalPrizes: nationalPrizes,
      internationalPrizes: internationalPrizes,
      codeforcesRating: codeforce,
      universityCourses: courses,
      pastRegional: pastRegional,
      competitionBio: competitionBio,
      preferredContact: `${platform}:${handle}`,
    };

    const payload = {
      code: code,
      competitionUser,
    };

    try {
      console.log(payload);
      
      const response = await sendRequest.post('/competition/student/join', payload);
      console.log("Response:", response.data);

      navigate("/dashboard", {
        state: {
          isRegoSuccessPopUpOpen: true,
        },
      });
    } catch (error) {
      console.error("Error creating competition:", error);
    }
  };

  const [courseOptions, setCourseOptions] = useState([
    {
      value: CourseCategory.Introduction,
      label:
        "Introduction to Programming / Programming Fundamentals (and any advanced versions)",
    },
    {
      value: CourseCategory.DataStructures,
      label: "Data Structures and Algorithms (and any advanced versions)",
    },
    {
      value: CourseCategory.AlgorithmDesign,
      label: "Algorithm Design and Analysis (and any advanced versions)",
    },
    {
      value: CourseCategory.ProgrammingChallenges,
      label: "Programming Challenges and Problems (and any advanced versions)",
    },
  ]);

  // obtains the courses for the associated university
  useEffect(() => {
    const fetchCourses = async () => {
      const response = await sendRequest.get<{ courses: Array<Course> }>(
        "/university/courses",
        { code }
      );
      const { courses } = response.data;
      console.log(courses);

      if (courses.length) {
        setCourseOptions(
          courses.map((course) => ({
            value: course.category,
            label: course.courseName,
          }))
        );
      };      
    };

    fetchCourses();
  }, []);

  function isButtonDisabled(): boolean | undefined {
    const {
      courses,
      nationalPrizes,
      internationalPrizes,
      pastRegional,
      degreeYear,
    } = formData;
    if (formData.competitionLevel === "Level B") {
      return courses.length === 0;
    } else {
      return (
        courses.length === 0 ||
        (editRego.enableNationalPrizesField &&
          hasNationalPrize === undefined) ||
        (hasNationalPrize && nationalPrizes === "") ||
        (editRego.enableInternationalPrizesField &&
          hasInternationalPrize === undefined) ||
        (hasInternationalPrize && internationalPrizes === "") ||
        (editRego.enableRegionalParticipationField &&
          degreeYear !== 1 &&
          pastRegional === undefined)
      );
    }
  }

  const [editRego, setEditRego] = useState<EditRego>({
    enableCodeforcesField: false,
    enableNationalPrizesField: false,
    enableInternationalPrizesField: false,
    enableRegionalParticipationField: false,
  });

  // Obtains the editRego object that specifies question fields that staff
  // would like to hide
  useEffect(() => {
    const fetchEditRego = async () => {
      const response = await sendRequest.get<{ regoFields: EditRego }>(
        "/competition/students/rego_toggles",
        { code }
      );
      const { regoFields } = response.data;
      setEditRego(regoFields || DEFAULT_REGO_FIELDS);
    };
    fetchEditRego();
  }, []);

  return (
    <StyledFlexBackground
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
      className="comp-experience-input--StyledFlexBackground-0">
      <CompRegistrationProgressBar progressNumber={2} />
      <StyledContainer className="comp-experience-input--StyledContainer-0">
        <StyledContentContainer className="comp-experience-input--StyledContentContainer-0">
          <StyledTitle className="comp-experience-input--StyledTitle-0">Competitive Experience</StyledTitle>
          <MultiRadio
            options={courseOptions}
            selectedValues={formData.courses}
            onChange={(selectedValues) =>
              setFormData({ ...formData, courses: selectedValues })
            }
            label={
              <>
                University Courses Completed
                <StyledAsterisk className="comp-experience-input--StyledAsterisk-0">*</StyledAsterisk>
              </>
            }
            descriptor="Please select the courses you have completed"
            showOther={false}
          />
          {editRego.enableCodeforcesField && formData.competitionLevel !== "Level B" && (
            <TextInput
              label="Codeforces Score"
              placeholder="Please enter"
              type="numeric"
              required={false}
              value={formData.codeforce?.toString() || ""}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, codeforce: Number(value) });
              }}
              width="100%"
              descriptor="Please enter your current Codeforce score if applicable"
            />
          )}
          {editRego.enableRegionalParticipationField &&
            formData.degreeYear.toString() !== "1" &&
            formData.competitionLevel !== "Level B" && (
              <RadioButton
                label="ICPC Regional Participation"
                options={["Yes", "No"]}
                selectedOption={
                  formData.pastRegional === undefined
                    ? ""
                    : formData.pastRegional
                    ? "Yes"
                    : "No"
                }
                onOptionChange={(e) => {
                  const pastRegional = e.target.value === "Yes";
                  setFormData({ ...formData, pastRegional: pastRegional });
                }}
                required={true}
                descriptor="Have you ever competed in a regional ICPC round?"
                width="100%"
              />
            )}
          {editRego.enableNationalPrizesField &&
            formData.competitionLevel !== "Level B" && (
              <RadioButton
                label="National Olympiad Prizes in Mathematics or Informatics"
                options={["Yes", "No"]}
                selectedOption={
                  hasNationalPrize === undefined
                    ? ""
                    : hasNationalPrize
                    ? "Yes"
                    : "No"
                }
                onOptionChange={(e) => {
                  const nationalPrize = e.target.value === "Yes";
                  setHasNationalPrize(nationalPrize);
                }}
                required={true}
                descriptor="Have you ever won any related National Olympiad in Mathematics or Informatics prizes?"
                width="100%"
              />
            )}
          {hasNationalPrize && (
            <DescriptiveTextInput
              descriptor="Please enter any related National Olympiad prizes you may have (NOI, AIO, VNOI, etc) separated by commas"
              placeholder="Please type"
              required={false}
              value={formData.nationalPrizes || ""}
              onChange={(e) =>
                setFormData({ ...formData, nationalPrizes: e.target.value })
              }
              width="100%"
            />
          )}
          {editRego.enableInternationalPrizesField &&
            formData.competitionLevel !== "Level B" && (
              <RadioButton
                label="International Olympiad Prizes in Mathematics or Informatics"
                options={["Yes", "No"]}
                selectedOption={
                  hasInternationalPrize === undefined
                    ? ""
                    : hasInternationalPrize
                    ? "Yes"
                    : "No"
                }
                onOptionChange={(e) => {
                  const internationalPrize = e.target.value === "Yes";
                  setHasInternationalPrize(internationalPrize);
                }}
                required={true}
                descriptor="Have you ever won any related International Olympiad prizes?"
                width="100%"
              />
            )}
          {hasInternationalPrize && (
            <DescriptiveTextInput
              descriptor="Please enter any related International Olympiad prizes you may have (IOI, APIO, CEOI, etc) separated by commas"
              placeholder="Please type"
              required={false}
              value={formData.internationalPrizes || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  internationalPrizes: e.target.value,
                })
              }
              width="100%"
            />
          )}
          {formData.competitionLevel !== "Level B" && (
            <RadioButton
              label="Boersen Prize Eligibility"
              options={["Yes", "No"]}
              selectedOption={
                formData.boersenEligible === undefined
                  ? ""
                  : formData.boersenEligible
                  ? "Yes"
                  : "No"
              }
              onOptionChange={(e) => {
                const isBoersenEligible = e.target.value === "Yes";
                setFormData({
                  ...formData,
                  boersenEligible: isBoersenEligible,
                });
              }}
              required={false}
              descriptor={[
                "This prize celebrates the work of Ms. Raewyn Boersen, previous South Pacific Director, Founder, and recipient of the Mark Measures Distinguished Service Award.",
                "The prize is awarded to the top team of all women or non-binary students. If this team places in the top half of level A, then they qualify to the Regional Finals.",
                "",
                "Please select 'Yes' if you are female or non-binary and would like to compete for the Boersen Prize, or 'No' otherwise.",
              ]}
              width="100%"
            />
          )}
          <StyledButtonContainer className="comp-experience-input--StyledButtonContainer-0">
            <StyledButton onClick={handleBack} className="comp-experience-input--StyledButton-0">Back</StyledButton>
            <StyledButton
              $disabled={isButtonDisabled()}
              onClick={handleRegister}
              className="comp-experience-input--StyledButton-1">Register</StyledButton>
          </StyledButtonContainer>
        </StyledContentContainer>
      </StyledContainer>
    </StyledFlexBackground>
  );
};
