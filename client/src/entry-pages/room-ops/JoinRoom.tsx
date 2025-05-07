import { motion } from "framer-motion";
import Header from "../app/Header";
import { colors, Switch, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserType } from "../../../../models/UserType";
import type User from "../../../../models/User";
import environment from "../../config";

const JoinRoom = () => {
  const navigate = useNavigate();
  const [roomID, setRoomID] = useState("");
  const [userId, setUserId] = useState("");
  const [roomIDError, setRoomIDError] = useState("");
  const [userIdError, setUserIdError] = useState("");
  const [isJoinInProgress, setIsJoinInProgress] = useState(false);
  const [isSpectator, setIsSpectator] = useState(false);
  const handleSpectator = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSpectator(event.target.checked);
  };
  const joinRoom = async () => {
    if (roomID) {
      setIsJoinInProgress(true);
      try {
        const response = await fetch(
          `${environment.API_URL}/get-room-data/${roomID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": `${environment.API_URL}/*`,
            },
          },
        );
        if (response.ok) {
          const currentUser: User = {
            id: userId,
            type: UserType.Participant,
            isSpectator,
          };
          const response = await fetch(
            `${environment.API_URL}/add-user-to-room`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": `${environment.API_URL}/*`,
              },
              body: JSON.stringify({
                id: roomID,
                user: currentUser,
              }),
            },
          );
          if (response.ok) {
            navigate(`/${roomID}`, {
              state: {
                roomID: roomID,
                currentUser: currentUser,
              },
            });
          } else {
            console.log("Request failed with status:", response.status);
          }
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
      setIsJoinInProgress(false);
    }
  };

  const validateJoinRoom = () => {
    setRoomIDError(!roomID ? "Room ID is required" : "");
    setUserIdError(!userId ? "User ID is required" : "");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-grow flex-col lg:flex-row items-center justify-center p-4">
        {/* Left Content (Steps to Take) */}
        <div className="lg:mr-12 max-w-xs mb-6 lg:mb-0 drop-shadow">
          <h2 className="text-2xl font-bold mb-4">Steps to Take:</h2>
          <ul className="list-disc list-inside">
            <li className="mb-2">Enter the room code.</li>
            <li className="mb-2">Click on "Join Room" to proceed.</li>
            <li className="mb-2">
              You will be redirected to the room page if the room is found.
            </li>
          </ul>
        </div>
        {/* Right Content (Form) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
        >
          <h1 className="text-3xl font-bold mb-6 text-center">Join Room</h1>

          <TextField
            error={!!roomIDError}
            label="Room Code"
            fullWidth
            required
            variant="outlined"
            disabled={isJoinInProgress}
            value={roomID}
            onChange={(e) => setRoomID(e.target.value)}
            helperText={roomIDError}
          />

          <TextField
            error={!!roomIDError}
            label="User ID"
            required
            fullWidth
            margin="dense"
            disabled={isJoinInProgress}
            onChange={(e) => setUserId(e.target.value)}
            value={userId}
            helperText={userIdError}
            className="mt-4"
            variant="outlined"
          />

          <div className="flex justify-between items-center px-2 py-2 w-full sm:w-auto">
            <p>Join as spectator</p>
            <div>
              <Switch
                checked={isSpectator}
                onChange={handleSpectator}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: colors.blue[900],
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: colors.blue[900],
                  },
                }}
              />
            </div>
          </div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "tween", stiffness: 100 }}
            className="text-white bg-indigo-600 hover:bg-indigo-700 mt-6 py-2 px-4 rounded w-full shadow"
            onClick={() => {
              validateJoinRoom();
              joinRoom();
            }}
            style={{
              opacity: isJoinInProgress ? "0.7" : "1",
            }}
          >
            {isJoinInProgress ? "Joining.." : "Join room"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default JoinRoom;
