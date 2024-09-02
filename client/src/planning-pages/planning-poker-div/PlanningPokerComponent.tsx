import Issue from "../../../../models/Issue";
import User from "../../../../models/User";
import { IssueNotSelectedComponent } from "./IssueNotSelectedComponent";
import { PolygonPlanningComponent } from "./PolygonPlanningComponent";
import {
        TextField,
} from "@mui/material";

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
	
	const copyLink = () => {
                const roomLink = document.getElementById("roomLink")?.getAttribute("value");
                if (roomLink) {
                        if (navigator && navigator.clipboard) {
                                navigator.clipboard.writeText(roomLink);
                        } else {
                                // Fallback for older browsers or non-secure context
                                const textArea = document.createElement("textarea");
                                textArea.value = roomLink;
                                document.body.appendChild(textArea);
                                textArea.select();
                                try {
                                        document.execCommand("copy");
                                        console.log("Room link copied to clipboard (fallback method)!");
                                } catch (err) {
                                        console.error("Fallback: Could not copy text: ", err);
                                }
                                document.body.removeChild(textArea);
                        }
                }
        };

        const copyCode = () => {
                const roomLink = document.getElementById("roomLink")?.getAttribute("value");
                if (roomLink) {
                        const roomCode = roomLink.split("/").pop();

                        if (navigator && navigator.clipboard) {
                                navigator.clipboard.writeText(roomCode!);
                        } else {
                                // Fallback for older browsers or non-secure context
                                const textArea = document.createElement("textarea");
                                textArea.value = roomCode!;
                                document.body.appendChild(textArea);
                                textArea.select();
                                try {
                                        document.execCommand("copy");
                                        console.log("Room link copied to clipboard (fallback method)!");
                                } catch (err) {
                                        console.error("Fallback: Could not copy text: ", err);
                                }
                                document.body.removeChild(textArea);
                        }
                }
        };

	return (
		<>
			<div className='planning-poker-container grid grid-cols-6 p-2 md:p-4 lg:p-4 h-full md:m-2 lg:m-2'>
				{selectedIssue == null && <IssueNotSelectedComponent />}
				{selectedIssue != null &&
					(users.length <= 1 ? (
						<>
							<div className='flex flex-col col-span-6 items-center justify-center h-full text-center text-2xl font-semibold'>
								<h1 className='text-2xl font-bold text-indigo-600 hover:text-indigo-700'>
									You seem to be alone. Please invite players to join this session.
								</h1>
								<div className='flex h-fit'>
									<button
                                                                		title='Copy Link'
                                                                		type='button'
                                                                		className='w-fit text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-2 m-4 rounded '
                                                                		onClick={copyLink}
                                                        		>
                                                                		Copy Invite Link
                                                        		</button>

                                                        		<button
                                                                		title='Copy Code'
                                                                		type='button'
                                                                		className='w-fit text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-2 m-4 rounded'
                                                                		onClick={copyCode}
                                                        		>
                                                                		Copy Invite Code
                                                        		</button>
								</div>
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
