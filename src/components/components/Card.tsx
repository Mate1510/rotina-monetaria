import React from "react";

type CardProps = {
  title: string;
  value: string | number;
  Icon: React.ComponentType<{ className?: string; size?: number }>;
};

const Card: React.FC<CardProps> = ({ title, value, Icon }) => {
  return (
    <div className="transition-all duration-300 ease-in-out transform hover:scale-105 container mx-auto flex items-center justify-center gap-6 border border-solid border-primaryOrange rounded-lg p-3 w-56 h-24">
      <Icon className="text-primaryOrange" size={42} />

      <div className="gap-6">
        <h4 className="text-xl text-constrastBlack font-semibold">{title}</h4>
        <h5 className="text-lg text-constrastBlack">{value}</h5>
      </div>
    </div>
  );
};

export default Card;
