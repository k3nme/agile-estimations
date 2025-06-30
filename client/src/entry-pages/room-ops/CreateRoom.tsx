import { motion } from "framer-motion";
import Header from "../app/Header";
import * as material from "@mui/material";
import EstimationType from "../../../../models/EstimationType";
import ActivityType from "../../../../models/ActivityType";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { generateID } from "../../utilities/HelperMethods";
import UserType from "../../../../models/UserType";
import type User from "../../../../models/User";
import environment from "../../config";

const CreateRoom = () => {
  const navigate = useNavigate();

  const [roomName, setRoomName] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<string>(
    ActivityType.ActivityType.ESTIMATION.name,
  );
  const [selectedEstimationType, setSelectedEstimationType] = useState<string>(
    EstimationType.EstimationType.Scrum.name,
  );
  const [selectedEstimationValues, setSelectedEstimationValues] = useState<
    string[]
  >([]);
  const [customValues, setCustomValues] = useState("");
  const [selectError, setSelectError] = useState("");
  const [isCreateInProgress, setIsCreateInProgress] = useState(false);
  const [roomNameError, setRoomNameError] = useState("");
  const [userIdError, setUserIdError] = useState("");
  const [customValuesError, setCustomValuesError] = useState("");
  const [isSpectator, setIsSpectator] = useState(false);
  const handleSpectator = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSpectator(event.target.checked);
  };

  const validateForm = () => {
    setRoomNameError(!roomName ? "Room Name is required" : "");
    setUserIdError(!userId ? "User Id is required" : "");

    function validateString(input: string): boolean {
      return /^[a-zA-Z0-9,]+$/.test(input);
    }

    if (selectedEstimationType === "Custom") {
      if (!customValues) {
        setCustomValuesError("Custom Estimation Values are required");
        return false;
      }

      if (customValues.split(",").length < 2) {
        setCustomValuesError("At least two estimation values are required");
        return false;
      }

      if (!validateString(customValues)) {
        setCustomValuesError(
          "Estimation values are invalid. Only numbers / values separated by commas are allowed.",
        );
        return false;
      }
    }

    // Stop the flow if any error occurs
    if (roomNameError || selectError || customValuesError) {
      return false;
    }

    return true;
  };

  const createRoom = async () => {
    if (roomName && selectedEstimationType && userId) {
      setIsCreateInProgress(true);
      const currentUser: User = {
        id: userId,
        type: UserType.Facilitator,
        isSpectator,
      };
      try {
        const roomID = generateID();

        const response = await fetch(`${environment.API_URL}/create-room`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": `${environment.API_URL}/*`,
          },
          body: JSON.stringify({
            id: roomID,
            name: roomName,
            users: [currentUser],
            issues: [],
            selectedEstimationType: selectedEstimationType,
            selectedActivity: selectedActivity,
            selectedEstimationValues:
              selectedEstimationType !== "Custom"
                ? selectedEstimationValues
                : customValues.split(",").map((value) => value.trim()),
          }),
        });
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
      } catch (error) {
        console.log("Request failed with error:", error);
      }
      setIsCreateInProgress(false);
    }
  };

  const handleSelectedActivityChange = (
    event: material.SelectChangeEvent<string>,
  ) => {
    // Clear error when the selection changes
    setSelectError("");

    setSelectedActivity(event.target.value as string);
  };

  const handleEstimationTypeChange = (
    event: material.SelectChangeEvent<string>,
  ) => {
    // Clear error when the selection changes
    setSelectError("");

    setSelectedEstimationType(event.target.value as string);

    if (event.target.value !== "Custom") {
      setSelectedEstimationValues(
        EstimationType._estimationTypes.find(
          (estimationType) => estimationType.name === event.target.value,
        )?.sizes || [],
      );
    }
  };

  const handleEstimationValuesChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCustomValues(event.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-grow flex-col lg:flex-row items-center justify-center p-4">
        {/* Left Content (Steps to Take) */}
        <div className="lg:mr-12 max-w-xs mb-6 lg:mb-0 drop-shadow">
          <h2 className="text-2xl font-bold mb-4">Steps to Take:</h2>
          <ul className="list-disc list-inside">
            <li className="mb-2">Enter a unique Room Name.</li>
            <li className="mb-2">Enter a unique User Id.</li>
            <li className="mb-2">Select the activity inside the room.</li>
            <li className="mb-2">
              If the selected activity is estimation, select the estimation
              type.
            </li>
            <li className="mb-2">Click on "Create Room" to proceed.</li>
          </ul>
        </div>
        {/* Right Content (Form) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
        >
          <h1 className="text-3xl font-bold mb-6 text-center">Create Room</h1>

          <material.TextField
            error={!!roomNameError}
            label="Room Name"
            required
            fullWidth
            margin="dense"
            disabled={isCreateInProgress}
            onChange={(e) => setRoomName(e.target.value)}
            value={roomName}
            helperText={roomNameError}
            className="mt-4"
            variant="outlined"
          />

          <material.TextField
            error={!!roomNameError}
            label="User ID"
            required
            fullWidth
            margin="dense"
            disabled={isCreateInProgress}
            onChange={(e) => setUserId(e.target.value)}
            value={userId}
            helperText={userIdError}
            className="mt-4"
            variant="outlined"
          />

          <material.FormControl
            error={!!selectError}
            fullWidth
            disabled={isCreateInProgress}
            margin="dense"
            className="mt-6"
          >
            <material.InputLabel id="select-activity-label" margin="dense">
              Select Activity
            </material.InputLabel>
            <material.Select
              labelId="select-activity-label"
              id="select-activity"
              value={selectedActivity}
              onChange={handleSelectedActivityChange}
              label="Select Activity"
              margin="dense"
              required
              disabled={isCreateInProgress}
              fullWidth
              variant="outlined"
            >
              {ActivityType._activityTypes.map((activityType) => (
                <material.MenuItem
                  key={activityType.id}
                  value={activityType.name}
                  disabled={activityType.disabled}
                >
                  {activityType.name}
                </material.MenuItem>
              ))}
            </material.Select>
            {selectError && (
              <material.FormHelperText>{selectError}</material.FormHelperText>
            )}
          </material.FormControl>

          {
            /* Only show this select if the selected activity is estimation */
            selectedActivity === "Estimation" && (
              <material.FormControl
                error={!!selectError}
                fullWidth
                disabled={isCreateInProgress}
                margin="dense"
                className="mt-6"
              >
                <material.InputLabel
                  id="select-estimation-label"
                  margin="dense"
                >
                  Select Estimation Type
                </material.InputLabel>
                <material.Select
                  labelId="select-estimation-label"
                  id="select-estimation"
                  value={selectedEstimationType}
                  onChange={handleEstimationTypeChange}
                  label="Select Estimation Type"
                  margin="dense"
                  required
                  disabled={isCreateInProgress}
                  fullWidth
                  variant="outlined"
                >
                  {EstimationType._estimationTypes.map((estimationType) => (
                    <material.MenuItem
                      key={estimationType.id}
                      value={estimationType.name}
                    >
                      {estimationType.display}
                    </material.MenuItem>
                  ))}
                </material.Select>
                {selectError && (
                  <material.FormHelperText>
                    {selectError}
                  </material.FormHelperText>
                )}
              </material.FormControl>
            )
          }

          {selectedEstimationType === "Custom" && (
            <material.TextField
              error={!!customValuesError}
              label="Custom Estimation Values (comma-separated)"
              value={customValues}
              required
              onChange={handleEstimationValuesChange}
              margin="dense"
              disabled={isCreateInProgress}
              helperText={customValuesError}
              fullWidth
              variant="outlined"
              className="mt-6"
            />
          )}
          {
            /* Only show this select if the selected activity is estimation */
            selectedActivity === "Estimation" && (
              <div className="flex justify-between items-center px-2 py-2 w-full sm:w-auto">
                <p>Join as spectator</p>
                <div>
                  <material.Switch
                    checked={isSpectator}
                    onChange={handleSpectator}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: material.colors.blue[900],
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          backgroundColor: material.colors.blue[900],
                        },
                    }}
                  />
                </div>
              </div>
            )
          }
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "tween", stiffness: 100 }}
            className="text-white bg-indigo-600 hover:bg-indigo-700 mt-6 py-2 px-4 rounded w-full shadow"
            onClick={() => {
              if (validateForm()) {
                createRoom();
              }
            }}
            style={{
              opacity: isCreateInProgress ? "0.7" : "1",
            }}
          >
            {isCreateInProgress ? "Creating.." : "Create Room"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateRoom;
