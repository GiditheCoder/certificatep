import React, { useState } from 'react'
import DigitalApplication from "../images/DigitalApplication.png"
import GovernmentApproved from "../images/GovernmentApproved.png"
import OgunMap from "../images/OgunMap.png"
import NigerianMap from "../images/Nigerianmap.png"
import Speed from "../images/speed.png"
import StateLogo from "../images/StateLogo.png"
import MenuLogo from "../images/menu.png"
import CloseLogo from "../images/close.png"
import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion";

const Start = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignUpScreen = () => {
    navigate('/signup')
  }
  
  const handleLogInScreen = () => {
    navigate('/role')
  }


  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      {/* Header - Responsive */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-4 lg:py-5">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={StateLogo} alt="State Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
          <h1 className="font-semibold text-sm sm:text-base lg:text-lg text-[#475467]">
            Ogun State Government
          </h1>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-4">
          <button 
            className="text-[#475467] font-semibold text-sm sm:text-base lg:text-lg" 
            onClick={handleLogInScreen}
          >
            Sign in
          </button>
          <button 
            className="bg-[#11860F] text-white px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 rounded-lg font-semibold text-sm sm:text-base lg:text-lg hover:bg-[#0c670b] transition-colors" 
            onClick={handleSignUpScreen}
          >
            Get Started
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <img 
              src={menuOpen ? CloseLogo : MenuLogo} 
              alt="menu toggle" 
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
            />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center gap-3 py-3 bg-gray-50">
          <button 
            className="text-[#475467] font-semibold text-sm px-3 py-1" 
            onClick={handleLogInScreen}
          >
            Sign in
          </button>
          <button 
            className="bg-[#11860F] text-white px-4 py-1.5 rounded-lg font-semibold text-sm hover:bg-[#0c670b] transition-colors" 
            onClick={handleSignUpScreen}
          >
            Get Started
          </button>
        </div>
      )}

      {/* Main Section - Responsive */}
      <div className="flex flex-col xl:flex-row flex-1 px-4 sm:px-8 lg:px-12 py-6 lg:py-10 gap-8 xl:gap-0">
        {/* Left side */}
        <div className="flex-1 flex flex-col justify-center items-center xl:items-start text-center xl:text-left">
          <span className="bg-[#E3F2E7] text-green-700 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm mb-3">
            <span className='bg-white text-[#11860F]  px-2 py-0.5 rounded-full font-bold'>
              New!
            </span> 
            <span className='font-bold ml-1'>
              Apply for Local Government Certificates →
            </span>
          </span>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
            Apply for Local <br/> 
            Government <br/> 
            Certificates <span className="text-[#11860F]">Easily</span>
          </h2>
          
          <p className="text-[#475467] font-semibold text-sm sm:text-base lg:text-lg mt-4">
            Obtain your <strong>Ogun State</strong> Local Government of <br className="hidden sm:block"/> 
            Origin Certificate with few clicks.
          </p>
          
          {/* Action Buttons — NEW approach: inline-flex + max-w on mobile so they stay compact */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-6 justify-center xl:justify-start items-center">
            <button
              className="inline-flex items-center justify-center bg-white text-black border border-[#D0D5DD] font-semibold rounded-lg shadow hover:bg-gray-50 transition-all
                text-xs sm:text-sm md:text-base
                px-3 sm:px-4 md:px-6
                py-1 sm:py-2 md:py-3
                max-w-[200px] sm:max-w-none w-auto"
              onClick={handleSignUpScreen}
            >
              Apply for Certificate
            </button>

            <button
              onClick={() => {}}
              className="inline-flex items-center justify-center bg-[#11860F] text-white font-semibold rounded-lg shadow hover:bg-[#0c670b] transition-all
                text-xs sm:text-sm md:text-base
                px-3 sm:px-5 md:px-6
                py-1 sm:py-2 md:py-3
                max-w-[200px] sm:max-w-none w-auto"
            >
              Verify Certificate
            </button>
          </div>
        </div>

        {/* Right side - Map with floating cards */}
        <div className="flex-1 relative flex justify-center items-center min-h-[400px] sm:min-h-[500px] xl:min-h-0">
          {/* Nigerian Map Base */}
          <img 
            src={NigerianMap} 
            alt="Nigerian Map" 
            className="w-[85%] sm:w-[75%] xl:w-[70%] relative z-0 opacity-100"
          />

          {/* Ogun State Map Overlay */}
          <img 
            src={OgunMap} 
            alt="Ogun Map" 
            className="w-[70%] sm:w-[60%] xl:w-[55%] absolute z-10"
          />


          {/* Floating Cards */}
          <div className="absolute top-[5%] left-[5%] sm:left-[10%] xl:left-[15%] z-20">
            {/* <img 
              src={GovernmentApproved} 
              alt="100% Government Approved" 
              className="w-32 sm:w-40 xl:w-48 h-auto drop-shadow-lg hover:scale-105 transition-transform"
            /> */}
            <motion.img
  src={GovernmentApproved}
  alt="100% Government Approved"
  className="w-32 sm:w-40 xl:w-48 h-auto drop-shadow-lg"
  animate={{ y: [0, -15, 0] }}
  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
/>
          </div>

          <div className="absolute top-[5%] right-[5%] sm:right-[8%] xl:right-[10%] z-20">
            {/* <img 
              src={DigitalApplication} 
              alt="Digital Applications" 
              className="w-36 sm:w-44 xl:w-52 h-auto drop-shadow-lg hover:scale-105 transition-transform"
            /> */}
            <motion.img
  src={DigitalApplication}
  alt="Digital Applications"
  className="w-36 sm:w-44 xl:w-52 h-auto drop-shadow-lg"
  animate={{ y: [0, -10, 0] }}
  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
/>
          </div>

          <div className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2 z-20">
            {/* <img 
              src={Speed} 
              alt="Fast Processing Speed" 
              className="w-32 sm:w-40 xl:w-44 h-auto drop-shadow-lg hover:scale-105 transition-transform"
            /> */}
            <motion.img
  src={Speed}
  alt="Fast Processing Speed"
  className="w-32 sm:w-40 xl:w-44 h-auto drop-shadow-lg"
  animate={{ y: [0, -12, 0] }}
  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
/>
          </div>
        </div>
      </div>
      
    </div>
    
  )
  
}

export default Start
