import { motion } from "framer-motion";
import Header from "../app/Header";

const ContactUs = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-grow flex-col lg:flex-row items-center justify-center p-4 ">
        {/* Left Content (Relevant Links and Info) */}
        <div className="lg:mr-12 max-w-xs mb-6 lg:mb-0 drop-shadow">
          <h2 className="text-2xl font-bold mb-4">Resources</h2>
          <ul className="list-disc list-inside">
            <li className="mb-2">
              <a
                href="https://en.wikipedia.org/wiki/Planning_poker"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                Wiki - Planning Poker
              </a>
            </li>
            <li className="mb-2">
              <a
                href="https://www.productplan.com/glossary/planning-poker/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                What is Planning Poker?
              </a>
            </li>
            <li className="mb-2">
              <a
                href="https://www.mountaingoatsoftware.com/agile/planning-poker"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                Planning Poker Guide
              </a>
            </li>
            <li className="mb-2">
              <a
                href="https://scrumguides.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                Official Scrum Guide
              </a>
            </li>
            <li className="mb-2">
              <a
                href="https://www.agilealliance.org/glossary/estimation/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                Agile Estimation Practices
              </a>
            </li>
          </ul>
        </div>

        {/* Right Content (Contact Form) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-4">Let's Connect</h2>

          {/* Developer Description */}
          <p className="mb-4 drop-shadow">
            Hi, I'm Kalyan Kaushik Khasibhatla, a passionate software engineer
            with expertise in building modern web applications using technologies
            like React, Angular, Node.js, and more. I enjoy creating scalable solutions
            for real-world problems.
          </p>

          {/* Closing Note */}
          <p className="drop-shadow mb-5">
            Feel free to reach out for collaborations, questions, or just a chat about tech.
            You can connect with me via the links below, or simply drop me a <a href="mailto:k3nmework@proton.me" target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline">mail</a>. I'm always
            open to exciting opportunities!
          </p>
          {/* Contact Links */}
          <ul className="list-none drop-shadow flex flex-row justify-around">
            <li className="flex items-center">
              <a
                href="https://www.kalyankaushikkhasibhatla.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-indigo-600 text-white drop-shadow p-2 rounded transition-all hover:bg-indigo-700"
              >
                Portfolio
              </a>
            </li>
            <li className="flex items-center">
              <a
                href="https://github.com/k3nme"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-indigo-600 text-white drop-shadow p-2 rounded transition-all hover:bg-indigo-700"
              >
                Github
              </a>
            </li>
            <li className="flex items-center">
              <a
                href="https://www.linkedin.com/in/k3nme/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-indigo-600 text-white drop-shadow p-2 rounded transition-all hover:bg-indigo-700"
              >
                LinkedIn
              </a>
            </li>
          </ul>


        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;
