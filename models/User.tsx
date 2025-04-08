import { UserType } from "./UserType";

type User = {
	id: string;
	type: UserType;
	isSpectator: boolean;
};

export default User;
