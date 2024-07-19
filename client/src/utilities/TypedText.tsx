import React, { useState, useEffect } from "react";

type TypedTextProps = {
	textToDisplay: string;
};

const TypedText: React.FC<TypedTextProps> = ({ textToDisplay }) => {
	const [text, setText] = useState("");

	useEffect(() => {
		setText("");
		let currentIndex = 0;
		const typingInterval = setInterval(() => {
			if (currentIndex < textToDisplay.length) {
				setText((prevText) => prevText + textToDisplay[currentIndex]);
				currentIndex++;
			} else {
				clearInterval(typingInterval);
			}
		}, 50);

		return () => clearInterval(typingInterval);
	}, [textToDisplay]);

	return (
		<h1 className='text-5xl text-blue-800 font-bold m-4 welcome-text'>
			{text}
		</h1>
	);
};

export default TypedText;
