import { useEffect, useState, useRef } from "react";
import User from ".../../../../models/User";
import UserCard from "./UserCard";
import "../sass/WoodenTable.sass";
import Issue from "../../../models/Issue";

interface Props {
	roomID: string;
	selectedEstimationType: string;
	users: User[];
	currentUser: User | null;
	reveal: boolean;
	selectedIssue: Issue;
}

interface Position {
	index: number;
	left: string;
	top: string;
}

const UserPolygon = ({
	users,
	roomID,
	selectedEstimationType,
	currentUser,
	reveal,
	selectedIssue,
}: Props) => {
	const [center, setCenter] = useState({ x: 0, y: 0 });
	const [radius, setRadius] = useState(0);
	const [innerRadius, setInnerRadius] = useState(0);
	const polygonDivRef = useRef<HTMLDivElement>(null);
	const [userPositions, setUserPositions] = useState<Position[]>([]);

	useEffect(() => {
		const handleResize = () => {
			if (polygonDivRef.current) {
				const { width, height } = polygonDivRef.current.getBoundingClientRect();
				const centerX = width / 2;
				const centerY = height / 2;
				const minDimension = Math.min(width, height);
				const calculatedRadius = minDimension / 2 - 60; // Outer circle radius
				const calculatedInnerRadius = calculatedRadius * 0.8; // Inner circle radius as 80% of outer

				setCenter({ x: centerX, y: centerY });
				setRadius(calculatedRadius);
				setInnerRadius(calculatedInnerRadius);

				// Update user positions array
				setUserPositions(
					users.map((_, index) => {
						const angle = (index / users.length) * 2 * Math.PI; // Angle in radians
						const x = centerX + calculatedRadius * Math.cos(angle); // x position in pixels
						const y = centerY + calculatedRadius * Math.sin(angle); // y position in pixels
						const xPercent = (x / width) * 100; // x position in percentage
						const yPercent = (y / height) * 100; // y position in percentage

						return {
							index: index,
							left: `${xPercent}%`,
							top: `${yPercent}%`,
						};
					})
				);
			}
		};

		handleResize(); // Initial call
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, [users]); // Dependency array should only include 'users' to trigger on user change

	// Function to check if a user has provided an estimation for the selected issue
	const isUserEstimationPresent = (user: User, issue: Issue): boolean => {
		return (
			issue.estimations &&
			Object.values(issue.estimations).some((userIds) =>
				userIds.includes(user.id)
			)
		);
	};

	// Function to get a user's estimation from the issue
	const userEstimation = (user: User, issue: Issue): string | undefined => {
		if (!issue.estimations) {
			return undefined;
		}

		for (const [estimation, userIds] of Object.entries(issue.estimations)) {
			if (userIds.includes(user.id)) {
				return estimation;
			}
		}
		return undefined;
	};

	// Method to request revealing of votes
	const askForReveal = async () => {
		try {
			const response = await fetch("https://agile-estimate-fastify.vercel.app/update-final-estimation", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "https://agile-estimate-fastify.vercel.app/*",
				},
				body: JSON.stringify({
					roomID: roomID,
					selectedEstimationType: selectedEstimationType,
					issueID: selectedIssue.id,
				}),
			});
			if (response.ok) {
				console.log("Users' estimations revealed successfully");
			} else {
				console.log("Request failed with status:", response.status);
			}
		} catch (error) {
			console.error("Request failed with error:", error);
		}
	};

	return (
		<div
			className='polygon-div col-span-6 shadow flex rounded relative w-full h-full'
			ref={polygonDivRef}
		>
			<svg
				className='svg-container top-0 left-0 w-full h-full'
				viewBox={`0 0 ${center.x * 2} ${center.y * 2}`}
				preserveAspectRatio='xMidYMid meet'
			>
				<defs>
					<linearGradient id='woodGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
						<stop offset='0%' stopColor='#5a67d8' />
						<stop offset='100%' stopColor='#4c51bf' />
					</linearGradient>
					<pattern
						id='woodenTablePattern'
						patternUnits='userSpaceOnUse'
						width='3'
						height='3'
					>
						<rect width='30' height='30' fill='url(#woodGradient)' />
					</pattern>
				</defs>
				{/* Draw the outer circle */}
				<circle
					className='circle shadow-orange-950'
					cx={center.x}
					cy={center.y}
					r={radius}
					fill='transparent'
					stroke='transparent'
				/>
				{/* Draw the inner circle */}
				<circle
					className='circle shadow-orange-950'
					cx={center.x}
					cy={center.y}
					r={innerRadius}
					fill='url(#woodenTablePattern)'
					stroke='black'
				></circle>

				<text
					x={center.x}
					y={center.y - 50}
					textAnchor='middle'
					fontSize='24'
					fontWeight='bold'
					fill='#fff'
					className='text-2xl p-2 truncate drop-shadow'
				>
					{selectedIssue && selectedIssue.title ? selectedIssue.title : "Title"}
				</text>

				<text
					x={center.x}
					y={center.y - 10}
					textAnchor='middle'
					fontSize='18'
					fill='#fff'
					className='text-lg truncate drop-shadow'
				>
					{selectedIssue && selectedIssue.description ? (
						<tspan>{selectedIssue.description}</tspan>
					) : (
						"Description"
					)}
				</text>

				{/* Button to reveal votes */}
				{!reveal ? (
					currentUser?.type === "Facilitator" && (
						<foreignObject
							className='text-center'
							x={center.x - 50}
							y={center.y + 20}
							width='100'
							height='60'
						>
							<button
								title='Reveal Votes'
								type='button'
								className='reveal-button bg-white p-2 rounded text-blue-800 font-bold w-full h-full shadow-lg'
								onClick={askForReveal}
							>
								Reveal
							</button>
						</foreignObject>
					)
				) : (
					// Display final estimation
					<foreignObject
						x={center.x - 75}
						y={center.y + 20}
						className='text-center'
						width='160'
						height='60'
					>
						<div className='final-result bg-white p-4 rounded shadow-lg w-full h-full'>
							<p className='font-bold'>
								Estimation - {selectedIssue?.finalEstimation}
							</p>
							{/* Add additional final estimation details here */}
						</div>
					</foreignObject>
				)}
			</svg>

			{/* Display user cards around the circle */}

			{userPositions.map(({ index, left, top }) => (
				<div
					key={index}
					className='text-center absolute z-10'
					style={{
						left: left,
						top: top,
						transform: "translate(-50%, -50%)",
					}}
				>
					<UserCard
						user={users[index]}
						reveal={reveal}
						isCurrentUser={currentUser?.id === users[index].id}
						isInPolygon={true}
						selectedIssue={selectedIssue}
						isEstimationPresent={isUserEstimationPresent(
							users[index],
							selectedIssue
						)}
						estimation={userEstimation(users[index], selectedIssue)}
					/>
				</div>
			))}
		</div>
	);
};

export default UserPolygon;
