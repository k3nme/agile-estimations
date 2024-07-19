import Issue from "../../../../models/Issue";
import User from "../../../../models/User";
import { IssueNotSelectedComponent } from "./IssueNotSelectedComponent";
import { PolygonPlanningComponent } from "./PolygonPlanningComponent";

const PlanningPoker = (props: {
	roomID: string;
	currentUser: User;
	users: User[];
	issues: Issue[];
	selectedIssue: Issue | null;
	selectedEstimationType: string;
	estimationValues: string[];
	reveal: boolean;
}) => {
	const {
		roomID,
		currentUser,
		users,
		issues,
		selectedIssue,
		selectedEstimationType,
		estimationValues,
		reveal,
	} = props;

	return (
		<>
			<div className='planning-poker-container grid grid-cols-6 p-2 md:p-4 lg:p-4 h-full md:m-2 lg:m-2'>
				{selectedIssue == null && <IssueNotSelectedComponent />}
				{selectedIssue != null &&
					(users.length <= 1 ? (
						<>
							<div className='flex col-span-6 items-center justify-center h-full text-center text-2xl font-semibold'>
								<h1 className='text-2xl font-bold text-indigo-600 hover:text-indigo-700'>
									Waiting for other users...
								</h1>
							</div>
						</>
					) : (
						<>
							<PolygonPlanningComponent
								users={users}
								issues={issues}
								roomID={roomID}
								currentUser={currentUser}
								selectedIssue={selectedIssue}
								selectedEstimationType={selectedEstimationType}
								estimationValues={estimationValues}
								isReveal={reveal}
							/>
						</>
					))}
			</div>
		</>
	);
};

export default PlanningPoker;
