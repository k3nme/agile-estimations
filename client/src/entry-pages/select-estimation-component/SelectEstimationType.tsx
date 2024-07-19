import EstimationType from "../../../../models/EstimationType";
import React, { useState } from "react";

const SelectEstimationType: React.FC = () => {
	const [selectedEstimationType, setSelectedEstimationType] =
		useState<string>("");

	const handleEstimationTypeChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setSelectedEstimationType(event.target.value);
	};

	return (
		<div className='mb-4'>
			<select
				name='EstimationSelection'
				title='EstimationSelection'
				value={selectedEstimationType}
				onChange={handleEstimationTypeChange}
				className='block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline'
			>
				{EstimationType._estimationTypes.map((estimationType) => (
					<option key={estimationType.name} value={estimationType.name}>
						{estimationType.name} - {estimationType.sizes.join(", ")}
					</option>
				))}
			</select>
		</div>
	);
};

export default SelectEstimationType;
