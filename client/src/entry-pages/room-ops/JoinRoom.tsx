import { motion } from "framer-motion";
import Header from "../app/Header";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const JoinRoom = () => {
	const navigate = useNavigate();
	const [roomID, setRoomID] = useState("");
	const [roomIDError, setRoomIDError] = useState("");

	const joinRoom = async () => {
		if (roomID) {
			try {
				const response = await fetch("https://agile-estimate-fastify.vercel.app/get-room-data/" + roomID, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "https://agile-estimate-fastify.vercel.app/*",
					},
				});
				if (response.ok) {
					navigate("/" + roomID, {
						state: {
							roomID: roomID,
						},
					});
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

	const validateJoinRoom = () => {
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
						<li className='mb-2'>Step 2: Click on "Join Room" to proceed.</li>
						<li className='mb-2'>
							Step 3: You will be redirected to the room page if the room is
							found.
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
					<h1 className='text-3xl font-bold mb-6 text-center'>Join Room</h1>

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
						className='text-white bg-indigo-600 hover:bg-indigo-700 mt-6 py-2 px-4 rounded w-full shadow'
						onClick={() => {
							validateJoinRoom();
							joinRoom();
						}}
					>
						Join Room
					</motion.button>
				</motion.div>
			</div>
		</div>
	);
};

export default JoinRoom;
