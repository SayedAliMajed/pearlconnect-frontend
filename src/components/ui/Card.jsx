import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  variant = 'default',
  padding = 'medium',
  hover = true,
  className = '',
  onClick,
  ...props 
}) => {
  const cardClasses = [
    'ui-card',
    `ui-card--${variant}`,
    `ui-card--padding-${padding}`,
    hover ? 'ui-card--hover' : '',
    onClick ? 'ui-card--clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cardClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
