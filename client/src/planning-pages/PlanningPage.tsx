import { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PlanningPoker from "./planning-poker-div/PlanningPokerComponent";
import type Issue from "../../../models/Issue";
import type User from "../../../models/User";
import { useParams } from "react-router-dom";
import RoomHeader from "./RoomHeader";
import IssuesComponent from "./issue-list/IssuesComponent";
import { IssueStatus } from "../../../models/IssueStatus";
import { useNavigate } from "react-router-dom";
import environment from "../config";

interface RevealedState {
  [key: string]: boolean;
}

const App = () => {
  const { roomID } = useParams();
  const location = useLocation();
  const currentUser = location.state?.currentUser;
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [selectedEstimationType, setSelectedEstimationType] =
    useState<string>("");
  const [estimationValues, setEstimationValues] = useState<string[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [users, setUsers] = useState<User[]>(currentUser ? [currentUser] : []);
  const roomSocket = useRef<WebSocket | undefined>();

  const [showIssueList, setShowIssueList] = useState(window.innerWidth > 768);

  const handleIssueListClick = () => {
    setShowIssueList((showIssueList) => !showIssueList);
  };

  const establishWebSocketConnection = (
    roomID: string,
  ): WebSocket | undefined => {
    if (
      !roomSocket.current ||
      roomSocket.current.readyState !== WebSocket.OPEN
    ) {
      const socket = new WebSocket(
        `${environment.WSS_URL}/connect-to-room/${roomID}`,
      );

      socket.onopen = () => {
        console.log("Connected to room");
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.action === "room-connected") {
          setRoomName(data.name);
          setSelectedEstimationType(data.selectedEstimationType);
          setEstimationValues(data.estimationValues);
          setUsers((prevUsers) => {
            const existingUserIds = new Set(prevUsers.map((user) => user.id));

            //filter the users
            const newUsers = data.users.filter(
              (user: User) => !existingUserIds.has(user.id),
            );

            return [...prevUsers, ...newUsers];
          });
          setIssues((prevIssues) => [...prevIssues, ...data.issues]);
        } else if (data.action === "user-joined") {
          const newUser: User = data.user;
          setUsers((prevUsers) => {
            const isUserPresent = prevUsers.some(
              (user) => user.id === newUser.id,
            );
            // if user is not present, then add to the array
            if (!isUserPresent) {
              return [...prevUsers, newUser];
            }
            return prevUsers;
          }); // Add the new user to existing users
        } else if (data.action === "user-left") {
          const currentUserInBrowser = currentUser;
          console.log(
            `the data is :
              ${data.user.id}
              , current is :
              ${currentUserInBrowser?.id}`,
          );
          if (data.user.id === currentUserInBrowser?.id) {
            navigate("/");
          }
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== data.user.id),
          );
        } else if (data.action === "issue-added") {
          const newIssue: Issue = {
            id: data.id,
            title: data.title,
            description: data.description,
            finalEstimation: "",
            issueStatus: data.issueStatus,
            estimations: {},
          };
          setIssues((prevIssues) => [...prevIssues, newIssue]); // Add the new issue to existing issues
        } else if (data.action === "issue-deleted") {
          setIssues((prevIssues) =>
            prevIssues.filter((issue) => issue.id !== data.id),
          );
          setSelectedIssue(
            selectedIssue?.id === data.id ? null : selectedIssue,
          );
        } else if (data.action === "final-estimation-updated") {
          if (
            selectedEstimationType === "T-Shirt Sizes" ||
            selectedEstimationType === "Custom"
          ) {
            setIssues((prevIssues) => {
              return prevIssues.map((issue) => {
                if (issue.id === data.issueID) {
                  issue.finalEstimation = data.final_estimation;
                  issue.issueStatus = data.issueStatus;
                }
                return issue;
              });
            });
          } else {
            setIssues((prevIssues) => {
              return prevIssues.map((issue) => {
                if (issue.id === data.issueID) {
                  issue.finalEstimation = data.final_estimation;
                  issue.issueStatus = data.issueStatus;
                }
                return issue;
              });
            });
          }

          setRevealed((prevRevealed) => {
            prevRevealed[data.issueID] = true;
            return prevRevealed;
          });
        } else if (data.action === "user-estimated-issue") {
          console.log("User estimated issue:", data);
          console.log("Issues after confirming estimated:", issues);

          setIssues((prevIssues) => {
            return prevIssues.map((issue) => {
              console.log(
                "Issue ID:",
                `${issue.id} Data Issue ID:`,
                data.issueID,
              );
              if (issue.id === data.issueID) {
                const estimation = data.estimation as string;

                if (!issue.estimations[estimation]) {
                  issue.estimations[estimation] = [];
                }

                if (!issue.estimations[estimation].includes(data.userID)) {
                  issue.estimations[estimation].push(data.userID);
                }
              }
              return issue;
            });
          });
        }

        console.log("Received data from server:", data);
      };

      socket.onclose = () => {
        console.log("Disconnected from WebSocket server");
      };

      return socket;
    }
  };

  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const [revealed, setRevealed] = useState<RevealedState>(
    issues.reduce((acc, issue) => {
      acc[issue.id] = issue.issueStatus === IssueStatus.Estimated;
      return acc;
    }, {} as RevealedState),
  );

  const handleIssueSelection = (issue: Issue) => {
    setSelectedIssue(issue);
    setShowIssueList(false);
  };

  useEffect(() => {
    if (roomID && !roomSocket.current) {
      roomSocket.current = establishWebSocketConnection(roomID);
    }
  });

  return (
    <div className="flex h-screen">
      <div className="flex flex-col bg-slate-100 flex-grow">
        <RoomHeader
          roomID={roomID as string}
          roomTitle={roomName}
          currentUser={currentUser}
          users={users}
          issues={issues}
          onIssueListClick={handleIssueListClick}
        />
        <div className="flex flex-grow">
          <div className="flex-1 lg:flex-1 lg:min-h-0">
            <div className="h-full flex">
              <div className="planning-poker-container flex flex-col flex-grow h-full">
                <PlanningPoker
                  roomID={roomID as string}
                  currentUser={currentUser}
                  users={users}
                  issues={issues}
                  selectedIssue={selectedIssue}
                  selectedEstimationType={selectedEstimationType}
                  estimationValues={estimationValues}
                  reveal={revealed[selectedIssue?.id as string]}
                />
              </div>
            </div>
          </div>
          {showIssueList && (
            <div className="fixed inset-0 z-10 md:relative md:w-1/4 md:z-auto">
              <div className="absolute inset-0 bg-white">
                <IssuesComponent
                  roomID={roomID}
                  currentUser={currentUser}
                  issues={issues}
                  onIssueListClose={() => setShowIssueList(false)}
                  onIssueSelection={handleIssueSelection}
                  onIssueDeletion={() => {
                    setSelectedIssue(null);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
