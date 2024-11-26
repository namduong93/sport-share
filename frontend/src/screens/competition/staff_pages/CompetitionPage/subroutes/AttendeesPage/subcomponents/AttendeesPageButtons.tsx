/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useState } from "react";
import jsPDF from "jspdf";
import { AttendeesDetails } from "../../../../../../../../shared_types/Competition/staff/AttendeesDetails";
import {
  dietaryOptions,
  tShirtOptions,
} from "../../../../../../auth/RegisterForm/subroutes/SiteDataInput/SiteDataOptions";
import { DownloadButtons } from "../../../components/DownloadButtons";

interface AttendeesButtonsProps {
  attendeesListState: [
    Array<AttendeesDetails>,
    React.Dispatch<React.SetStateAction<Array<AttendeesDetails>>>
  ];
  siteOption: { value: string; label: string };
  siteOptionsState: [
    Array<{ value: string; label: string }>,
    React.Dispatch<
      React.SetStateAction<Array<{ value: string; label: string }>>
    >
  ];
}

interface TShirtCounts {
  [key: string]: {
    male: number;
    female: number;
  };
}

interface DietaryRequirement {
  requirement: string;
  details: string;
  studentName: string;
  studentEmail: string;
  university: string;
}

interface AccessibilityRequirement {
  requirement: string;
  details: string;
  studentName: string;
  studentEmail: string;
  university: string;
  teamSeat: string;
}

/**
 * AttendeesPageButtons component handles the download of attendee data
 * in CSV and PDF formats, with options to filter by site and display
 * related attendee details like T-shirt sizes, dietary requirements,
 * and accessibility needs.
 *
 * @param {AttendeesButtonsProps} props - React AttendeesButtonsProps specified above
 * @returns {JSX.Element} - A UI component that displays allows download of student
 * information
 */
