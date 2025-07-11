import type React from "react";
import { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu as MenuIcon } from "@mui/icons-material";
import Logo from "../../logo/Logo";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <header className="flex flex-row justify-between items-center w-full h-20 bg-gray-100  px-4 md:px-8">
      {/* Logo */}
      <div className="w-28 h-18">
        <Link to="/">
          <Logo />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}

        {/* Menu Button (Mobile) */}
        <div className="md:hidden">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <MenuIcon className="text-indigo-600 hover:text-indigo-700" />
          </IconButton>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-4 ">
          <motion.span
            className="relative cursor-pointer text-indigo-600 hover:text-indigo-700
						 font-bold
						 "
            whileHover={{ scale: 1.0, borderBottom: "1px solid #4f46e5" }}
          >
            <Link
              to="/create-room"
              className="w-full flex items-center justify-center px-3 py-1 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 md:py-1 md:text-lg"
            >
              Create
            </Link>
          </motion.span>
          {/* Join Room Link */}
          <motion.span
            className="relative cursor-pointer text-indigo-600 hover:text-indigo-700"
            whileHover={{ scale: 1.0, borderBottom: "1px solid #4f46e5" }}
          >
            <Link
              to="/join-room"
              className="w-full flex items-center justify-center px-3 py-1 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 md:py-1 md:text-lg"
            >
              Join
            </Link>
          </motion.span>
        </div>

        {/* Menu for Mobile */}
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          MenuListProps={{ className: "flex flex-col items-end" }}
          slotProps={{
            paper: {
              sx: {
                width: "150px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              },
            },
          }}
        >
          <MenuItem>
            <Link
              to="/create-room"
              className="text-indigo-600 hover:text-indigo-700 drop-shadow"
            >
              Create
            </Link>
          </MenuItem>

          <MenuItem>
            <Link
              to="/join-room"
              className="text-indigo-600 hover:text-indigo-700 drop-shadow"
            >
              Join
            </Link>
          </MenuItem>

          <MenuItem>
            <Link
              to="/contact-us"
              className="text-indigo-600 hover:text-indigo-700 drop-shadow"
            >
              About
            </Link>
          </MenuItem>
        </Menu>
      </nav>
    </header>
  );
};

export default Header;
