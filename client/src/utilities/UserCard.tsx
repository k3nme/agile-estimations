import { motion } from "framer-motion";
import type User from "../../../models/User";
import type Issue from "../../../models/Issue";
import { Close, Done, Pending } from "@mui/icons-material";

interface Props {
  user: User;
  isCurrentUser: boolean;
  selectedIssue: Issue | undefined;
  reveal: boolean | undefined;
  isInPolygon: boolean | undefined;
  isEstimationPresent: boolean | undefined;
  estimation: string | undefined;
}

const UserCard = ({
  user,
  isCurrentUser,
  reveal,
  isInPolygon,
  isEstimationPresent,
  estimation,
}: Props) => {
  const renderEstimationStatus = () => {
    const userEstimationStatus = reveal
      ? isEstimationPresent
        ? "show"
        : "notdone"
      : isEstimationPresent
        ? "done"
        : "pending";

    switch (userEstimationStatus) {
      case "show":
        return (
          <span className="flex justify-center items-center">
            <p className="text-green-500 text-sm">{estimation}</p>
          </span>
        );
      case "done":
        return (
          <span className="flex justify-center items-center">
            <Done className="text-green-500 drop-shadow" />
          </span>
        );
      case "pending":
        return (
          <span className="flex justify-center items-center">
            <Pending className="text-yellow-500 drop-shadow" />
          </span>
        );
      case "notdone":
        return (
          <span className="flex justify-center items-center">
            <Close className="text-red-500 drop-shadow" />
          </span>
        );
      default:
        return (
          <span className="flex justify-center items-center">
            <Pending className="text-yellow-500 drop-shadow" />
          </span>
        );
    }
  };

  return (
    <motion.div
      key="front"
      initial={{ rotateY: 0 }}
      animate={{ rotateY: 0 }}
      exit={{ rotateY: 180 }}
      transition={{ duration: 0.5 }}
      className={
        isInPolygon
          ? "absolute top-0 left-0 w-full h-full backface-hidden"
          : "w-20 h-15 m-2 ring ring-indigo-600 rounded-lg shadow-md flex flex-col justify-center items-center"
      }
    >
      <div className="flex flex-col justify-center items-center p-2">
        {/* Apply backface-visibility: hidden to prevent text flipping */}
        <motion.p
          className={`text-center text-md truncate  ${
            isCurrentUser ? "font-bold" : "font-medium"
          }`}
          style={{ backfaceVisibility: "hidden" }}
        >
          {user.id}
        </motion.p>
        <motion.p
          className="text-center text-sm"
          style={{ backfaceVisibility: "hidden" }}
        >
          {renderEstimationStatus()}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default UserCard;
