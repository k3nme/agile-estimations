import Issue from "../../../../models/Issue";
import TextWithLink from "../../utilities/TextWithLink";

const IssueDetailsComponent = (props: { selectedIssue: Issue }) => {
	const { selectedIssue } = props;
	return (
		<div className='header-container text-center m-2'>
			{selectedIssue && selectedIssue.title ? (
				<h2 className='text-2xl p-2 truncate'>{selectedIssue.title}</h2>
			) : (
				<h2 className='text-2xl p-2 truncate'>Title</h2>
			)}
			{selectedIssue && selectedIssue.description ? (
				<TextWithLink
					text={selectedIssue.description}
					className='text-lg m-2 truncate'
				></TextWithLink>
			) : (
				<p className='text-lg truncate'>Description</p>
			)}
		</div>
	);
};

export default IssueDetailsComponent;
