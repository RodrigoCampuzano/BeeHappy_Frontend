import React from 'react';

const HiveSummaryCard = ({ number, label }) => (
  <div
    className="
      flex flex-col justify-center items-center
      bg-[#F7B440] font-poppins font-bold
      text-[#013A55] border-2 border-yellow-400 shadow-2xl
      p-4 sm:p-6 rounded-lg text-center
      w-full
      h-[180px] sm:h-[220px] lg:h-[258px]
    "
  >
    <h2 className="text-3xl sm:text-5xl leading-tight">{number}</h2>
    <p className="text-xl sm:text-4xl mt-2">{label}</p>
  </div>
);

export default HiveSummaryCard;
