interface TextWithLinkProps {
	text: string;
	className?: string;
}

function TextWithLink({ text, className }: TextWithLinkProps) {
	if (isValidURL(text)) {
		const updatedClassName = `text-blue-500 hover:underline ${className}`;
		return (
			<a
				href={text}
				target='_blank'
				rel='noopener noreferrer'
				className={updatedClassName}
			>
				{text}
			</a>
		);
	}

	return (
		<span className={className} title={text}>
			{text}
		</span>
	);
}

function isValidURL(text: string) {
	try {
		new URL(text);
		return true;
	} catch (_) {
		return false;
	}
}

export default TextWithLink;
