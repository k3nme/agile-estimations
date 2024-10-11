import {
  colors,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  Stack,
  Switch,
  TextField,
} from "@mui/material";

import React, { useState } from "react";
import {
  getFromSessionStorage,
  updateSessionStorage,
} from "../../utilities/P3SessionStorage";
import { UserType } from "../../../../models/UserType";
import User from "../../../../models/User";

interface Props {
  open: boolean;
  handleClose: () => void;
  roomID: string | undefined;
}

const UserEntry = ({ open = true, roomID, handleClose }: Props) => {
  const [userName, setUserName] = useState("");
  const [isSpectator, setIsSpectator] = useState(false);

  const [userNameError, setUserNameError] = useState("");

  const handleSpectator = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSpectator(event.target.checked);
  };

  const validateUserName = () => {
    setUserNameError(!userName ? "User Name is required" : "");
  };

  const addUserToRoom = async () => {
    if (userName) {
      const userEntryType = getFromSessionStorage("userEntryType");

      try {
        const userID = generateUserID(userName);

        const currentUser: User = {
          id: userID,
          name: userName,
          type:
            userEntryType === "create"
              ? UserType.Facilitator
              : UserType.Participant,
          isSpectator,
        };

        const response = await fetch("https://planning-poker-gjur.onrender.com/add-user-to-room", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://planning-poker-gjur.onrender.com/*",
          },
          body: JSON.stringify({
            id: roomID,
            user: currentUser,
          }),
        });
        if (response.ok) {
          updateSessionStorage("user", currentUser);
          handleClose();
        } else {
          console.log("Request failed with status:", response.status);
        }
      } catch (error) {
        console.log("Request failed with error:", error);
      }
    }
  };

  function generateUserID(userName: string) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return userName + result;
  }

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={(_, reason) => {
          reason !== "backdropClick" && handleClose();
        }}
        disableEscapeKeyDown
        TransitionComponent={Fade}
        sx={{
          textAlign: "center",
          padding: "1rem",
          borderRadius: "1rem",
          margin: "1rem",
        }}
        PaperProps={{
          component: "form",
          onSubmit: (e: { preventDefault: () => void }) => {
            e.preventDefault();
            addUserToRoom();
          },
        }}
      >
        <DialogTitle textAlign={"center"}>
          <p className='flex justify-between items-center px-2 py-2 mb-2 w-full sm:w-auto'>
            Choose your display name
          </p>
        </DialogTitle>

        <DialogContent>
          <TextField
            error={!!userNameError}
            label='Your display name'
            required
            fullWidth
            margin='dense'
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            helperText={userNameError}
          />
          <div className='flex justify-between items-center px-2 py-2 w-full sm:w-auto'>
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
        </DialogContent>

        <DialogActions>
          <Stack
            direction='column'
            alignItems='center'
            sx={{ width: "100%", alignItems: "center" }}
          >
            <button
              type='button'
              className='text-white bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded w-60 shadow'
              onClick={() => {
                validateUserName();
                addUserToRoom();
              }}
            >
              Continue
            </button>
          </Stack>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default UserEntry;
