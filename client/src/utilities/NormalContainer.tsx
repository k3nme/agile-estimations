import User from ".../../../../models/User";
import UserCard from "./UserCard";
import "../sass/WoodenTable.sass";
import environment from "../config";
import Issue from "../../../models/Issue";

interface Props {
  roomID: string;
  selectedEstimationType: string;
  users: User[];
  currentUser: User;
  reveal: boolean;
  selectedIssue: Issue;
}

// Method to check if a user's estimation is present in the issue
const isUserEstimationPresent = (user: User, issue: Issue): boolean => {
  return (
    issue.estimations &&
    Object.values(issue.estimations).some(
      (userIds) => userIds && userIds.includes(user.id),
    )
  );
};

// Method to get a user's estimation from the issue
const userEstimation = (user: User, issue: Issue): string | undefined => {
  if (!issue.estimations) {
    return undefined;
  }

  for (const [estimation, userIds] of Object.entries(issue.estimations)) {
    if (userIds && userIds.includes(user.id)) {
      return estimation;
    }
  }
  return undefined;
};

const Users = ({
  users,
  currentUser,
  reveal,
  selectedIssue,
  roomID,
  selectedEstimationType,
}: Props) => {
  const askForReveal = async () => {
    try {
      const response = await fetch(
        `${environment.API_URL}/update-final-estimation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": `${environment.API_URL}/*`,
          },
          body: JSON.stringify({
            roomID: roomID,
            selectedEstimationType: selectedEstimationType,
            issueID: selectedIssue.id,
          }),
        },
      );
      if (response.ok) {
        console.log("Users estimate revealed successfully");
      } else {
        console.log(response);
        console.log("Request failed with status:", response.status);
      }
    } catch (error) {
      console.log("Request failed with error:", error);
    }
  };

  return (
    <div className="flex flex-col flex-grow h-full justify-evenly">
      <p className="text-m text-center truncate drop-shadow font-bold">
        {selectedIssue && selectedIssue.title ? selectedIssue.title : "Title"}
      </p>

      <p className="text-m truncate text-center p-2 drop-shadow font-bold">
        {selectedIssue && selectedIssue.description ? (
          <tspan>{selectedIssue.description}</tspan>
        ) : (
          "Description"
        )}
      </p>
      <div className="normal-div flex rounded justify-center items-center min-h-60 overflow-y-scroll">
        {users.map((user, index) => (
          <div key={index} className="table-container">
            <UserCard
              user={user}
              isCurrentUser={currentUser.id === user.id}
              reveal={reveal}
              isInPolygon={false}
              selectedIssue={selectedIssue}
              isEstimationPresent={isUserEstimationPresent(user, selectedIssue)}
              estimation={userEstimation(user, selectedIssue)}
            />
          </div>
        ))}
      </div>

      {!reveal ? (
        currentUser?.type === "Facilitator" && (
          <button
            title="Reveal Votes"
            type="button"
            className="reveal-button justify-center items-center bg-white p-2 h-20 w-60 rounded text-blue-800 font-bold"
            color="primary"
            onClick={askForReveal}
          >
            Reveal
          </button>
        )
      ) : (
        <div
          className="final-result p-4 justify-center flex items-center self-center rounded"
          style={{}}
        >
          {/* Replace with your final estimation logic */}
          <p className="font-bold text-center self-center items-center justify-center">
            Estimation - {selectedIssue?.finalEstimation}
          </p>
          {/* Add your final estimation details here */}
        </div>
      )}
    </div>
  );
};

export default Users;
