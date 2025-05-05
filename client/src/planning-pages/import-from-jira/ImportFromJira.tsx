import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  Stack,
  TextField,
} from "@mui/material";

import React, { useState } from "react";

import environment from "../../config/";

interface Props {
  open: boolean;
  handleClose: () => void;
  roomID: string | undefined;
}

const AddIssuesFromJira = ({ open = true, roomID, handleClose }: Props) => {
  const [issues, setIssues] = useState("");

  const [issuesError, setIssuesError] = useState("");

  function validateString(input: string): boolean {
    return /^[a-zA-Z-0-9,]+$/.test(input);
  }

  const validateImportIssues = () => {
    setIssuesError(!issues ? "Issues are required" : "");

    if (issues.split(",").length > 10) {
      setIssuesError("Maximum 10 issues are allowed");
    } else if (!validateString(issues)) {
      setIssuesError(
        "Issues are invalid. Only numbers / values separated by commas are allowed.",
      );
    }
  };

  const fetchIssuesFromJira = async () => {
    if (issues && !issuesError) {
      try {
        const response = await fetch(
          `${environment.API_URL}/fetch-issues-from-jira`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": `${environment.API_URL}/*`,
            },
            body: JSON.stringify({
              issues,
              roomID,
            }),
          },
        );
        if (response.ok) {
          handleClose();
        } else {
          console.log("Request failed with status:", response.status);
        }
      } catch (error) {
        console.log("Request failed with error:", error);
      }
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
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
            fetchIssuesFromJira();
          },
        }}
      >
        <DialogTitle textAlign={"center"}>
          <p className="flex justify-between items-center px-2 py-2 mb-2 w-full sm:w-auto">
            Issues to import from Jira
          </p>
        </DialogTitle>

        <DialogContent>
          <TextField
            error={!!issuesError}
            label="Issues (comma separated)"
            required
            fullWidth
            multiline
            margin="dense"
            onChange={(e) => setIssues(e.target.value)}
            value={issues}
            helperText={issuesError}
          />
        </DialogContent>

        <DialogActions>
          <Stack
            direction="column"
            alignItems="center"
            sx={{ width: "100%", alignItems: "center" }}
          >
            <button
              type="button"
              className="text-white bg-blue-800  py-2 px-4 m-2 rounded sm:w-auto border border-gray-500 shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              onClick={() => {
                validateImportIssues();
              }}
            >
              Import
            </button>
          </Stack>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AddIssuesFromJira;
