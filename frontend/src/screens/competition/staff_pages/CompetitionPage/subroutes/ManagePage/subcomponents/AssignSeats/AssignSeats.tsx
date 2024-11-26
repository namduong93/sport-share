/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, FC, ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TeamDetails } from "../../../../../../../../../shared_types/Competition/team/TeamDetails";
import { sendRequest } from "../../../../../../../../utility/request";
import {
  StyledAlert,
  StyledAssignPopupText,
  StyledAssignSeatsButton,
  StyledButton,
  StyledButtonContainer,
  StyledCloseButton,
  StyledCloseButtonContainer,
  StyledDeleteIcon,
  StyledDistributeSeats,
  StyledDownloadButton,
  StyledHeader,
  StyledInputContainer,
  StyledInputSection,
  StyledInputTitleA,
  StyledInputTitleB,
  StyledLevelContainer,
  StyledLevels,
  StyledManageContainer,
  StyledModalContainer,
  StyledModalOverlay,
  StyledNotifyButton,
  StyledRoomItem,
  StyledRoomList,
  StyledSeatCount,
  StyledSeatInputSelect,
  StyledTeamCount,
  StyledTitle,
} from "./AssignSeats.styles";
import { FaBell, FaChair, FaDownload, FaTimes } from "react-icons/fa";
import RadioButton from "../../../../../../../../components/general_utility/RadioButton";
import DescriptiveTextInput from "../../../../../../../../components/general_utility/DescriptiveTextInput";
import TextInput from "../../../../../../../../components/general_utility/TextInput";

interface AssignSeatsProps {
  siteName: string;
  siteCapacity: number;
  teamListState: any;
  siteOptionState: any;
};

interface SeatAssignment {
  siteId: number; // ID of the site
  teamSite: string; // e.g. "CSE Building K17"
  teamSeat: string; // e.g. "Bongo01"
  teamId: string; // ID of team who have been assigned that seat
  teamName: string; // name of team at the assigned seat
  teamLevel: string; // level of the team
};

interface exportSeatAssignment {
  siteName: string; // e.g. "CSE Building K17"
  siteCapacity: number; // e.g. 30
  teams: SeatAssignment[]; // teams who have been assigned to that seat
};

interface Room {
  roomName: string;
  level: "Level A" | "Level B";
  seatCodes: string[]; // text string input of available seat codes for this room
  numSeats: number; // length of the seat codes array
};

/**
 * A React component for assigning seats to attendees of a particular site within a competition.
 *
 * The `AssignSeats` component handles the input and assignment of seats to attending teams, allowing
 * site staff to download the asssignments and notify the respective teams of their seat assignment when complete. 
 * @param {AssignSeatsProps} props - React props containing the site details (name and capacity), the list of teams
 * attending the particular site including their details, and the chosen site option (if the user is an admin of this competition). 
 * @returns {JSX.Element} - A UI component displaying the fields to provide seat codes and assign them amongst attending teams.
 */
