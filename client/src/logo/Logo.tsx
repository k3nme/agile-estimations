import { AnimatePresence, motion } from "framer-motion";
import vote from "../assets/vote.svg";
import chart from "../assets/bar-chart-big.svg";
import { useEffect, useState } from "react";

const Logo = () => {
	const [displayedIcon, setDisplayedIcon] = useState(vote);

	useEffect(() => {
		const timer = setInterval(() => {
			setDisplayedIcon((prev) => (prev === vote ? chart : vote));
		}, 3000); // Toggle icon every 3 seconds

		return () => clearInterval(timer);
	}, []);

	return (
		<div className='flex flex-col items-center rounded shadow-slate-50'>
			<div className='logo'>
				<AnimatePresence>
					<motion.img
						key='vote'
						src={displayedIcon}
						alt='vote'
						className='w-6 h-6'
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 20 }}
						transition={{ duration: 0.5 }}
					/>
				</AnimatePresence>
			</div>
			<motion.p
				className='text-sm font-semibold drop-shadow-md text-center'
				initial={{ y: -20 }}
				animate={{ y: 0 }}
				transition={{ type: "spring", stiffness: 300 }}
			>
				Agile Estimate
			</motion.p>
		</div>
	);
};

export default Logo;
