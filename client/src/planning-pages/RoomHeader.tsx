import React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import { Link } from "react-router-dom";
import type User from "../../../models/User";
import {
  ExitToApp,
  ExitToAppTwoTone,
  Person,
  SupervisorAccount,
} from "@mui/icons-material";
import UserType from "../../../models/UserType";
import type Issue from "../../../models/Issue";

import { motion } from "framer-motion";
import Logo from "../logo/Logo";

import environment from "../config";

interface Props {
  roomID: string;
  roomTitle: string;
  currentUser: User | undefined;
  users: User[];
  issues: Issue[];
  onIssueListClick: () => void;
}

const RoomHeader = ({
  roomID,
  roomTitle,
  currentUser,
  users,
  issues,
  onIssueListClick,
}: Props) => {
  const [open, setOpen] = React.useState(false);
  const [showUserInformationDialog, setShowUserInformationDialog] =
    React.useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const isUserMenuOpen = Boolean(userAnchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserAnchorEl(null);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setUserAnchorEl(event.currentTarget);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleExitRoom = (currentUser: User | undefined) => {
    deleteUserFromRoom(currentUser);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUserInformationDialogClose = () => {
    setShowUserInformationDialog(false);
  };

  const handleUserInformationDialogOpen = () => {
    setShowUserInformationDialog(true);
  };

  const deleteUserFromRoom = async (user: User | undefined) => {
    try {
      const response = await fetch(
        `${environment.API_URL}/remove-user-from-room`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": `${environment.API_URL}/*`,
          },
          body: JSON.stringify({
            roomID,
            user: user ? user : currentUser,
          }),
        },
      );
      if (response.ok) {
        // Not doing anything with the response. The user will be removed from the room and the page will be reloaded.
      } else {
        console.log("Request failed with status:", response.status);
      }
    } catch (error) {
      console.log("Request failed with error:", error);
    }
  };

  const copyCode = () => {
    const roomLink = document.getElementById("roomLink")?.getAttribute("value");
    if (roomLink) {
      const roomCode = roomLink.split("/").pop();

      if (!roomCode) {
        console.error("Room Code was not present");
        return;
      }

      if (navigator?.clipboard) {
        navigator.clipboard.writeText(roomCode);
      } else {
        // Fallback for older browsers or non-secure context
        const textArea = document.createElement("textarea");
        textArea.value = roomCode;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
        } catch (err) {
          console.error("Fallback: Could not copy text: ", err);
        }
        document.body.removeChild(textArea);
      }
    }
    setOpen(false);
  };

  return (
    <div className="logo flex flex-row w-full h-20 justify-center">
      <div className="absolute top-0 left-0 w-20 md:w-28 md:h-18 m-4">
        <Link to="#">
          <Logo />
        </Link>
      </div>

      {roomTitle && (
        <div className="text-indigo-700 underline underline-offset-4 text-xl absolute text-center w-40 h-18 m-4 font-bold justify-center items-center">
          {roomTitle}
        </div>
      )}

      <div className="">
        <div className="absolute top-0 right-5 flex m-2">
          <div className="md:hidden text-indigo-600 hover:text-indigo-700 drop-shadow">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <title>Icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                />
              </svg>
            </IconButton>
          </div>

          <div className="hidden md:flex flex-row justify-between gap-6 py-3">
            <motion.span
              whileHover={{
                borderBottom: "1px solid #4f46e5",
              }}
              className="relative cursor-pointer text-white hover:text-white bg-indigo-700 px-4 py-1 rounded drop-shadow font-medium "
              onClick={handleClickOpen}
            >
              Invite
            </motion.span>

            <motion.span
              whileHover={{
                borderBottom: "1px solid #4f46e5",
              }}
              className="relative cursor-pointer text-white hover:text-white bg-indigo-700 px-4 py-1 rounded
 font-medium drop-shadow"
              onClick={handleUserInformationDialogOpen}
            >
              Members({users.length})
            </motion.span>

            <motion.span
              whileHover={{
                borderBottom: "1px solid #4f46e5",
              }}
              className="relative cursor-pointer text-white hover:text-white bg-indigo-700 px-4 py-1 rounded
 font-medium drop-shadow"
              onClick={onIssueListClick}
            >
              Issues({issues.length})
            </motion.span>

            {currentUser && (
              <>
                <motion.span
                  whileHover={{
                    borderBottom: "1px solid #4f46e5",
                  }}
                  className="relative cursor-pointer text-white hover:text-white bg-indigo-700 px-4 py-1 rounded
     font-medium drop-shadow"
                  onClick={handleUserMenuOpen}
                >
                  {currentUser.type === UserType.Facilitator.toString() ? (
                    <SupervisorAccount />
                  ) : (
                    <Person />
                  )}
                  {currentUser.id}
                </motion.span>
                <Menu
                  anchorEl={userAnchorEl}
                  open={isUserMenuOpen}
                  onClose={handleUserMenuClose}
                >
                  <MenuItem onClick={handleUserMenuClose}>
                    <motion.button
                      type="button"
                      whileHover={{ fontWeight: "bold" }}
                      className="self-center text-indigo-600 hover:text-indigo-700 font-medium  rounded "
                      onClick={() => {
                        handleExitRoom(currentUser);
                      }}
                    >
                      <ExitToAppTwoTone /> Exit
                    </motion.button>
                  </MenuItem>
                </Menu>
              </>
            )}
          </div>
        </div>

        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          slotProps={{
            paper: {
              sx: {
                width: "150px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              },
            },
          }}
          MenuListProps={{
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            },
          }}
        >
          <MenuItem
            onClick={() => {
              handleMenuClose();
              handleUserInformationDialogOpen();
            }}
          >
            <p className="text-indigo-600 hover:text-indigo-700 drop-shadow">
              Members({users.length})
            </p>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onIssueListClick();
            }}
          >
            <p className="text-indigo-600 hover:text-indigo-700 drop-shadow">
              Issues({issues.length})
            </p>
          </MenuItem>
          {currentUser && (
            <MenuItem onClick={handleMenuClose}>
              {currentUser.type === UserType.Facilitator.toString() ? (
                <SupervisorAccount className="text-indigo-600 hover:text-indigo-700 drop-shadow" />
              ) : (
                <Person className="text-indigo-600 hover:text-indigo-700 drop-shadow" />
              )}
              <p className="text-indigo-600 hover:text-indigo-700 drop-shadow">
                {currentUser.id}
              </p>
            </MenuItem>
          )}
          <MenuItem
            onClick={() => {
              handleMenuClose();
              handleClickOpen();
            }}
          >
            <p className="text-indigo-600 hover:text-indigo-700 drop-shadow">
              Invite
            </p>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              handleExitRoom(currentUser);
            }}
          >
            <ExitToApp className="text-indigo-600 hover:text-indigo-700 drop-shadow" />
            <p className="text-indigo-600 hover:text-indigo-700 drop-shadow">
              Exit
            </p>
          </MenuItem>
        </Menu>
      </div>

      <React.Fragment>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle textAlign={"center"}>{"Invite Members"}</DialogTitle>
          <DialogContent>
            <div className="flex flex-col justify-center rounded-md px-4 mt-4 py-2">
              <p className="mb-4">Copy code to invite members into this room</p>
              <TextField
                label="Room Code"
                id="roomCode"
                fullWidth
                margin="dense"
                required
                disabled
                variant="outlined"
                value={window.location.href.split("/").pop()}
              />
            </div>
          </DialogContent>

          <DialogActions>
            <Stack
              direction="column"
              alignItems="center"
              sx={{ width: "100%", alignItems: "center" }}
            >

              <button
                title="Copy Code"
                type="button"
                className="w-60 bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-2 m-2 rounded"
                onClick={copyCode}
              >
                Copy Code
              </button>
            </Stack>
          </DialogActions>
        </Dialog>
      </React.Fragment>

      <React.Fragment>
        <Dialog
          open={showUserInformationDialog}
          onClose={handleUserInformationDialogClose}
        >
          <DialogTitle textAlign={"center"}>{"Members"}</DialogTitle>
          <DialogContent>
            <div className="flex justify-center rounded-md px-4 py-2 text-center">
              <div className="grid grid-cols-4 gap-4">
                <div className="font-bold">Name</div>
                <div className="font-bold">Type</div>
                <div className="font-bold">Spectator?</div>
                <div className="font-bold" />
                {users.map((user) => (
                  <React.Fragment key={user.id}>
                    <div>{user.id}</div>
                    <div>{user.type}</div>
                    <div>{user.isSpectator ? "Yes" : "No"}</div>
                    <div>
                      {currentUser?.type === UserType.Facilitator.toString() &&
                        user !== currentUser && (
                          <button type="button"
                            onClick={() => {
                              handleMenuClose();
                              handleExitRoom(user);
                            }}
                            onKeyDown={() => {
                              handleMenuClose();
                              handleExitRoom(user);
                            }}
                          >
                            <ExitToApp className="text-indigo-600 hover:text-indigo-700 drop-shadow" />
                          </button>
                        )}
                    </div>

                  </React.Fragment>
                ))}
              </div>
            </div>
          </DialogContent>

          <DialogActions>
            <Stack
              direction="column"
              alignItems="center"
              sx={{ width: "100%", alignItems: "center" }}
            >
              <button
                title="Copy Link"
                type="button"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-2 rounded w-60"
                onClick={handleUserInformationDialogClose}
              >
                Close
              </button>
            </Stack>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </div>
  );
};

export default RoomHeader;
