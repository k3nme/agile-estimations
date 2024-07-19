class EstimationType {
	static readonly Scrum = {
		id: 1,
		name: "Scrum",
		sizes: [
			"0",
			"0.5",
			"1",
			"2",
			"3",
			"5",
			"8",
			"13",
			"20",
			"40",
			"100",
			"?",
			"∞",
			"☕",
		],
		display: "Scrum (0, 0.5, 1, 2, 3 ... 100)",
	};
	static readonly Kanban = {
		id: 2,
		name: "Kanban",
		sizes: [
			"0",
			"1",
			"2",
			"3",
			"5",
			"8",
			"13",
			"20",
			"40",
			"100",
			"?",
			"∞",
			"☕",
		],
		display: "Kanban (0, 1, 2, 3, 5 ... 100)",
	};
	static readonly Fibonacci = {
		id: 3,
		name: "Fibonacci",
		sizes: [
			"0",
			"1",
			"2",
			"3",
			"5",
			"8",
			"13",
			"21",
			"34",
			"55",
			"89",
			"?",
			"∞",
			"☕",
		],
		display: "Fibonacci (0, 1, 2, 3, 5 ... 89)",
	};
	static readonly TShirtSizes = {
		id: 4,
		name: "T-Shirt Sizes",
		sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "?", "∞", "☕"],
		display: "T-Shirt Sizes (XS, S, M, L, XL, XXL)",
	};
	static readonly PowersOfTwo = {
		id: 5,
		name: "Powers of Two",
		sizes: [
			"0",
			"1",
			"2",
			"4",
			"8",
			"16",
			"32",
			"64",
			"128",
			"256",
			"?",
			"∞",
			"☕",
		],
		display: "Powers of Two (0, 1, 2, 4, 8 ... 256)",
	};
	static readonly Custom = {
		id: 6,
		name: "Custom",
		sizes: [],
		display: "Custom",
	};

	public static readonly _estimationTypes = [
		EstimationType.Scrum,
		EstimationType.Kanban,
		EstimationType.Fibonacci,
		EstimationType.TShirtSizes,
		EstimationType.PowersOfTwo,
		EstimationType.Custom,
	];

	private constructor() {}
}

export default {
	EstimationType,
	_estimationTypes: EstimationType._estimationTypes,
};
