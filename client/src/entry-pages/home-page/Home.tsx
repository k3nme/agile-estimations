import { Link } from "react-router-dom";
import Header from "../app/Header";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import img1 from "../../assets/img1.webp";
import img2 from "../../assets/img2.webp";
import img3 from "../../assets/img3.webp";
import usePageVisibility from "../../utilities/usePageVisibility";

const sections = [
	{
		heading: "Welcome to Agile Estimations",
		description: "No signup required, No limit on users, No licenses.",
		subDescription:
			"Effortlessly manage your scrum planning sessions with your team.",
		image: img1,
	},
	{
		heading: "Streamline Your Planning Process",
		description: "Collaborate with your team in real-time.",
		subDescription: "Easy to use interface and powerful features.",
		image: img2,
	},
	{
		heading: "Boost Team Productivity",
		description: "Engage your team with interactive planning sessions.",
		subDescription: "Make planning efficient and fun.",
		image: img3,
	},
];

const typingVariants = {
	hidden: { opacity: 0, y: 10 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { delay: i * 0.03, duration: 0.05 },
	}),
	exit: { opacity: 0, y: 10, transition: { duration: 0.5 } },
};

const Home = () => {
	const [currentSection, setCurrentSection] = useState(0);
	const isVisible = usePageVisibility(); // Custom hook to track page visibility

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentSection((prevSection) => (prevSection + 1) % sections.length);
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	return (
		<>
			<div className='min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 overflow-hidden shadow drop-shadow'>
				<Header />
				<div className='flex flex-grow items-center justify-center'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full'>
						<AnimatePresence initial={false} presenceAffectsLayout>
							<motion.div
								key={currentSection}
								className='absolute top-0 left-0 w-full h-full flex items-center justify-center'
								initial={{ opacity: 0, x: "100%" }}
								animate={isVisible ? { opacity: 1, x: 0 } : {}}
								exit={{ opacity: 0, x: "-100%" }}
								transition={{ duration: 0.5 }}
							>
								<div
									className={`flex flex-col lg:flex-row items-center w-full ${"lg:flex-row"}`}
								>
									<div className='text-center lg:text-left lg:w-2/5 px-4'>
										<motion.h1
											className='text-3xl drop-shadow font-extrabold text-gray-900 dark:text-white sm:text-4xl md:text-5xl'
											initial='hidden'
											animate='visible'
											exit='exit'
											variants={typingVariants}
										>
											{Array.from(sections[currentSection].heading).map(
												(char, index) => (
													<motion.span
														key={index}
														custom={index}
														variants={typingVariants}
														initial='hidden'
														animate='visible'
														exit='exit'
													>
														{char}
													</motion.span>
												)
											)}
										</motion.h1>
										<motion.p
											initial='hidden'
											animate='visible'
											exit='exit'
											variants={typingVariants}
											className='mt-3 text-base drop-shadow text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl md:mt-5 md:text-xl'
										>
											{Array.from(sections[currentSection].description).map(
												(char, index) => (
													<motion.span
														key={index}
														custom={index}
														variants={typingVariants}
														initial='hidden'
														animate='visible'
														exit='exit'
													>
														{char}
													</motion.span>
												)
											)}
										</motion.p>
										<motion.p
											initial='hidden'
											animate='visible'
											exit='exit'
											variants={typingVariants}
											className='mt-3 text-base drop-shadow text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl md:mt-5 md:text-xl'
										>
											{Array.from(sections[currentSection].subDescription).map(
												(char, index) => (
													<motion.span
														key={index}
														custom={index}
														variants={typingVariants}
														initial='hidden'
														animate='visible'
														exit='exit'
													>
														{char}
													</motion.span>
												)
											)}
										</motion.p>
										<div className='mt-5 sm:mt-8 sm:flex justify-center lg:justify-start drop-shadow'>
											<motion.div
												whileHover={{ scale: isVisible ? 1.1 : 1 }}
												className='rounded-md shadow'
											>
												<Link
													to='/create-room'
													className='w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10'
												>
													Start Planning
												</Link>
											</motion.div>
										</div>
									</div>
									<div
										className={`mt-10 lg:mt-0 lg:w-3/5 px-10 ${
											currentSection % 2 === 0
												? "lg:ml-20 md:ml-20"
												: "lg:mr-20 md:mr-20"
										}`}
									>
										<motion.img
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.5 }}
											src={sections[currentSection].image}
											alt='Agile Estimations'
											className='w-full h-full object-cover object-center rounded-lg shadow-lg'
										/>
									</div>
								</div>
							</motion.div>
						</AnimatePresence>
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;
