import { motion } from "framer-motion";
import Header from "../app/Header";
import { TextField } from "@mui/material";
import { useState } from "react";
import { Download } from "@mui/icons-material";
import Issue from "../../../../models/Issue";

const RoomHistory = () => {
	const [roomID, setRoomID] = useState("");
	const [roomIDError, setRoomIDError] = useState("");

	const getHistory = async () => {
		if (roomID) {
			try {
				const response = await fetch("https://planning-poker-gjur.onrender.com/get-room-data/" + roomID, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "https://planning-poker-gjur.onrender.com/*",
					},
				});
				if (response.ok) {
					const data = await response.json();

					// Extracting issues and converting them to CSV format
					const issues = data.issues || [];
					const csvHeaders = ["Title", "Description", "Final Estimation"];
					const csvRows = issues.map((issue: Issue) => [
						issue.title,
						issue.description,
						issue.finalEstimation,
					]);

					// Creating a CSV string
					let csvContent = csvHeaders.join(",") + "\n";
					csvContent += csvRows
						.map((row: unknown[]) => row.join(","))
						.join("\n");

					// Creating a Blob from the CSV string
					const blob = new Blob([csvContent], { type: "text/csv" });
					const url = URL.createObjectURL(blob);

					// Creating a download link and clicking it to download the CSV
					const link = document.createElement("a");
					link.href = url;
					link.download = `${data.name}.csv`;
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
					URL.revokeObjectURL(url);
				} else {
					if (response.status === 404) {
						setRoomIDError("Room not found");
					} else {
						console.log("Request failed with status:", response.status);
					}
				}
			} catch (error) {
				console.log("Request failed with error:", error);
			}
		}
	};

	const validateHistory = () => {
		setRoomIDError(!roomID ? "Room ID is required" : "");
	};

	return (
		<div className='flex flex-col min-h-screen bg-gray-100'>
			<Header />
			<div className='flex flex-grow flex-col lg:flex-row items-center justify-center p-4'>
				{/* Left Content (Steps to Take) */}
				<div className='lg:mr-12 max-w-xs mb-6 lg:mb-0 drop-shadow'>
					<h2 className='text-2xl font-bold mb-4'>Steps to Take:</h2>
					<ul className='list-disc list-inside'>
						<li className='mb-2'>Step 1: Enter the room ID.</li>
						<li className='mb-2'>Step 2: Click on "Export" to proceed.</li>
						<li className='mb-2'>
							Step 3: A CSV file will be downloaded with the issues in the room
						</li>
						<li className='mb-2'>
							Note : The history will be available only for sessions completed less than 3 days ago. 
						</li>
					</ul>
				</div>
				{/* Right Content (Form) */}
				<motion.div
					initial={{ opacity: 0, x: 50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
					className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md'
				>
					<h1 className='text-3xl font-bold mb-6 text-center'>History</h1>

					<TextField
						error={!!roomIDError}
						label='Room ID'
						fullWidth
						required
						variant='outlined'
						value={roomID}
						onChange={(e) => setRoomID(e.target.value)}
						helperText={roomIDError}
					/>

					<motion.button
						type='button'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.9 }}
						transition={{ type: "tween", stiffness: 100 }}
						className='flex items-center justify-center text-white bg-indigo-600 hover:bg-indigo-700 mt-6 py-2 px-4 rounded w-full shadow'
						onClick={() => {
							validateHistory();
							getHistory();
						}}
					>
						<Download className='mr-2' />
						<p>Export</p>
					</motion.button>
				</motion.div>
			</div>
		</div>
	);
};

export default RoomHistory;
