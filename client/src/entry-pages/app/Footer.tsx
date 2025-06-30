import { Copyright } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Footer = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const interval = setInterval(() => {
      setYear(new Date().getFullYear());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full h-20 bg-gray-100 flex items-center justify-center text-gray-600  px-4 md:px-8">
      <motion.div
        className="flex items-center space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Copyright />
        <span className="text-sm drop-shadow">Agile Essentials - {year}</span>
      </motion.div>
    </footer>
  );
};

export default Footer;
