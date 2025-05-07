import { motion } from "framer-motion";

const MaintenanceMode = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-grow flex-col lg:flex-row items-center justify-center p-4 ">
        {/* Right Content (Contact Form) */}
        <motion.div
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
        >
          <div className="text-center p-6">
            <h2 className="text-4xl font-bold text-indigo-600 mb-4">
              We'll Be Back Soon!
            </h2>
            <p className="text-lg mb-4 text-left">
              Our site is currently undergoing scheduled maintenance to bring
              you an even better experience.
            </p>
            <p className="text-base mb-5 drop-shadow text-left">
              Thank you for your patience and understanding. For urgent
              inquiries, feel free to
              <a
                href="mailto:k3nmework@proton.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                {" "}
                email us
              </a>
              .
            </p>
            <p className="text-sm text-gray-500">
              Stay tuned — great things are coming!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MaintenanceMode;
