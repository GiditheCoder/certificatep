import React from 'react';
import Bg from '../images/Bg.png';

export default function Process() {
  const steps = [
    {
      number: '01',
      title: 'Create Account',
      description: 'Register with your personal details and NIN'
    },
    {
      number: '02',
      title: 'Submit Form',
      description: 'Fill out the form and upload required documents'
    },
    {
      number: '03',
      title: 'Make Payment',
      description: 'Secure payment via Flutterwave or Paystack'
    },
    {
      number: '04',
      title: 'Get Certificate',
      description: 'Download your verified digital certificate'
    }
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed py-16 px-4"
      style={{ backgroundImage: `url(${Bg})` }}
    >
      <div className="max-w-7xl mx-auto p-5">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-[#E3F2E7] text-[#11860F] text-sm font-semibold px-4 py-2 rounded-full">
              How to apply
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple Application Process
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-[#475467] font-medium">
            Follow these four (4) simple steps to obtain your L.G.A certificates
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 sm:p-10 h-[340px] sm:h-[360px] flex flex-col 
                         shadow-lg shadow-green-100/50 hover:shadow-xl hover:shadow-green-300/40 
                         hover:scale-105 transform transition-all duration-300 
                         group relative border border-[#e3e5e3]"
            >
              {/* Step Number Badge */}
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 
                              bg-white text-[#11860F] border border-[#d3d6d3] rounded-xl 
                              font-bold text-xl sm:text-2xl mb-6 shadow-md shadow-green-100/60 
                              group-hover:shadow-lg group-hover:shadow-green-300/50 
                              transition-all duration-300">
                {step.number}
              </div>

              {/* Step Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-[#2D995F] mb-3 sm:mb-4">
                {step.title}
              </h3>

              {/* Step Description */}
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
