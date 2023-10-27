import React from 'react'
import { twMerge } from 'tailwind-merge'

type CardProps = {
  title: string
  value: string | number
  Icon: React.ComponentType<{ className?: string; size?: number }>
  className?: string
}

const Card: React.FC<CardProps> = ({ title, value, Icon, className }) => {
  const cardClassName = twMerge(
    'transition-all duration-300 ease-in-out transform hover:scale-105 container mx-auto flex items-center justify-center gap-6 border border-solid border-primaryOrange rounded-lg p-5 w-64 h-32 shadow-md',
    className
  )

  return (
    <div data-testid="test-card" className={cardClassName}>
      <Icon data-testid="test-icon-card" className="text-primaryOrange" size={48} />

      <div className="gap-6">
        <h4 className="text-xl text-constrastBlack font-semibold">{title}</h4>
        <h5 className="text-lg text-constrastBlack">{value}</h5>
      </div>
    </div>
  )
}

export default Card
