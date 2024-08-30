import { motion } from "framer-motion";
import Header from "../app/Header";
import { TextField } from "@mui/material";
import { useState } from "react";
import { Download } from "@mui/icons-material";
import Issue from "../../../../models/Issue";

const Donate = () => {
		
		const [amount, setAmount] = useState(0);

		return (
		<div className='flex flex-col min-h-screen bg-gray-100'>
			<Header />
			<div className='flex flex-grow flex-col lg:flex-row items-center justify-center p-4'>
				{/* Left Content (Steps to Take) */}
				<div className='lg:mr-12 max-w-xs mb-6 lg:mb-0 drop-shadow'>
					<h2 className='text-2xl font-bold mb-4'>Note</h2>
					<ul className='list-disc list-inside'>
						<li className='mb-2'>If you like the application, please consider donating an amount, to show your support.</li>
						<li className='mb-2'>The donated amount will be used for hosting costs, and maintenance.</li>
						<li className='mb-2 text-yellow-200'>The payment gateway integration in progress.</li>
					</ul>
				</div>
				{/* Right Content (Form) */}
				<motion.div
					initial={{ opacity: 0, x: 50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
					className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md'
				>
					<h1 className='text-3xl font-bold mb-6 text-center'>Donate</h1>

					<TextField
						label='Amount'
						fullWidth
						value={amount}
						required
						disabled
						type='number'
						variant='outlined'
						onChange={(e) => setAmount(e.target.value)}
					/>
					
					<motion.div className = 'grid grid-cols-4 w-full my-2 text-base font-medium justify-between gap-2 text-center'>
						<motion.button className='bg-indigo-500 p-2 rounded text-white cursor-not-allowed' onClick={() => {setAmount(100);}}>100</motion.button>
                                                <motion.button className='bg-indigo-500 p-2 rounded text-white cursor-not-allowed' onClick={() => {setAmount(200);}}>200</motion.button>
                                                <motion.button className='bg-indigo-500 p-2 rounded text-white cursor-not-allowed' onClick={() => {setAmount(500);}}>500</motion.button>
						<motion.button className='bg-indigo-500 p-2 rounded text-white cursor-not-allowed' onClick={() => {setAmount(1000);}}>1000</motion.button>
					</motion.div>
					
					<motion.button
						type='button'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.9 }}
						transition={{ type: "tween", stiffness: 100 }}
						className='flex items-center justify-center text-white bg-indigo-600 hover:bg-indigo-700 mt-6 py-2 px-4 rounded w-full shadow cursor-not-allowed'
						onClick={() => {
							console.log("Integrate Payment Gateway");
						}}
					>
						Donate
					</motion.button>
				</motion.div>
			</div>
		</div>
);
};

export default Donate;
