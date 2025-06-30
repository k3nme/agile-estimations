import { Link } from "react-router-dom";
import Header from "../app/Header";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import usePageVisibility from "../../utilities/usePageVisibility";

const sections = [
  {
    // some name which explains the app can do estimations and retrospectives
    heading: "Agile Essentials",
    description: "No signup required, No limit on users, No licenses.",
    subDescription:
      "Effortlessly manage your planning sessions and retrospectives with your team",
  },
];

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
          <div className="max-w-7xl mx-auto w-full">
            <AnimatePresence initial={false} presenceAffectsLayout>
              <motion.div
                key={currentSection}
                className="w-full h-full flex items-center justify-center"
              >
                <div className={""}>
                  <div className="text-center ">
                    <motion.h1 className="text-3xl drop-shadow font-extrabold text-slate-800 text-center justify-center items-center dark:text-white sm:text-4xl md:text-5xl m-3">
                      {Array.from(sections[currentSection].heading).map(
                        (char, index) => (
                          <motion.span
                            key={char.concat(index.toString())}
                            custom={index}
                          >
                            {char}
                          </motion.span>
                        ),
                      )}
                    </motion.h1>
                    <motion.p className="text-2xl drop-shadow text-slate-800 text-center justify-center items-center dark:text-white m-3">
                      {Array.from(sections[currentSection].description).map(
                        (char, index) => (
                          <motion.span
                            key={char.concat(index.toString())}
                            custom={index}
                          >
                            {char}
                          </motion.span>
                        ),
                      )}
                    </motion.p>
                    <motion.p className="text-md drop-shadow text-slate-800 text-center justify-center items-center dark:text-white m-3">
                      {Array.from(sections[currentSection].subDescription).map(
                        (char, index) => (
                          <motion.span
                            key={char.concat(index.toString())}
                            custom={index}
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
                          className="w-full flex items-center justify-center px-4 py-1 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 md:py-2 md:text-lg"
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
