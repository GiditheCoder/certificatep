import React from 'react'
import StateLogo from "../images/StateLogo.png"

const Footer = () => {
  return (
    <footer className="bg-[#1D2939] text-white">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10">
        {/* Top content: left logo + text, right contact */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          {/* Left: logo + gov text */}
          <div className="flex items-start space-x-3 sm:space-x-4">
            <img 
              src={StateLogo} 
              alt="Ogun State Logo" 
              className="w-12 h-12 sm:w-14 sm:h-14 mt-1" 
            />
            <div>
              <h2 className="font-semibold text-base sm:text-lg text-white">
                Ogun State Government
              </h2>
              <p className="text-xs sm:text-sm text-gray-300">
                State of Origin Acquisition Portal
              </p>
            </div>
          </div>

          {/* Right: contact details */}
          <div className="text-left text-sm sm:text-base">
            <h3 className="font-medium text-sm sm:text-base mb-2">Contact Us</h3>
            <p className="text-xs sm:text-sm text-gray-300">+234 702 001 000 - Support Line</p>
            <p className="text-xs sm:text-sm text-gray-300">+234 800 004 300 - ECG</p>
            <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-snug">
              <span className="font-medium text-gray-200">Open Hours of Government:</span> <br className="sm:hidden" />
              Mon - Fri: 8.00 am - 6.00 pm.
            </p>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="mt-6 sm:mt-8">
          <div className="border-t border-gray-600" />
          <div className="pt-3 sm:pt-4">
            <p className="text-[10px] sm:text-xs text-gray-400 text-left">
              © OGUN STATE GOVERNMENT. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
