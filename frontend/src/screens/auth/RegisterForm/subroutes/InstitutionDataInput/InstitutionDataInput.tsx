// import React, { FC, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useMultiStepRegoForm } from "../../hooks/useMultiStepRegoForm";
// import { University } from "../../../../../../shared_types/Competition/registration/StaffRegistration";
// import { sendRequest } from "../../../../../utility/request";
// import { StyledFlexBackground } from "../../../../../components/general_utility/Background";
// import { RegoProgressBar } from "../../../../../components/progress_bar/ProgressBar";
// import {
//   StyledButton,
//   StyledButtonContainer,
//   StyledContainer,
//   StyledContentContainer,
//   StyledCreateAccountButton,
//   StyledTitle,
// } from "./InstitutionDataInput.styles";
// import DropdownInput from "../../../../../components/general_utility/DropDownInput";
// import TextInput from "../../../../../components/general_utility/TextInput";

// /**
//  * A React web page form component for collecting institution-related data during the registration process.
//  *
//  * The `InstitutionDataInput` component allows the user to select an institution from a list of universities,
//  * or enter a custom institution if "Other" is selected. It also includes a field for the student's identifier number
//  * if the user selects the "Student" role. The form data is managed using the `useMultiStepRegoForm` context,
//  * and the data is sent to the backend to register the user as either a staff member or student.
//  *
//  * @returns {JSX.Element} - The form UI for the institution-related input in the registration process.
//  */
// export const InstitutionDataInput: FC = () => {
//   const navigate = useNavigate();
//   const { formData, setFormData } = useMultiStepRegoForm();
//   const [institutionOptions, setInstitutionOptions] = useState([
//     { value: "", label: "Please Select" },
//   ]);
//   const [isCustomInstitution, setIsCustomInstitution] = useState(false);

//   // Obtains the University List from the backend when the component first mounts
//   useEffect(() => {
//     const fetchUniversities = async () => {
//       try {
//         const response = await sendRequest.get<{ universities: University[] }>(
//           "/universities/list"
//         );
//         const universities = response.data;

//         const options = universities.universities.map((university) => ({
//           value: university.id,
//           label: university.name,
//         }));

//         const otherOption = { value: "other", label: "Other" };
//         setInstitutionOptions([...institutionOptions, ...options, otherOption]);
//       } catch (error) {
//         console.error("Error fetching universities:", error);
//       }
//     };

//     fetchUniversities();
//   }, []);

//   // Displays a text input box for users to enter a different institution not included
//   // in the default University list
//   const handleInstitutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedValue = e.target.value;

//     if (selectedValue === "other") {
//       setIsCustomInstitution(true);
//       setFormData({ ...formData, institution: "" });
//     } else {
//       setIsCustomInstitution(false);
//       setFormData({ ...formData, institution: selectedValue });
//     }
//   };

//   const isButtonDisabled = () => {
//     return (
//       !formData.institution ||
//       (formData.role === "Student" && !formData.studentId)
//     );
//   };

//   // Sends the entered user data to either the staff or student register backend
//   // depending on role selection
//   const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();

//     try {
//       const endpoint =
//         formData.role === "Staff" ? "/staff/register" : "/student/register";

//       await sendRequest.post(endpoint, {
//         name: `${formData.firstName} ${formData.lastName}`,
//         preferredName: formData.preferredName,
//         gender: formData.gender,
//         email: formData.email,
//         password: formData.password,
//         bio: formData.bio,
//         referrer: formData.referrer,
//       });

//       window.location.href = "/dashboard";
//     } catch (error) {
//       console.error("Error during registration:", error);
//     }
//   };

//   return (
//     <StyledFlexBackground
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "flex-start",
//         fontFamily: "Arial, Helvetica, sans-serif",
//       }}
//       className="institution-data-input--StyledFlexBackground-0">
//       <RegoProgressBar progressNumber={3} />
//       <StyledContainer className="institution-data-input--StyledContainer-0">
//         <StyledContentContainer className="institution-data-input--StyledContentContainer-0">
//           <StyledTitle className="institution-data-input--StyledTitle-0">Club Rule</StyledTitle>
//           <DropdownInput
//             label="Institution"
//             options={institutionOptions}
//             value={formData.institution || (isCustomInstitution ? "other" : "")}
//             required={true}
//             onChange={handleInstitutionChange}
//             width="100%"
//           />
//           {isCustomInstitution && (
//             <TextInput
//               label="Other Institution"
//               placeholder="Please type your institution"
//               required={true}
//               value={formData.institution}
//               onChange={(e) =>
//                 setFormData({ ...formData, institution: e.target.value })
//               }
//               width="100%"
//             />
//           )}
//           {formData.role === "Student" && (
//             <TextInput
//               label="Student Identifier Number"
//               placeholder="Please type"
//               required={true}
//               value={formData.studentId || ""}
//               onChange={(e) =>
//                 setFormData({ ...formData, studentId: e.target.value })
//               }
//               width="100%"
//             />
//           )}
//           <StyledButtonContainer className="institution-data-input--StyledButtonContainer-0">
//             <StyledButton
//               onClick={() => navigate("/siteinformation")}
//               className="institution-data-input--StyledButton-0">Back</StyledButton>
//             <StyledCreateAccountButton
//               disabled={isButtonDisabled()}
//               onClick={handleSubmit}
//               className="institution-data-input--StyledCreateAccountButton-0">Create Account</StyledCreateAccountButton>
//           </StyledButtonContainer>
//         </StyledContentContainer>
//       </StyledContainer>
//     </StyledFlexBackground>
//   );
// };
