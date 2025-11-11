import React from 'react';
import './Container.css';

const Container = ({ 
  children, 
  size = 'medium',
  padding = true,
  className = '',
  ...props 
}) => {
  const containerClasses = [
    'ui-container',
    `ui-container--${size}`,
    padding ? 'ui-container--with-padding' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
};

export default Container;
