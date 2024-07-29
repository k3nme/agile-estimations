import { motion } from "framer-motion";
import Header from "../app/Header";
import {
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
} from "@mui/material";
import EstimationType from "../../../../models/EstimationType";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { updateSessionStorage } from "../../utilities/P3SessionStorage";
import { generateID } from "../../utilities/HelperMethods";

const CreateRoom = () => {
	const navigate = useNavigate();

	const [roomName, setRoomName] = useState("");
	const [selectedEstimationType, setSelectedEstimationType] =
		useState<string>("None");
	const [selectedEstimationValues, setSelectedEstimationValues] = useState<
		string[]
	>([]);
	const [customValues, setCustomValues] = useState("");
	const [selectError, setSelectError] = useState("");
	const [isCreateInProgress, setIsCreateInProgress] = useState(false);
	const [roomNameError, setRoomNameError] = useState("");
	const [customValuesError, setCustomValuesError] = useState("");

	const validateForm = () => {
		setRoomNameError(!roomName ? "Room Name is required" : "");
		setSelectError(
			selectedEstimationType === "None" ? "Please select an option" : ""
		);

		function validateString(input: string): boolean {
			return /^[a-zA-Z0-9,]+$/.test(input);
		}

		if (selectedEstimationType === "Custom") {
			if (!customValues) {
				setCustomValuesError("Custom Estimation Values are required");
				return false;
			} else if (customValues.split(",").length < 2) {
				setCustomValuesError("At least two estimation values are required");
				return false;
			} else if (!validateString(customValues)) {
				setCustomValuesError(
					"Estimation values are invalid. Only numbers / values separated by commas are allowed."
				);
				return false;
			} else {
				setCustomValuesError("");
			}
		}

		// Stop the flow if any error occurs
		if (roomNameError || selectError || customValuesError) {
			return false;
		}

		return true;
	};

	const createRoom = async () => {
		if (roomName && selectedEstimationType) {
			updateSessionStorage("userEntryType", "create");
			setIsCreateInProgress(true);
			try {
				const roomID = generateID();

				const response = await fetch("https://planning-poker-gjur.onrender.com/create-room", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "https://planning-poker-gjur.onrender.com/*",
					},
					body: JSON.stringify({
						id: roomID,
						name: roomName,
						users: [],
						issues: [],
						selectedEstimationType: selectedEstimationType,
						selectedEstimationValues:
							selectedEstimationType !== "Custom"
								? selectedEstimationValues
								: customValues.split(",").map((value) => value.trim()),
					}),
				});
				if (response.ok) {
					navigate("/" + roomID, {
						state: {
							roomID: roomID,
						},
					});
				} else {
					console.log("Request failed with status:", response.status);
				}
			} catch (error) {
				console.log("Request failed with error:", error);
			}
			setIsCreateInProgress(false);
		}
	};

	const handleEstimationTypeChange = (event: SelectChangeEvent<string>) => {
		// Clear error when the selection changes
		setSelectError("");

		setSelectedEstimationType(event.target.value as string);

		if (event.target.value !== "Custom") {
			setSelectedEstimationValues(
				EstimationType._estimationTypes.find(
					(estimationType) => estimationType.name === event.target.value
				)?.sizes || []
			);
		}
	};

	const handleEstimationValuesChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setCustomValues(event.target.value);
	};

	return (
		<div className='flex flex-col min-h-screen bg-gray-100'>
			<Header />
			<div className='flex flex-grow flex-col lg:flex-row items-center justify-center p-4'>
				{/* Left Content (Steps to Take) */}
				<div className='lg:mr-12 max-w-xs mb-6 lg:mb-0 drop-shadow'>
					<h2 className='text-2xl font-bold mb-4'>Steps to Take:</h2>
					<ul className='list-disc list-inside'>
						<li className='mb-2'>Step 1: Enter a unique Room Name.</li>
						<li className='mb-2'>Step 2: Select an Estimation Type.</li>
						<li className='mb-2'>
							Step 3: Optionally, provide Custom Estimation Values.
						</li>
						<li className='mb-2'>Step 4: Click on "Create Room" to proceed.</li>
					</ul>
				</div>
				{/* Right Content (Form) */}
				<motion.div
					initial={{ opacity: 0, x: 50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
					className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md'
				>
					<h1 className='text-3xl font-bold mb-6 text-center'>Create Room</h1>

					<TextField
						error={!!roomNameError}
						label='Room Name'
						required
						fullWidth
						margin='dense'
						disabled={isCreateInProgress}
						onChange={(e) => setRoomName(e.target.value)}
						value={roomName}
						helperText={roomNameError}
						className='mt-4'
						variant='outlined'
					/>

					<FormControl
						error={!!selectError}
						fullWidth
						disabled={isCreateInProgress}
						margin='dense'
						className='mt-6'
					>
						<InputLabel id='select-estimation-label' margin='dense'>
							Select Estimation Type
						</InputLabel>
						<Select
							labelId='select-estimation-label'
							id='select-estimation'
							value={selectedEstimationType}
							onChange={handleEstimationTypeChange}
							label='Select Estimation Type'
							margin='dense'
							required
							disabled={isCreateInProgress}
							fullWidth
							variant='outlined'
						>
							<MenuItem value={"None"} disabled>
								Select Estimation Type
							</MenuItem>
							{EstimationType._estimationTypes.map((estimationType) => (
								<MenuItem key={estimationType.id} value={estimationType.name}>
									{estimationType.display}
								</MenuItem>
							))}
						</Select>
						{selectError && <FormHelperText>{selectError}</FormHelperText>}
					</FormControl>

					{selectedEstimationType === "Custom" && (
						<TextField
							error={!!customValuesError}
							label='Custom Estimation Values (comma-separated)'
							value={customValues}
							required
							onChange={handleEstimationValuesChange}
							margin='dense'
							disabled={isCreateInProgress}
							helperText={customValuesError}
							fullWidth
							variant='outlined'
							className='mt-6'
						/>
					)}

					<motion.button
						type='button'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.9 }}
						transition={{ type: "tween", stiffness: 100 }}
						className='text-white bg-indigo-600 hover:bg-indigo-700 mt-6 py-2 px-4 rounded w-full shadow'
						onClick={() => {
							if (validateForm()) {
								createRoom();
							}
						}}
						style={{
							opacity: isCreateInProgress ? "0.7" : "1",
						}}
					>
						{isCreateInProgress? "Creating.." : "Create Room"}
					</motion.button>
				</motion.div>
			</div>
		</div>
	);
};

export default CreateRoom;