export const AttendeesPageButtons: FC<AttendeesButtonsProps> = ({
  attendeesListState: [attendeesList, ],
  siteOption: siteOption,
}) => {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Helper function to escape CSV fields that might contain commas, quotes,
  // or newline characters
  const escapeCsvField = (field: string): string => {
    if (field.includes(",") || field.includes('"') || field.includes("\n")) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  };

  // Downloads the attendee data in CSV format. It processes the attendees
  // list, filters by site if necessary, and generates a CSV file with details
  // including T-shirt quantities, dietary needs, and accessibility requirements.
  const downloadCSV = async () => {
    let attendees = attendeesList;
    if (siteOption.value)
      attendees = attendeesList.filter(
        (attendee) => attendee.siteId === parseInt(siteOption.value)
      );

    let csvContent = "Site Attendee Data Report: CSV format\n\n";
    csvContent += `Site Name: ${attendees[0].siteName}`;
    csvContent += `Site Capacity (Attendees): ${attendees[0].siteCapacity}`;
    csvContent += `Number of Attendees: ${attendees.length}`;

    const uniqueSizes = [
      ...new Set(
        tShirtOptions
          .filter((option) => option.value !== "")
          .map((option) => option.value.slice(1))
      ),
    ];

    // T-shirt Quantities
    const tshirtCounts: TShirtCounts = {};
    uniqueSizes.forEach(
      (size) => (tshirtCounts[size] = { male: 0, female: 0 })
    );

    attendees.forEach((attendee: AttendeesDetails) => {
      if (attendee.tshirtSize && attendee.tshirtSize !== "") {
        const size = attendee.tshirtSize.slice(1); // Remove M/L prefix
        const type = attendee.tshirtSize.startsWith("M") ? "male" : "female";
        if (tshirtCounts[size]) tshirtCounts[size][type]++;
      }
    });

    csvContent += "T-shirt quantities:\n";
    csvContent += `Size:,${uniqueSizes.join(",")}\n`;
    csvContent += `Mens,${uniqueSizes
      .map((size) => tshirtCounts[size].male)
      .join(",")}\n`;
    csvContent += `Ladies,${uniqueSizes
      .map((size) => tshirtCounts[size].female)
      .join(",")}\n\n`;

    // Process dietary requirements
    const dietaryRequirements: DietaryRequirement[] = attendees
      .filter((attendee: AttendeesDetails) => {
        // Skip if dietary needs is "None" and no allergies
        if (attendee.dietaryNeeds === "None" && !attendee.allergies)
          return false;
        // Skip if allergies is "None" and no dietary needs
        if (
          (!attendee.dietaryNeeds || attendee.dietaryNeeds === "None") &&
          attendee.allergies === "None"
        )
          return false;
        // Only include if there are actual dietary needs or allergies
        return attendee.dietaryNeeds || attendee.allergies;
      })
      .map((attendee) => {
        const dietaryLabel =
          dietaryOptions.find(
            (option) => option.value === attendee.dietaryNeeds
          )?.label || attendee.dietaryNeeds;

        return {
          requirement: attendee.dietaryNeeds ? "Dietary" : "Allergy",
          details: attendee.allergies
            ? `${dietaryLabel || ""} ${
                attendee.allergies ? `(Allergies: ${attendee.allergies})` : ""
              }`
            : dietaryLabel || "",
          studentName: attendee.name,
          studentEmail: attendee.email,
          university: attendee.universityName,
        };
      })
      .filter((req) => {
        // Filter out empty details or "None" values
        if (!req.details || req.details === "None") return false;
        // Filter out cases where it's just empty with "None" allergies
        if (
          req.details.includes("{}") &&
          req.details.includes("(Allergies: None)")
        )
          return false;
        if (req.details === "{}") return false;
        return true;
      });

    if (dietaryRequirements.length > 0) {
      csvContent += "Dietary Requirements:\n";
      csvContent +=
        "Requirement,Details,Student name,Student email,University\n";
      dietaryRequirements.forEach((req) => {
        csvContent += `${escapeCsvField(req.requirement)},${escapeCsvField(
          req.details
        )},${escapeCsvField(req.studentName)},${escapeCsvField(
          req.studentEmail
        )},${escapeCsvField(req.university)}\n`;
      });
      csvContent += "\n";
    }
    // Process accessibility requirements
    const accessibilityRequirements: AccessibilityRequirement[] = attendees
      .filter(
        (attendee) =>
          attendee.accessibilityNeeds && attendee.accessibilityNeeds !== "None" // Exclude "None" values
      )
      .map((attendee) => ({
        requirement: "Accessibility",
        details: attendee.accessibilityNeeds || "",
        studentName: attendee.name,
        studentEmail: attendee.email,
        university: attendee.universityName,
        teamSeat: attendee.teamSeat,
      }));

    if (accessibilityRequirements.length > 0) {
      csvContent += "Accessibility Requirements:\n";
      csvContent +=
        "Requirement:,Details:,Student Name:,Student Email:,University:,Seat:\n";
      accessibilityRequirements.forEach((req) => {
        csvContent += `${escapeCsvField(req.requirement)},${escapeCsvField(
          req.details
        )},${escapeCsvField(req.studentName)},${escapeCsvField(
          req.studentEmail
        )},${escapeCsvField(req.university)},SEAT\n`;
      });
    }

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `site_attendee_data_${attendees[0].siteName}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  };

  // Downloads the attendee data in PDF format, generating a report similar
  // to the CSV but in a paginated format using the jsPDF library. It includes
  // sections for T-shirt sizes, dietary requirements, and accessibility needs.
  const downloadPDF = async () => {
    let attendees = attendeesList;
    if (siteOption.value)
      attendees = attendeesList.filter(
        (attendee) => attendee.siteId === parseInt(siteOption.value)
      );

    // Initialize PDF document
    const doc = new jsPDF();
    let yPos = 20;

    // Add title and subheadings
    doc.setFontSize(16);
    doc.text("Site Attendee Data Report: PDF format", 10, yPos);
    yPos += 15;

    doc.setFontSize(12);
    doc.text(`Site Name: ${attendees[0].siteName}`, 10, yPos);
    yPos += 10;

    doc.text(
      `Site capacity (Attendees): ${attendees[0].siteCapacity}`,
      10,
      yPos
    );
    yPos += 15;

    doc.text(`Number of Attendees: ${attendees.length}`, 10, yPos);
    yPos += 15;

    // T-shirt quantities
    doc.text("T-shirt quantities:", 10, yPos);
    yPos += 10;

    const uniqueSizes = [
      ...new Set(
        tShirtOptions
          .filter((option) => option.value !== "")
          .map((option) => option.value.slice(1))
      ),
    ];

    // Calculate T-shirt counts
    const tshirtCounts: TShirtCounts = {};
    uniqueSizes.forEach(
      (size) => (tshirtCounts[size] = { male: 0, female: 0 })
    );

    attendees.forEach((attendee: AttendeesDetails) => {
      if (attendee.tshirtSize && attendee.tshirtSize !== "") {
        const size = attendee.tshirtSize.slice(1);
        const type = attendee.tshirtSize.startsWith("M") ? "male" : "female";
        if (tshirtCounts[size]) tshirtCounts[size][type]++;
      }
    });

    (doc as any).autoTable({
      startY: yPos,
      head: [["Size:", ...uniqueSizes, "Total"]],
      body: [
        [
          "Male",
          ...uniqueSizes.map((size) => tshirtCounts[size].male),
          uniqueSizes.reduce((sum, size) => sum + tshirtCounts[size].male, 0),
        ],
        [
          "Female",
          ...uniqueSizes.map((size) => tshirtCounts[size].female),
          uniqueSizes.reduce((sum, size) => sum + tshirtCounts[size].female, 0),
        ],
        [
          "Total",
          ...uniqueSizes.map(
            (size) => tshirtCounts[size].male + tshirtCounts[size].female
          ),
          uniqueSizes.reduce(
            (sum, size) =>
              sum + tshirtCounts[size].male + tshirtCounts[size].female,
            0
          ),
        ],
      ],
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [102, 136, 210] },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Process dietary requirements
    const dietaryRequirements = attendees
      .filter((attendee: AttendeesDetails) => {
        if (attendee.dietaryNeeds === "None" && !attendee.allergies)
          return false;
        if (
          (!attendee.dietaryNeeds || attendee.dietaryNeeds === "None") &&
          attendee.allergies === "None"
        )
          return false;
        return attendee.dietaryNeeds || attendee.allergies;
      })
      .map((attendee) => {
        const dietaryLabel =
          dietaryOptions.find(
            (option) => option.value === attendee.dietaryNeeds
          )?.label || attendee.dietaryNeeds;

        return {
          requirement: attendee.dietaryNeeds ? "Dietary" : "Allergy",
          details: attendee.allergies
            ? `${dietaryLabel || ""} ${
                attendee.allergies ? `(Allergies: ${attendee.allergies})` : ""
              }`
            : dietaryLabel || "",
          studentName: attendee.name,
          studentEmail: attendee.email,
          university: attendee.universityName,
        };
      })
      .filter((req) => {
        if (!req.details || req.details === "None") return false;
        if (
          req.details.includes("{}") &&
          req.details.includes("(Allergies: None)")
        )
          return false;
        if (req.details === "{}") return false;
        return true;
      });

    if (dietaryRequirements.length > 0) {
      doc.text("Dietary Requirements:", 10, yPos);
      yPos += 5;

      // Group dietary requirements by type
      const groupedDietary = dietaryRequirements.reduce((acc, curr) => {
        const key = curr.details;
        if (!acc[key])
          acc[key] = { details: curr.details, students: [], count: 0 };
        acc[key].students.push({
          name: curr.studentName,
          email: curr.studentEmail,
          university: curr.university,
        });
        acc[key].count++;
        return acc;
      }, {} as Record<string, { details: string; students: any[]; count: number }>);

      const dietaryTableData = Object.values(groupedDietary).flatMap(
        (group) => {
          return group.students.map((student, index) => [
            index === 0 ? group.details : "",
            index === 0 ? group.count : "",
            group.details,
            student.name,
            student.email,
            student.university,
          ]);
        }
      );

      (doc as any).autoTable({
        startY: yPos,
        head: [
          [
            "Requirement",
            "Quantity",
            "Details",
            "Student",
            "Email",
            "University",
          ],
        ],
        body: dietaryTableData,
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [102, 136, 210] },
      });
      yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // Process accessibility requirements
    const accessibilityRequirements = attendees
      .filter(
        (attendee) =>
          attendee.accessibilityNeeds && attendee.accessibilityNeeds !== "None"
      )
      .map((attendee) => ({
        requirement: attendee.accessibilityNeeds || "Accessibility",
        details: attendee.accessibilityNeeds || "",
        studentName: attendee.name,
        studentEmail: attendee.email,
        university: attendee.universityName,
        teamSeat: attendee.teamSeat,
      }));

    if (accessibilityRequirements.length > 0) {
      doc.text("Accessibility Requirements:", 10, yPos);
      yPos += 5;

      // Group accessibility requirements by type of need
      const groupedAccessibility = accessibilityRequirements.reduce(
        (acc, curr) => {
          const key = curr.details;
          if (!acc[key])
            acc[key] = { details: curr.details, students: [], count: 0 };
          acc[key].students.push({
            name: curr.studentName,
            email: curr.studentEmail,
            university: curr.university,
            teamSeat: curr.teamSeat,
          });
          acc[key].count++;
          return acc;
        },
        {} as Record<
          string,
          { details: string; students: any[]; count: number }
        >
      );

      const accessibilityTableData = Object.values(
        groupedAccessibility
      ).flatMap((group) => {
        return group.students.map((student, index) => [
          index === 0 ? group.details : "", // Display the type of requirement only once per group
          index === 0 ? group.count : "", // Display the count only once per group
          student.name,
          student.email,
          student.university,
          student.teamSeat,
        ]);
      });

      (doc as any).autoTable({
        startY: yPos,
        head: [
          ["Requirement", "Quantity", "Student", "Email", "University", "Seat"],
        ],
        body: accessibilityTableData,
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [102, 136, 210] },
      });
    }

    // Save the PDF
    doc.save(`site_attendee_data_${attendees[0].siteName}.pdf`);
    return true;
  };

  return (
    <DownloadButtons
      isDownloadingState={[isDownloading, setIsDownloading]}
      downloadCSV={downloadCSV}
      downloadPDF={downloadPDF}
      downloadQuestion="Are you sure you want to see the attendees' details for this site?"
      isSiteDownload={true}
      hasAttendeesToDownload={
        siteOption.value
          ? attendeesList.filter(
              (attendee) => attendee.siteId === parseInt(siteOption.value)
            ).length > 0
          : attendeesList.length > 0
      }
    />
  );
};
