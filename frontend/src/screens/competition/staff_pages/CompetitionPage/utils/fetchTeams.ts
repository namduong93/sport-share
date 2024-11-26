import { TeamDetails } from "../../../../../../shared_types/Competition/team/TeamDetails";
import { sendRequest } from "../../../../../utility/request";

/**
 * Fetches the list of teams for a specific competition from the server and updates
 * the state with the team data. It filters out students with a `null` userId
 * from each team's student list.
 *
 * @param {string | undefined} compId - The ID of the competition for which the teams are being fetched.
 * @param {React.Dispatch<React.SetStateAction<Array<TeamDetails>>>} setTeams - The state setter function
 * for updating the team list in the component.
 *
 * @returns {Promise<void>} - A promise that resolves once the team data is fetched and the state is updated.
 */
export const fetchTeams = async (
  compId: string | undefined,
  setTeams: React.Dispatch<React.SetStateAction<Array<TeamDetails>>>
) => {
  try {
    const response = await sendRequest.get<{ teamList: Array<TeamDetails> }>(
      "/competition/teams",
      { compId }
    );
    const { teamList } = response.data;
    setTeams(
      teamList.map((team) => ({
        ...team,
        students: team.students.filter((student) => student.userId !== null),
      }))
    );
  } catch (error: unknown) {
    console.log(error);
  }
};
