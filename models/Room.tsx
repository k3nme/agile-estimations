import User from "./User";
import Issue from "./Issue";

type Room = {
	id: string;
	name: string;
	users: User[];
	issues: Issue[];
	selectedEstimationType: string;
	selectedEstimationValues: string[];
};

export default Room;
