import React from "react";
import { useNavigate } from "react-router-dom";
import Bg from "../images/Bg.png";

const Role = () => {
  const navigate = useNavigate();

  const handleOfficialSelect = () => {
    navigate("/official");
  };

  const handleApplicantSelect = () => {
    navigate("/login");
  };

  return (
  <div
       className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 sm:px-6"
       style={{ backgroundImage: `url(${Bg})` }}
     >
      {/* Main Content - Centered */}
      <div className="flex flex-1 justify-center items-center py-8">
        <div className="text-center flex flex-col items-center w-full max-w-sm sm:max-w-md lg:max-w-lg">
          <h2 className="text-lg font-bold mb-6 text-white sm:text-2xl sm:mb-10 lg:text-3xl lg:mb-12">
            Choose which applies to you
          </h2>
          <p className="text-sm font-semibold mb-4 sm:text-lg sm:mb-8 lg:text-xl">
            I am
          </p>

          <div className="flex flex-col space-y-3 w-full max-w-[200px] mx-auto sm:max-w-none sm:space-y-4">
            <button
              onClick={handleOfficialSelect}
              className="border border-[#11860F]] text-black font-bold
                        text-xs px-3 py-2 rounded-full w-full 
                        transition-colors duration-300 ease-in-out 
                        sm:text-sm sm:px-6 sm:py-3   
                        lg:text-base lg:px-8 lg:py-4"
            >
              an official
            </button>

            <button
              onClick={handleApplicantSelect}
              className="bg-[#11860F] text-white font-bold 
                        text-xs px-3 py-2 rounded-full w-full 
                        hover:bg-[#0a5109]
                        transition-colors duration-300 ease-in-out 
                        sm:text-sm sm:px-6 sm:py-3   
                        lg:text-base lg:px-8 lg:py-4"
            >
              an applicant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Role;


