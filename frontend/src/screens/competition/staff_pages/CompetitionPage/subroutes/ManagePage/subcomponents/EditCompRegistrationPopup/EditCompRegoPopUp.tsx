import { FaTimes } from "react-icons/fa";
import {
  EditCourse,
  EditRego,
} from "../../../../../../../../../shared_types/Competition/staff/Edit";
import { CourseCategory } from "../../../../../../../../../shared_types/University/Course";
import {
  StyledButton,
  StyledCloseButton,
  StyledColumn,
  StyledFirstDiv,
  StyledInput,
  StyledLabel,
  StyledModal,
  StyledModalOverlay,
  StyledRowContainer,
  StyledRowContainer2,
  StyledSecondDiv,
  StyledText,
  StyledTitle2,
} from "./EditCompRegistrationPopup.styles";
import { ToggleButton } from "../ToggleButton";

interface EditCompRegoPopUpProps {
  heading: React.ReactNode;
  onClose: () => void;
  regoFields: EditRego;
  setRegoFields: React.Dispatch<React.SetStateAction<EditRego>>;
  onSubmit: (regoFields: EditRego) => void;
  editCourses: EditCourse;
  setCourses: (category: CourseCategory, value: string) => void;
};

/**
 * `EditCompRegoPopUp is a React web page component that displays a pop up for editing and reviewing
 * competition registration form after the competition has been created. It provides options to toggle to hide
 * registration questions, as well as text inputs to change the courses assigned to the University course categories
 * appearing on the registration form
 *
 * @param {EditCompRegoPopUpProps} - The heading of the pop-up, the required registration form fields to display, 
 * and the course codes the user can edit, it also allows the handling of closing the pop-up, updating the 
 * registration form fields, performing an action when submitting, and updating the course codes.
 * @returns {JSX.Element} - A styled container presenting toggles to remove competition registration fields and text boxes to
 * alter course codes.
 */
