import { UserType } from "./UserType";

type User = {
	id: string;
	name: string;
	type: UserType;
	isSpectator: boolean;
};

export default User;
