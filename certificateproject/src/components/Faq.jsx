import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Faq = () => {
  // All FAQs
  const faqs = [
    {
      question: "What is an LGA Certificate and why do I need it?",
      answer:
        "LGA Certificate is an official document issued by your Local Government Area confirming your origin or residency. It is often required for school admissions, job applications, scholarships, and other official verifications.",
    },
    {
      question: "How do I apply for my LGA Certificate on this platform?",
      answer:
        "Click on 'Apply Now' and fill in your personal details. Make payment and submit your application. You’ll receive a confirmation and can track your application status online.",
    },
    {
      question: "How long does it take to get my certificate after applying?",
      answer:
        "Processing typically takes 3–5 working days, depending on verification. You’ll be notified by email or SMS once your certificate is ready for download or collection.",
    },
    {
      question: "Can I track the progress of my application?",
      answer:
        "Yes. You can easily track your application by entering your Application ID or Email Address on the 'Track Application' page to see the current status.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  // Handle navigation
  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? faqs.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === faqs.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center md:text-left">
            Frequently <br /> Asked Questions
          </h2>
        </div>

        <div className="mt-6 md:mt-0 flex flex-col items-center md:items-start text-center md:text-left">
          <p className="text-gray-600 max-w-md ">
            Find answers to common questions about <br /> our{" "}
            <span className="font-semibold text-gray-900">
              Ogun State LGA Certificate Platform
            </span>
          </p>

          {/* Navigation Arrows */}
          <div className="flex justify-center md:justify-start gap-4">
            <button
              onClick={handlePrev}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`rounded-xl p-6 shadow transition-colors duration-300 ${
              index === activeIndex
                ? "bg-[#21A41F] text-white"
                : "bg-[#E3F2E780] text-gray-900"
            }`}
          >
            <h3 className="text-lg font-semibold mb-4">{faq.question}</h3>
            <p className="text-sm leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;