export const EditCompRegoPopUp: React.FC<EditCompRegoPopUpProps> = ({
  heading,
  onClose,
  regoFields,
  setRegoFields,
  onSubmit,
  editCourses,
  setCourses,
}) => {
  const handleToggle = (field: keyof EditRego) => {
    setRegoFields((prevFields) => ({
      ...prevFields,
      [field]: !prevFields[field],
    }));
  };

  const handleSubmit = () => {
    onSubmit(regoFields);
    onClose();
  };

  const handleInputChange = (
    category: CourseCategory,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCourses(category, event.target.value);
  };

  return (
    <StyledModalOverlay className="edit-comp-rego-pop-up--StyledModalOverlay-0">
      <StyledModal className="edit-comp-rego-pop-up--StyledModal-0">
        <StyledCloseButton
          onClick={onClose}
          className="edit-comp-rego-pop-up--StyledCloseButton-0">
          <FaTimes />
        </StyledCloseButton>
        <div>{heading}</div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            overflow: "auto",
            height: "auto",
            width: '100%'
          }}
        >
          <StyledRowContainer2 className="edit-comp-rego-pop-up--StyledRowContainer2-0">
            <StyledFirstDiv className="edit-comp-rego-pop-up--StyledFirstDiv-0">
              <div style={{ width: "100%", textAlign: "center" }}>
                <StyledTitle2 className="edit-comp-rego-pop-up--StyledTitle2-0">Input the relevant course codes{"\n"}and names for your
                                    university{"\n"}programming subjects</StyledTitle2>
              </div>
              <StyledLabel className="edit-comp-rego-pop-up--StyledLabel-0">Introduction to Programming</StyledLabel>
              <StyledInput
                type="text"
                placeholder="COMP1234 Introduction to Programming"
                value={editCourses[CourseCategory.Introduction]}
                onChange={(e) =>
                  handleInputChange(CourseCategory.Introduction, e)
                }
                className="edit-comp-rego-pop-up--StyledInput-0" />
              <StyledLabel className="edit-comp-rego-pop-up--StyledLabel-1">Data Structures and Algorithms</StyledLabel>
              <StyledInput
                type="text"
                placeholder="COMP1234 Data Structures and Algorithms"
                value={editCourses[CourseCategory.DataStructures]}
                onChange={(e) =>
                  handleInputChange(CourseCategory.DataStructures, e)
                }
                className="edit-comp-rego-pop-up--StyledInput-1" />
              <StyledLabel className="edit-comp-rego-pop-up--StyledLabel-2">Algorithm Design and Analysis</StyledLabel>
              <StyledInput
                type="text"
                placeholder="COMP1234 Algorithm Design and Analysis"
                value={editCourses[CourseCategory.AlgorithmDesign]}
                onChange={(e) =>
                  handleInputChange(CourseCategory.AlgorithmDesign, e)
                }
                className="edit-comp-rego-pop-up--StyledInput-2" />
              <StyledLabel className="edit-comp-rego-pop-up--StyledLabel-3">Programming Challenges and Problems</StyledLabel>
              <StyledInput
                type="text"
                placeholder="COMP1234 Programming Challenges and Problems"
                value={editCourses[CourseCategory.ProgrammingChallenges]}
                onChange={(e) =>
                  handleInputChange(CourseCategory.ProgrammingChallenges, e)
                }
                className="edit-comp-rego-pop-up--StyledInput-3" />
            </StyledFirstDiv>

            
            <StyledSecondDiv>
              <StyledTitle2 className="edit-comp-rego-pop-up--StyledTitle2-1">Please toggle the fields you would{"\n"}like to show on the
                                Competition Registration Form</StyledTitle2>

              <StyledRowContainer className="edit-comp-rego-pop-up--StyledRowContainer-0">
                <StyledColumn className="edit-comp-rego-pop-up--StyledColumn-0">
                  <StyledLabel className="edit-comp-rego-pop-up--StyledLabel-4">Codeforces</StyledLabel>
                  <StyledText className="edit-comp-rego-pop-up--StyledText-0">Students enter their current Codeforces score</StyledText>
                </StyledColumn>
                <StyledColumn className="edit-comp-rego-pop-up--StyledColumn-1">
                  <ToggleButton
                    isOn={regoFields.enableCodeforcesField}
                    onToggle={() => handleToggle("enableCodeforcesField")}
                  />
                </StyledColumn>
              </StyledRowContainer>

              <StyledRowContainer className="edit-comp-rego-pop-up--StyledRowContainer-1">
                <StyledColumn className="edit-comp-rego-pop-up--StyledColumn-2">
                  <StyledLabel className="edit-comp-rego-pop-up--StyledLabel-5">ICPC Regional Participation</StyledLabel>
                  <StyledText className="edit-comp-rego-pop-up--StyledText-1">Students specify if they have ever competed in a regional
                                        ICPC round</StyledText>
                </StyledColumn>
                <StyledColumn className="edit-comp-rego-pop-up--StyledColumn-3">
                  <ToggleButton
                    isOn={regoFields.enableRegionalParticipationField}
                    onToggle={() =>
                      handleToggle("enableRegionalParticipationField")
                    }
                  />
                </StyledColumn>
              </StyledRowContainer>

              <StyledRowContainer className="edit-comp-rego-pop-up--StyledRowContainer-2">
                <StyledColumn className="edit-comp-rego-pop-up--StyledColumn-4">
                  <StyledLabel className="edit-comp-rego-pop-up--StyledLabel-6">National Olympiad Prizes</StyledLabel>
                  <StyledText className="edit-comp-rego-pop-up--StyledText-2">Students specify if they have ever won any related National
                                        Olympiad Prizes in Mathematics or Informatics</StyledText>
                </StyledColumn>
                <StyledColumn className="edit-comp-rego-pop-up--StyledColumn-5">
                  <ToggleButton
                    isOn={regoFields.enableNationalPrizesField}
                    onToggle={() => handleToggle("enableNationalPrizesField")}
                  />
                </StyledColumn>
              </StyledRowContainer>

              <StyledRowContainer className="edit-comp-rego-pop-up--StyledRowContainer-3">
                <StyledColumn className="edit-comp-rego-pop-up--StyledColumn-6">
                  <StyledLabel className="edit-comp-rego-pop-up--StyledLabel-7">International Olympiad Prizes</StyledLabel>
                  <StyledText className="edit-comp-rego-pop-up--StyledText-3">Students specify if they have ever won any related
                                        International Olympiad Prizes in Mathematics or Informatics</StyledText>
                </StyledColumn>
                <StyledColumn className="edit-comp-rego-pop-up--StyledColumn-7">
                  <ToggleButton
                    isOn={regoFields.enableInternationalPrizesField}
                    onToggle={() =>
                      handleToggle("enableInternationalPrizesField")
                    }
                  />
                </StyledColumn>
              </StyledRowContainer>
            </StyledSecondDiv>
          </StyledRowContainer2>
        </div>
        <StyledButton
          onClick={handleSubmit}
          className="edit-comp-rego-pop-up--StyledButton-0">Save Changes</StyledButton>
      </StyledModal>
    </StyledModalOverlay>
  );
};
