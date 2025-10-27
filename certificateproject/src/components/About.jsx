import React from 'react'; 
import AboutImage from '../images/AboutImage.png';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

   const handleSignUpScreen = () => {
    navigate('/signup')
  }
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat min-h-[400px] flex items-center"
      style={{ backgroundImage: `url(${AboutImage})` }}
    >
      {/* Green overlay */}
      <div className="absolute inset-0 bg-green-900/70"></div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
          About
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-100 leading-relaxed mb-3 sm:mb-4">
          The Ogun State LGA Certificate Acquisition Portal is a digital platform designed to simplify and streamline 
          the process of obtaining Local Government Area (LGA) certificates across the state.
        </p>
        <p className="text-sm sm:text-base md:text-lg text-gray-100 leading-relaxed mb-6 sm:mb-8">
          Built with convenience and transparency in mind, the platform allows residents to easily apply for, track, 
          and receive their LGA certificates without the stress of physical visits or long queues.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center sm:justify-start">
          <button className="bg-white text-green-700 font-semibold px-5 sm:px-6 md:px-8 py-2 sm:py-3 rounded-md shadow hover:bg-green-50 transition-all text-sm sm:text-base" onClick={handleSignUpScreen}>
            Get started
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;
