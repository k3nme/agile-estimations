import { Link } from "react-router-dom";
import Header from "../app/Header";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import usePageVisibility from "../../utilities/usePageVisibility";

const sections = [
  {
    heading: "Welcome to Agile Estimations",
    description: "No signup required, No limit on users, No licenses.",
    subDescription:
      "Effortlessly manage your scrum activities / planning sessions with your team",
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
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 overflow-hidden shadow drop-shadow">
        <Header />
        <div className="flex flex-grow items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
            <AnimatePresence initial={false} presenceAffectsLayout>
              <motion.div
                key={currentSection}
                className="absolute w-full h-full flex items-center justify-center"
                initial={{ opacity: 0, x: "100%" }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                exit={{ opacity: 0, x: "-100%" }}
                transition={{ duration: 0.5 }}
              >
                <div className={"flex flex-col  items-center w-full"}>
                  <div className="text-center px-4">
                    <motion.h1
                      className="text-3xl drop-shadow font-extrabold text-gray-900 dark:text-white sm:text-4xl md:text-5xl"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={typingVariants}
                    >
                      {Array.from(sections[currentSection].heading).map(
                        (char, index) => (
                          <motion.span
                            key={char.concat(index.toString())}
                            custom={index}
                            variants={typingVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                          >
                            {char}
                          </motion.span>
                        ),
                      )}
                    </motion.h1>
                    <motion.p
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={typingVariants}
                      className="mt-3 text-base drop-shadow text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl md:mt-5 md:text-xl"
                    >
                      {Array.from(sections[currentSection].description).map(
                        (char, index) => (
                          <motion.span
                            key={char.concat(index.toString())}
                            custom={index}
                            variants={typingVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                          >
                            {char}
                          </motion.span>
                        ),
                      )}
                    </motion.p>
                    <motion.p
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={typingVariants}
                      className="mt-3 text-base drop-shadow text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl md:mt-5 md:text-xl"
                    >
                      {Array.from(sections[currentSection].subDescription).map(
                        (char, index) => (
                          <motion.span
                            key={char.concat(index.toString())}
                            custom={index}
                            variants={typingVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                          >
                            {char}
                          </motion.span>
                        ),
                      )}
                    </motion.p>
                    <div className="mt-5 sm:mt-8 sm:flex justify-center drop-shadow">
                      <motion.div
                        whileHover={{ scale: isVisible ? 1.1 : 1 }}
                        className="rounded-md shadow"
                      >
                        <Link
                          to="/create-room"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg"
                        >
                          Start Planning
                        </Link>
                      </motion.div>
                    </div>
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
