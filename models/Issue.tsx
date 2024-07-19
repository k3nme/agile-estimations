import { IssueStatus } from "./IssueStatus";

type Issue = {
	id: string;
	title: string;
	description: string;
	finalEstimation: string;
	issueStatus: IssueStatus;
	estimations: { [key: string]: string[] };
};

export default Issue;
