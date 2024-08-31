import { useState } from "react";
import EstimationType from "../../../../models/EstimationType";
import { motion } from "framer-motion";
import User from "../../../../models/User";
import DonutChart from "../../utilities/DonutChart";
import { CircularProgress, Grid } from "@mui/material";
import Issue from "../../../../models/Issue";

interface EstimationButtonsProps {
	roomID: string;
	selectedIssue: Issue;
	issues: Issue[];
	selectedEstimationType: string;
	estimationValues: string[];
	reveal: boolean;
	currentUser: User;
}

interface ConfirmedState {
	[key: string]: boolean;
}

const EstimationComponent = ({
	roomID,
	selectedIssue,
	issues,
	selectedEstimationType,
	estimationValues,
	reveal,
	currentUser,
}: EstimationButtonsProps) => {
	const [selectedEstimation, setSelectedEstimation] = useState("");

	const [confirmed, setConfirmed] = useState<ConfirmedState>(
		issues.reduce((acc, issue) => {
			acc[issue.id] = Object.values(issue.estimations).find((estimation) =>
				estimation.includes(currentUser.id)
			)
				? true
				: false;
			return acc;
		}, {} as ConfirmedState)
	);

	const buttonVariants = {
		hover: { scale: 1.05 },
		click: { scale: 0.95 },
	};

	const agreement = (issue: Issue) => {
		const estimations = Object.values(issue.estimations);
		const max = Math.max(...estimations.map((estimation) => estimation.length));
		const total = estimations.reduce((acc, curr) => acc + curr.length, 0);
		return ((max / total) * 100).toFixed(2);
	};

	const confirmUserEstimate = async () => {
		try {
			const response = await fetch("https://planning-poker-gjur.onrender.com/user-estimate-issue", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "https://planning-poker-gjur.onrender.com/*",
				},
				body: JSON.stringify({
					roomID: roomID,
					issueID: selectedIssue.id,
					userID: currentUser.id,
					estimation: selectedEstimation,
				}),
			});
			if (response.ok) {
				setSelectedEstimation("");
				setConfirmed({ ...confirmed, [selectedIssue.id]: true });
				console.log(
					"User estimate confirmed successfully, waiting for others to confirm..."
				);
			} else {
				console.log(response);
				console.log("Request failed with status:", response.status);
			}
		} catch (error) {
			console.log("Request failed with error:", error);
		}
	};

	const renderButtons = (values: string[]) => {
		return values.map((size) => (
			<motion.div
				key={size}
				whileHover='hover'
				whileTap='click'
				variants={buttonVariants}
			>
				<button
					title='Estimate'
					type='button'
					disabled={confirmed[selectedIssue?.id as string]}
					className='text-indigo-600 p-4 m-4 rounded disabled:opacity-50 font-semibold border-indigo-600 ring ring-indigo-600 w-10 h-10 md:w-20 md:h-25'
					onClick={() => {
						setSelectedEstimation(size);
					}}
					style={{
						margin: 6,
						padding: "4px",
						borderRadius: "8px",
						transition: "all 0.3s",
						color: selectedEstimation === size ? "#fff" : "#3f51b5",
						boxShadow:
							selectedEstimation === size
								? "0 0 10px rgba(0, 0, 255, 0.5)"
								: "none",
						backgroundColor: selectedEstimation === size ? "#3f51b5" : "#fff",
					}}
				>
					{size}
				</button>
			</motion.div>
		));
	};

	const renderSelectedTShirtSize = (size: string) => {
		return (
			<div>
				<svg
					version='1.1'
					xmlns='http://www.w3.org/2000/svg'
					xmlnsXlink='http://www.w3.org/1999/xlink'
					viewBox='0 0 50 50'
					width='120'
					height='120'
					xmlSpace='preserve'
				>
					<path
						fill='#5a67d8'
						d='M49.8 17.961c-0.543-1.093-5.385-10.726-7.919-12.45-2.438-1.657-8.41-4.215-8.664-4.322l-0.291-0.125-0.311 0.06c-0.05 0.01-5.075 0.968-7.615 0.968s-7.565-0.958-7.615-0.968l-0.311-0.06-0.291 0.125c-0.254 0.107-6.225 2.665-8.664 4.322-2.534 1.724-7.375 11.357-7.919 12.45l-0.2 0.403 0.157 0.421c0.065 0.176 1.679 4.327 8.793 5.277l0.616 0.083 2.185-3.039c0.983 5.617-0.419 18.846-2.155 25.213l-0.25 0.915 0.89 0.33c0.151 0.056 3.819 1.371 14.764 1.371s14.614-1.315 14.764-1.371l0.89-0.33-0.25-0.915c-1.735-6.367-3.138-19.596-2.155-25.213l2.185 3.039 0.616-0.083c7.114-0.948 8.727-5.1 8.793-5.277l0.157-0.421zM30.711 3.563C29.691 4.755 27.898 6.101 25 6.101s-4.691-1.347-5.711-2.539c1.751 0.28 4.122 0.605 5.711 0.605s3.96-0.325 5.711-0.605M46.667 19.625c-0.892 0.797-2.519 1.814-5.282 2.285l-3.669-5.104-0.773 1.514c-0.746 1.458-1.502 4.976-0.863 13.446 0.381 5.046 1.173 10.422 2.063 14.091-1.599 0.361-5.511 1.001-13.144 1.001-6.945 0-11.213-0.56-13.145-0.995 0.89-3.669 1.683-9.049 2.064-14.098 0.64-8.47-0.116-11.988-0.861-13.446l-0.773-1.514-3.67 5.104c-4.21-0.715-5.819-2.667-6.322-3.49 2.007-3.977 5.482-10.164 6.994-11.191 1.74-1.183 5.657-2.962 7.421-3.741a10 10 0 0 0 1.427 1.877c1.248 1.282 3.45 2.812 6.865 2.812s5.619-1.529 6.865-2.812a10 10 0 0 0 1.427-1.877c1.764 0.779 5.68 2.558 7.421 3.741 1.511 1.028 4.985 7.211 6.992 11.189a5.75 5.75 0 0 1-1.038 1.208'
					/>
					<text
						x='25'
						y='40'
						fontSize='10'
						textAnchor='middle'
						fontWeight='bold'
						fill='#5a67d8'
					>
						{size}
					</text>
				</svg>
			</div>
		);
	};

	return (
		<>
			{reveal && (
				<div className='flex flex-col chart-container h-full col-span-3'>
					<div className='votes-container flex flex-col h-1/2 invisible md:visible lg:visible shadow'>
						<h3 className='text-center font-semibold'>Votes</h3>
						<div className='h-full flex flex-col'>
							<DonutChart selectedIssue={selectedIssue} />
						</div>
					</div>
					<div className='flex flex-col items-center justify-center shadow-lg rounded-lg p-6 sm:h-3/4 md:h-2/3 lg:h-1/2'>
						<h3 className='text-center font-semibold'>Result</h3>
						<div className='flex flex-col h-full justify-center items-center'>
							<div className='rounded text-center w-full h-auto flex flex-col sm:flex-row justify-center items-center bg-gray-100 p-4'>
								<div className='w-full sm:w-1/2 m-4 h-full flex justify-center items-center'>
									{selectedEstimationType === "T-Shirt Sizes" ? (
										renderSelectedTShirtSize(selectedIssue.finalEstimation)
									) : (
										<div>
											<p className='h-full font-semibold drop-shadow text-lg sm:text-xl self-center'>
												Average : {selectedIssue.finalEstimation}
											</p>
										</div>
									)}
								</div>
								<div className='w-full sm:w-1/2 m-4 h-full flex flex-col justify-center items-center text-center'>
									<CircularProgress
										variant='determinate'
										className='justify-center items-center'
										sx={{
											color: "#5a67d8",
											textAlign: "center",
											backdropFilter: "blur(10px)",
										}}
										size={60}
										thickness={3}
										value={Number(agreement(selectedIssue))}
									/>
									{Number(agreement(selectedIssue)) === 100 ? (
										<p className='m-4 text-green-500 drop-shadow font-semibold'>
											Consensus Reached
											<motion.span
												role='img'
												aria-label='clap'
												className='clap-emoji font-semibold'
												initial={{ scale: 1 }}
												animate={{ scale: [1, 2, 1] }}
												transition={{
													duration: 1,
													repeat: Infinity,
													ease: "easeInOut",
												}}
											>
												👏
											</motion.span>
										</p>
									) : (
										<p className='m-4 drop-shadow font-semibold'>
											Agreement: {agreement(selectedIssue)}%
											<motion.span
												role='img'
												aria-label='clap'
												className='clap-emoji font-semibold'
												initial={{ scale: 1 }}
												animate={{ scale: [1, 2, 1] }}
												transition={{
													duration: 1,
													repeat: Infinity,
													ease: "easeInOut",
												}}
											>
												👏
											</motion.span>
										</p>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
			{!reveal && !currentUser?.isSpectator && (
				<div className='flex flex-col justify-center items-center text-center estimation-container col-span-3 justify-items-center align-middle shadow rounded h-full'>
					<div className='grid grid-cols-5 md:grid-cols-3 lg:grid-cols-3 justify-center items-center p-4'>
						{selectedEstimationType !== "Custom"
							? renderButtons(
									EstimationType._estimationTypes.find(
										(estimationType) =>
											estimationType.name === selectedEstimationType
									)?.sizes || []
							  )
							: renderButtons(estimationValues)}
					</div>
					<Grid container justifyContent={"center"}>
						<button
							type='button'
							disabled={!confirmed[selectedIssue?.id as string]}
							className='bg-indigo-600 hover:bg-indigo-700 text-white p-2 mx-2 rounded disabled:opacity-50 disabled hidden'
							onClick={() =>
								setConfirmed({ ...confirmed, [selectedIssue.id]: false })
							}
						>
							Re-Estimate
						</button>

						<button
							type='button'
							disabled={confirmed[selectedIssue?.id as string]}
							className='bg-indigo-600 hover:bg-indigo-700 text-white p-2 mx-2 rounded disabled:opacity-50'
							onClick={confirmUserEstimate}
						>
							Confirm
						</button>
					</Grid>
				</div>
			)}
		</>
	);
};

export default EstimationComponent;
