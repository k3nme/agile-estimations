import type User from "./User";
import type Issue from "./Issue";

type Room = {
  id: string;
  name: string;
  users: User[];
  issues: Issue[];
  selectedEstimationType: string;
  selectedEstimationValues: string[];
};

export default Room;
