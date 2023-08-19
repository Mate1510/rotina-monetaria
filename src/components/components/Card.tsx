import React from "react";

type CardProps = {
  title: string;
  value: string;
  Icon: React.ComponentType<{ className?: string; size?: number }>;
};

const Card = ({ title, value, Icon }: CardProps) => {
  return (
    <div className="container mx-auto items-center justify-center flex gap-6 border border-solid border-primaryOrange rounded-lg p-3 w-auto h-auto">
      <Icon className="text-primaryOrange" size={42} />

      <div className="gap-6 font-semibold">
        <h4 className="text-xl text-constrastBlack">{title}</h4>
        <h5 className="text-lg text-constrastBlack">R${value}</h5>
      </div>
    </div>
  );
};

export default Card;
