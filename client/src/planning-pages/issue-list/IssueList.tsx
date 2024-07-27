import Issue from "../../../../models/Issue";
import DeleteIcon from "@mui/icons-material/Delete";
import TextWithLink from "../../utilities/TextWithLink";
import { motion } from "framer-motion";
import User from "../../../../models/User";
import { UserType } from "../../../../models/UserType";

const IssueList = ({
	roomID,
	issues,
	currentUser,
	onIssueSelection,
	onIssueDeletion,
}: {
	roomID: string | undefined;
	issues: Issue[] | undefined;
	currentUser: User;
	onIssueSelection: (issue: Issue) => void;
	onIssueDeletion: (issue: Issue) => void;
}) => {
	const handleIssueClick = (issue: Issue) => {
		onIssueSelection(issue);
	};

	const handleDeleteIssue = (issue: Issue) => {
		onIssueDeletion(issue);
	};

	const deleteIssueFromRoom = async (issue: Issue) => {
		try {
			const response = await fetch("https://agile-estimate-fastify.vercel.app/remove-issue-from-room", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "https://agile-estimate-fastify.vercel.app/*",
				},
				body: JSON.stringify({
					roomID,
					id: issue.id,
				}),
			});
			if (response.ok) {
				handleDeleteIssue(issue);
				console.log("Issue deleted from the room successfully");
			} else {
				console.log(response);
				console.log("Request failed with status:", response.status);
			}
		} catch (error) {
			console.log("Request failed with error:", error);
		}
	};

	return (
		<motion.div
			className='issue-list-container overflow-y-scroll'
			style={{
				maxHeight:
					currentUser?.type.toString() == UserType.Participant
						? "36rem"
						: "33rem",
				scrollbarWidth: "thin",
				scrollbarColor: "transparent transparent",
			}}
			whileHover={{
				scrollbarWidth: "thin",
				scrollBehavior: "smooth",
				scrollbarColor: "#BCBEB6 white",
			}}
		>
			{issues &&
				issues.length == 0 &&
				currentUser?.type.toString() == UserType.Participant && (
					<div className='flex flex-col items-center justify-center h-full text-center align-middle'>
						<p className='text-xl text-indigo-600 justify-center items-center text-center'>
							No issues
						</p>
					</div>
				)}
			{issues &&
				issues?.length > 0 &&
				issues?.map((issue, index) => (
					<motion.div
						className='flex flex-row space-x-4 m-4'
						initial={{
							opacity: 0,
							x: 0,
							y: -100,
							scale: 0.5,
							rotate: 0,
							zIndex: 0,
						}}
						animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, zIndex: 0 }}
						exit={{
							opacity: 0,
							x: 0,
							y: -100,
							scale: 0.5,
							rotate: 0,
							zIndex: 0,
						}}
						transition={{ duration: 0.5 }}
						key={index}
					>
						<div className='issue-item cursor-pointer flex-grow p-4 bg-white rounded-lg shadow'>
							<div className='issue-title flex justify-between items-center mb-2'>
								<p
									className='text-xl drop-shadow truncate w-28'
									title={issue.title}
								>
									{issue.title}
								</p>
								<motion.button
									type='button'
									whileHover={{ scale: 1.05 }}
									title='Issue Status'
									onClick={() => handleIssueClick(issue)}
									className='px-2 py-2 rounded border text-white bg-indigo-600 hover:bg-indigo-700'
								>
									{issue.issueStatus.toString()}
								</motion.button>
							</div>
							<div className='issue-description flex justify-between items-center flex-wrap truncate w-50'>
								<TextWithLink
									className='text-xs drop-shadow truncate w-28'
									text={issue.description}
								/>

								<DeleteIcon
									onClick={() => deleteIssueFromRoom(issue)}
									className='delete-icon text-indigo-600 hover:text-indigo-700 cursor-pointer'
								/>
							</div>
						</div>
					</motion.div>
				))}
		</motion.div>
	);
};

export default IssueList;