export const AssignSeats: FC<AssignSeatsProps> = ({
  siteName,
  siteCapacity,
  teamListState: [teamList, ],
  siteOptionState: [siteOption, ],
}) => {
  const { compId } = useParams();
  const [seatInputType, setSeatInputType] = useState<string>("Text"); // either string or inputs
  const [seatAB, setSeatAB] = useState<string>("Together"); // seat level a and b either together or separately
  const [isSeatedTogether, setIsSeatedTogether] = useState<boolean>(true); // by default, don't split level a and b
  const [isTextInput, setIsTextInput] = useState<boolean>(true);
  const [seatString, setSeatString] = useState<string>("");
  const [roomNameA, setRoomNameA] = useState<string>("");
  const [roomNameB, setRoomNameB] = useState<string>("");
  const [seatCodeInputA, setSeatCodeInputA] = useState<string>("");
  const [seatCodeInputB, setSeatCodeInputB] = useState<string>("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState<ReactNode>("");
  const [seatCount, setSeatCount] = useState<number>(0);
  const [seatModalState, setSeatModalState] = useState<boolean>(false);
  const [generatedSeats, setGeneratedSeats] = useState<string[]>([]);
  const [existingSeats, setExistingSeats] = useState<string[]>([]);
  const [teamSeatAssignments, setTeamSeatAssignments] = useState<
    SeatAssignment[]
  >([]);
  const [enoughSeats, setEnoughSeats] = useState<boolean>(false);

  // Filter by site
  let teamListToAssign = teamList;
  if (siteOption.value) {
    teamListToAssign = teamList.filter(
      (team: TeamDetails) => team.siteId === parseInt(siteOption.value)
    );
  }

  // Determine the number of teams for each level that require seats
  const numATeamsToAssign = teamListToAssign.filter(
    (team: TeamDetails) => team.teamLevel === "Level A"
  ).length;
  const numBTeamsToAssign = teamListToAssign.filter(
    (team: TeamDetails) => team.teamLevel !== "Level A"
  ).length;

  // Update seat count whenever the seat string changes
  useEffect(() => {
    // Calculate total seats based on the seatString format
    const totalSeatsFromString = seatString
      .split(",")
      .filter((seat) => seat.trim() !== "").length;
    const calculatedSeats = Math.ceil(totalSeatsFromString / 3);
    setSeatCount(calculatedSeats);
  }, [seatString]);

  // Make sure that the same seats can be given twice and each level has assigned
  // assigned seats once for a room
  const validateRoomAndSeatCodes = (
    roomName: string,
    level: string,
    seatCodes: string[]
  ) => {
    // Check for duplicate room names
    const isDuplicateRoom = rooms.some(
      (room) => room.roomName === roomName && room.level === level
    );
    if (isDuplicateRoom) {
      return {
        valid: false,
        error: "This room already exists for this level.",
      };
    }

    // Check for duplicate seat codes already included
    const seatCodesInString = seatString.split(",").map((code) => code.trim());
    const hasDuplicateSeats = seatCodes.some((code) =>
      seatCodesInString.includes(`${roomName}${code.trim()}`)
    );

    if (hasDuplicateSeats) {
      return {
        valid: false,
        error: "One or more of those seat codes have already been added.",
      };
    }

    return { valid: true, error: "" };
  };

  const handleAddRoom = () => {
    // Validate inputs from both forms
    if ((!roomNameA || !seatCodeInputA) && (!roomNameB || !seatCodeInputB)) {
      setError(<p>Please fill all fields correctly for at least one form.</p>);
      return;
    }

    // Determine which form is filled and assign appropriate values
    const isFormA = roomNameA && seatCodeInputA;
    const level = isFormA ? "Level A" : "Level B";
    const roomName = isFormA ? roomNameA : roomNameB;
    const seatCodes = isFormA
      ? seatCodeInputA.split(",")
      : seatCodeInputB.split(",");
    const numSeats = seatCodes.length;

    // Validate room and seat codes
    const { valid, error } = validateRoomAndSeatCodes(
      roomName,
      level,
      seatCodes
    );
    if (!valid) {
      setError(<p>{error}</p>);
      if (level === "Level A") {
        setRoomNameA("");
        setSeatCodeInputA("");
      } else {
        setRoomNameB("");
        setSeatCodeInputB("");
      }
      return;
    }

    const newRoom: Room = {
      roomName,
      seatCodes,
      numSeats,
      level,
    };

    // Add the room to the list with seat codes
    setRooms((prev) => [...prev, newRoom]);

    // Clear the form inputs and reset error
    if (level === "Level A") {
      setRoomNameA("");
      setSeatCodeInputA("");
    } else {
      setRoomNameB("");
      setSeatCodeInputB("");
    }
    setError("");
    generateSeats();
  };

  const handleDeleteRoom = (roomToDelete: Room) => {
    // Get the seat codes for the room being deleted
    const seatsToRemove: string[] = roomToDelete.seatCodes.map(
      (code) => `${roomToDelete.roomName}${code.trim()}`
    );

    // Update the rooms state
    setRooms((prev) =>
      prev.filter(
        (room) =>
          !(
            room.roomName === roomToDelete.roomName &&
            room.level === roomToDelete.level
          )
      )
    );

    // Determine the seats that need to be removed based on the room's seat codes
    const updatedSeats = generatedSeats.filter(
      (seat) => !seatsToRemove.includes(seat)
    );

    // Update the state with the new seat string
    setGeneratedSeats(updatedSeats);
    setSeatString(updatedSeats.join(", "));
  };

  const handleSeatStringChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSeatString(e.target.value);
  };

  const handleSeatCodesA = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSeatCodeInputA(e.target.value);
  };

  const handleSeatCodesB = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSeatCodeInputB(e.target.value);
  };

  const generateSeats = () => {
    const newSeats: string[] = [];

    // Check if Form A is filled out
    if (roomNameA && seatCodeInputA) {
      const seatCodes = seatCodeInputA.split(",").map((code) => code.trim());

      seatCodes.forEach((code) => {
        newSeats.push(`${roomNameA}${code}`);
      });
    }

    // Check if Form B is filled out
    if (roomNameB && seatCodeInputB) {
      const seatCodes = seatCodeInputB.split(",").map((code) => code.trim());

      seatCodes.forEach((code) => {
        newSeats.push(`${roomNameB}${code}`);
      });
    }

    const updatedSeats = [...existingSeats, ...newSeats];
    setExistingSeats(updatedSeats);
    setGeneratedSeats(updatedSeats);
    setSeatString(updatedSeats.join(", "));
  };

  // If not all fields are filled, disable add room button
  const cannotAddRoom = () => {
    const isFormAInvalid = !roomNameA || !seatCodeInputA;
    const isFormBInvalid = !roomNameB || !seatCodeInputB;

    // Cannot add a room if both forms are invalid
    return isFormAInvalid && isFormBInvalid;
  };

  // Based on the seats provided, assign them to the available teams attending
  // the particular site
  const distributeSeats = async () => {
    const seatAssignments: SeatAssignment[] = [];
    const teamsToAssign = teamListToAssign;
    const levelATeams = [];
    const levelBTeams = [];

    for (const team of teamsToAssign) {
      const teamLevel = team.teamLevel;
      if (teamLevel === "Level A") {
        levelATeams.push(team);
      } else if (teamLevel === "Level B") {
        levelBTeams.push(team);
      }
    }

    // If the input is a text input of seat codes, process them, then assign based
    // on level proximity chosen
    if (isTextInput) {
      const availableSeats = seatString.split(",");
      if (!isSeatedTogether) {
        teamsToAssign.length = 0;
        teamsToAssign.push(...levelATeams, ...levelBTeams);
      }

      for (let i = 0; i < teamsToAssign.length; i++) {
        const seat = availableSeats[i * 3]; // Assign a seat, skipping 2 each time
        if (!seat) {
          console.warn("Not enough seats available for all teams.");
          break; // Stop assigning if there aren't enough seats
        }

        const team = teamsToAssign[i];
        seatAssignments.push({
          siteId: team.siteId,
          teamSite: team.teamSite,
          teamSeat: seat,
          teamId: team.teamId.toString(),
          teamName: team.teamName,
          teamLevel: team.teamLevel,
        });
      }
    } else {
      // For all the provided rooms and seat codes within the rooms, assign according
      // to available seats for each level with 3 seats per team
      const availableRooms = rooms;
      const assignedTeamIds = new Set<number>();

      for (const room of availableRooms) {
        let teamsToAssign: TeamDetails[] = [];

        if (room.level === "Level A") {
          teamsToAssign = levelATeams.filter(
            (team) => !assignedTeamIds.has(team.teamId)
          );
        } else if (room.level === "Level B") {
          teamsToAssign = levelBTeams.filter(
            (team) => !assignedTeamIds.has(team.teamId)
          );
        }

        for (let i = 0; i < teamsToAssign.length; i++) {
          const seatIndex = i * 3;
          if (seatIndex >= room.seatCodes.length) {
            console.log("not enough seats");
            break;
          }

          const team = teamsToAssign[i];
          const seat = room.roomName + room.seatCodes[seatIndex];

          if (!seat) {
            break;
          }

          seatAssignments.push({
            siteId: team.siteId,
            teamSite: room.roomName,
            teamSeat: seat,
            teamId: team.teamId.toString(),
            teamName: team.teamName,
            teamLevel: team.teamLevel,
          });
          assignedTeamIds.add(team.teamId);
        }
      }
    }

    // Display the button to assign the seats if there exists enough input
    setEnoughSeats(true);
    try {
      await sendRequest.put("/competition/staff/seat_assignments", {
        compId: compId,
        seatAssignments: seatAssignments,
      });
    } catch (error) {
      console.error("Error withdrawing from the team:", error);
    }

    // Clear fields
    setTeamSeatAssignments(seatAssignments);
    setSeatString("");
    setRooms([]);
    setSeatModalState(true);
  };

  useEffect(() => {
    const seatToTeams = teamListToAssign.length;
    setEnoughSeats(seatCount >= seatToTeams);
  }, [rooms, seatString, seatCount, teamListToAssign.length]);

  const handleDownload = () => {
    // Group seat assignments by site
    const formattedData: exportSeatAssignment = {
      siteName,
      siteCapacity,
      teams: teamSeatAssignments,
    };

    // Prepare the CSV data and add headers
    const csvRows = [];
    csvRows.push(
      [
        "Site Name",
        "Site Capacity",
        "Team Level",
        "Team ID",
        "Team Name",
        "Team Seat",
      ].join(",")
    );

    // Add data rows
    formattedData.teams.forEach((assignment) => {
      const row = [
        siteName,
        siteCapacity,
        assignment.teamLevel,
        assignment.teamId,
        assignment.teamName,
        assignment.teamSeat,
      ];
      csvRows.push(row.join(","));
    });

    // CSV blob
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Tigger the download
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `seat_assignments_${siteOption.label}.csv`);
    document.body.appendChild(link);
    link.click(); // Trigger download
    document.body.removeChild(link);
  };

  const handleNotifyTeams = async () => {
    try {
      await sendRequest.post("/notification/team_seat_assignments", {
        compId: compId,
        seatAssignments: teamSeatAssignments,
      });
    } catch (error) {
      console.error("Error notifying teams:", error);
    }
  };

  return (
    <StyledManageContainer className="assign-seats--StyledManageContainer-0">
      <StyledHeader className="assign-seats--StyledHeader-0">
        <div>
          <StyledTitle className="assign-seats--StyledTitle-0">Manage Seats for {siteOption.label}</StyledTitle>
          {!enoughSeats && 
            <StyledAlert className="assign-seats--StyledAlert-0">Warning! You do not have enough seats for your teams!</StyledAlert>
          }
        </div>
        <StyledDistributeSeats className="assign-seats--StyledDistributeSeats-0">
          <StyledTeamCount $level="Level A" className="assign-seats--StyledTeamCount-0">A Teams to Assign:{numATeamsToAssign}</StyledTeamCount>
          <StyledTeamCount $level="Level B" className="assign-seats--StyledTeamCount-1">B Teams to Assign:{numBTeamsToAssign}</StyledTeamCount>
          <StyledSeatCount className="assign-seats--StyledSeatCount-0">Team Seats Available:{seatCount}</StyledSeatCount>
          {(seatString.length > 0 || rooms.length > 0) && teamListToAssign.length > 0 && enoughSeats &&
            <StyledAssignSeatsButton
              actionType="secondary"
              onClick={distributeSeats}
              label="Assign Seats"
              isOpen={false}
              icon={<FaChair />}
              $disabled={!enoughSeats}
              className="assign-seats--StyledAssignSeatsButton-0" />
          }
        </StyledDistributeSeats>
      </StyledHeader>
      {/* Seat Input Type Selection */}
      <StyledSeatInputSelect className="assign-seats--StyledSeatInputSelect-0">
        <RadioButton
          label="Select Seat Input Method"
          options={["Text", "Inputs"]}
          selectedOption={seatInputType}
          onOptionChange={(e) => {
            setSeatInputType(e.target.value);
            setIsTextInput(e.target.value === "Text");
            setGeneratedSeats([]);
            setSeatString("");
            setExistingSeats([]);
            setRooms([]);
          }}
          required={true}
          descriptor="Choose a method to provide the seat details for your site"
        />
        {isTextInput && (
          <RadioButton
            label="Levels A and B Seating"
            options={["Together", "Separate"]}
            selectedOption={seatAB}
            onOptionChange={(e) => {
              setSeatAB(e.target.value);
              setIsSeatedTogether(e.target.value === "Together");
            }}
            required={true}
          />
        )}
      </StyledSeatInputSelect>
      <StyledInputSection className="assign-seats--StyledInputSection-0">
        {isTextInput && 
          <DescriptiveTextInput
            descriptor="Please enter all available seat names separated by commas"
            placeholder="e.g., Bongo00, Bongo01, ..., Brass00, Brass01..."
            required={false}
            value={seatString}
            onChange={handleSeatStringChange}
            width="100%"
          />
        }
        {!isTextInput && 
          <StyledInputContainer className="assign-seats--StyledInputContainer-0">
            <StyledLevels className="assign-seats--StyledLevels-0">
              <StyledLevelContainer className="assign-seats--StyledLevelContainer-0">
                <StyledInputTitleA className="assign-seats--StyledInputTitleA-0">Level A</StyledInputTitleA>
                <TextInput
                  label="Room Name"
                  placeholder="Bongo"
                  type="text"
                  required={true}
                  value={roomNameA}
                  onChange={(e) => setRoomNameA(e.target.value)}
                  width="100%"
                  descriptor="Please enter the name of the room/lab"
                />
                <DescriptiveTextInput
                  descriptor="Please enter all available seat codes separated by commas"
                  placeholder="e.g., 00, 01, 02..."
                  required={true}
                  value={seatCodeInputA}
                  onChange={handleSeatCodesA}
                  width="100%"
                />
              </StyledLevelContainer>
              <StyledLevelContainer className="assign-seats--StyledLevelContainer-1">
                <StyledInputTitleB className="assign-seats--StyledInputTitleB-0">Level B</StyledInputTitleB>
                <TextInput
                  label="Room Name"
                  placeholder="Bongo"
                  type="text"
                  required={true}
                  value={roomNameB}
                  onChange={(e) => setRoomNameB(e.target.value)}
                  width="100%"
                  descriptor="Please enter the name of the room/lab"
                />
                <DescriptiveTextInput
                  descriptor="Please enter all available seat codes separated by commas"
                  placeholder="e.g., 00, 01, 02..."
                  required={true}
                  value={seatCodeInputB}
                  onChange={handleSeatCodesB}
                  width="100%"
                />
              </StyledLevelContainer>
            </StyledLevels>
            <StyledButton
              type="button"
              onClick={handleAddRoom}
              disabled={cannotAddRoom()}
              className="assign-seats--StyledButton-0">Add Room</StyledButton>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <StyledRoomList className="assign-seats--StyledRoomList-0">
              {rooms.map((room, index) => (
                <StyledRoomItem key={index} className="assign-seats--StyledRoomItem-0">
                  <span>Room {room.roomName}</span>
                  <span>Level {room.level}</span>
                  <span>{room.numSeats} seats</span>
                  <StyledDeleteIcon
                    onClick={() => handleDeleteRoom(room)}
                    className="assign-seats--StyledDeleteIcon-0">
                    <FaTimes />
                  </StyledDeleteIcon>
                </StyledRoomItem>
              ))}
            </StyledRoomList>
          </StyledInputContainer>
        }
      </StyledInputSection>
      { seatModalState && (
        <StyledModalOverlay className="assign-seats--StyledModalOverlay-0">
          <StyledModalContainer className="assign-seats--StyledModalContainer-0">
            <StyledCloseButtonContainer className="assign-seats--StyledCloseButtonContainer-0">
              <StyledCloseButton
                onClick={() => {
                  setSeatModalState(false);
                  setSeatString("");
                }}
                className="assign-seats--StyledCloseButton-0">
                <FaTimes />
              </StyledCloseButton>
            </StyledCloseButtonContainer>
            <StyledAssignPopupText className="assign-seats--StyledAssignPopupText-0">Seats Assigned Successfully!</StyledAssignPopupText>
            <StyledButtonContainer className="assign-seats--StyledButtonContainer-0">
              <StyledDownloadButton
                actionType="primary"
                onClick={handleDownload}
                label="Download"
                isOpen={false}
                icon={<FaDownload />}
                className="assign-seats--StyledDownloadButton-0" />
              <StyledNotifyButton
                actionType="secondary"
                onClick={handleNotifyTeams}
                label="Notify Teams"
                isOpen={false}
                icon={<FaBell />}
                className="assign-seats--StyledNotifyButton-0" />
            </StyledButtonContainer>
          </StyledModalContainer>
        </StyledModalOverlay>
      )}
    </StyledManageContainer>
  );
};
