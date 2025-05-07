import type Issue from "../../../../models/Issue";
import type User from "../../../../models/User";
import NormalContainer from "../../utilities/NormalContainer";
import PolygonContainer from "../../utilities/PolygonContainer";
import EstimationComponent from "./EstimationButtons";

export const PolygonPlanningComponent = (props: {
  roomID: string;
  users: User[];
  issues: Issue[];
  currentUser: User;
  selectedIssue: Issue;
  selectedEstimationType: string;
  estimationValues: string[];
  isReveal: boolean;
}) => {
  const {
    roomID,
    users,
    issues,
    currentUser,
    selectedIssue,
    selectedEstimationType,
    estimationValues,
    isReveal,
  } = props;

  return (
    <div className="flex flex-col h-full col-span-6">
      <div className="flex-grow flex flex-col md:flex-row">
        {/* Mobile UI */}
        <div className="md:hidden lg:hidden flex-1 p-4">
          <NormalContainer
            users={users}
            currentUser={currentUser}
            reveal={isReveal}
            roomID={roomID}
            selectedEstimationType={selectedEstimationType}
            selectedIssue={selectedIssue}
          />
        </div>

        {/* Desktop UI */}
        <div className="hidden md:flex lg:flex flex-1 p-4">
          <NormalContainer
            roomID={roomID}
            selectedEstimationType={selectedEstimationType}
            users={users}
            currentUser={currentUser}
            reveal={isReveal}
            selectedIssue={selectedIssue}
          />
        </div>

        {/* Estimation Component */}
        <div className="flex-1 p-4 flex flex-col md:h-auto overflow-y-auto">
          <EstimationComponent
            selectedEstimationType={selectedEstimationType}
            estimationValues={estimationValues}
            issues={issues}
            reveal={isReveal}
            currentUser={currentUser}
            roomID={roomID}
            selectedIssue={selectedIssue}
          />
        </div>
      </div>
    </div>
  );
};
