import { IconButton, Stack, TextField } from "@mui/material";
import { UserType } from "../../../../models/UserType";
import IssueList from "./IssueList";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import Issue from "../../../../models/Issue";
import { AddCircle, Close } from "@mui/icons-material";
import User from "../../../../models/User";
import { IssueStatus } from "../../../../models/IssueStatus";

const IssuesComponent = (props: {
	roomID: string | undefined;
	issues: Issue[];
	currentUser: User;
	onIssueSelection: (issue: Issue) => void;
	onIssueDeletion: (issue: Issue) => void;
	onIssueListClose: () => void;
}) => {
	const issuesDivRef = useRef<HTMLDivElement>(null);
	const {
		roomID,
		issues,
		onIssueSelection,
		currentUser,
		onIssueDeletion,
		onIssueListClose,
	} = props;
	const [newIssueTitle, setNewIssueTitle] = useState("");
	const [newIssueDescription, setNewIssueDescription] = useState("");
	const [showAddIssue, setShowAddIssue] = useState(false);

	const [issueTitleError, setIssueTitleError] = useState("");
	const [issueDescriptionError, setIssueDescriptionError] = useState("");

	const validateAddIssue = () => {
		setIssueTitleError(!newIssueTitle ? "Issue Title is required" : "");
		setIssueDescriptionError(
			!newIssueDescription ? "Description is required" : ""
		);
	};

	const handleShowAddIssue = () => {
		setShowAddIssue(true);
	};

	const handleCancelAddIssue = () => {
		setShowAddIssue(false);
	};

	const handleCloseIssueList = () => {
		onIssueListClose();
	};

	const generateRandomIssueId = () => {
		return Math.random().toString(36).substring(2, 10);
	};

	const addIssueToRoom = async (roomID: string | undefined) => {
		if (
			newIssueTitle &&
			newIssueDescription &&
			newIssueTitle.trim() &&
			newIssueDescription.trim()
		) {
			console.log("Issue added to the room with the following details:");
			console.log("Issue Title:", newIssueTitle);
			console.log("Issue Description:", newIssueDescription);

			try {
				const newIssue: Issue = {
					id: generateRandomIssueId(),
					title: newIssueTitle.trim(),
					description: newIssueDescription.trim(),
					finalEstimation: "",
					issueStatus: IssueStatus.Estimate,
					estimations: {},
				};

				const response = await fetch("https://agile-estimate-fastify.vercel.app/add-issue-to-room", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "https://agile-estimate-fastify.vercel.app/*",
					},
					body: JSON.stringify({
						roomID,
						id: newIssue.id,
						title: newIssue.title,
						description: newIssue.description,
						finalEstimation: newIssue.finalEstimation,
						issueStatus: newIssue.issueStatus,
						estimations: newIssue.estimations,
					}),
				});
				if (response.ok) {
					setShowAddIssue(false);
					setNewIssueTitle("");
					setNewIssueDescription("");
					console.log("Issue added to the room successfully");
				} else {
					console.log(response);
					console.log("Request failed with status:", response.status);
				}
			} catch (error) {
				console.log("Request failed with error:", error);
			}
		}
	};

	return (
		<div className={`m-4`} ref={issuesDivRef}>
			<IconButton className='float-right' onClick={handleCloseIssueList}>
				<Close />
			</IconButton>
			<div className='main-issues-container p-4 rounded-lg lg:rounded-none'>
				{/* Close Icon for Issue Container */}

				{currentUser &&
					currentUser.type === UserType.Facilitator.toString() && (
						<motion.div
							className='p-4'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5 }}
						>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.5 }}
								className='flex gap-4'
							>
								<motion.button
									type='button'
									whileHover={{ scale: 1.05 }}
									onClick={handleShowAddIssue}
									className='px-4 py-2 rounded-md w-full mb-2 text-white bg-indigo-600 hover:bg-indigo-700'
								>
									<AddCircle /> Add Issue
								</motion.button>
							</motion.div>
							{showAddIssue && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.5 }}
								>
									<Stack direction='column' alignItems='center'>
										<TextField
											error={!!issueTitleError}
											label='Title'
											required
											fullWidth
											margin='dense'
											onChange={(e) => setNewIssueTitle(e.target.value)}
											value={newIssueTitle}
											helperText={issueTitleError}
										/>
										<TextField
											error={!!issueDescriptionError}
											label='Link/Description'
											multiline
											margin='dense'
											fullWidth
											required
											onChange={(e) => setNewIssueDescription(e.target.value)}
											value={newIssueDescription}
											helperText={issueDescriptionError}
										/>
									</Stack>
									<div className='flex flex-col justify-between'>
										<motion.button
											type='button'
											whileHover={{ scale: 1.1 }}
											className=' text-white py-2 px-4 m-2 rounded w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700'
											onClick={() => {
												validateAddIssue();
												addIssueToRoom(roomID);
											}}
										>
											Save
										</motion.button>
										<motion.button
											type='button'
											whileHover={{ scale: 1.1 }}
											className=' text-white py-2 px-4 m-2 rounded w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700'
											onClick={handleCancelAddIssue}
										>
											Cancel
										</motion.button>
									</div>
								</motion.div>
							)}
						</motion.div>
					)}
				<IssueList
					roomID={roomID}
					issues={issues}
					currentUser={currentUser}
					onIssueSelection={onIssueSelection}
					onIssueDeletion={onIssueDeletion}
				/>
			</div>
		</div>
	);
};

export default IssuesComponent;
