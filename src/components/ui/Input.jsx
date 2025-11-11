import React from 'react';
import './Input.css';

const Input = ({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  error = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  children,
  ...props 
}) => {
  const inputClasses = [
    'ui-input',
    error ? 'ui-input--error' : '',
    fullWidth ? 'ui-input--full-width' : '',
    type === 'select' ? 'ui-input--select' : '',
    className
  ].filter(Boolean).join(' ');

  if (type === 'select') {
    return (
      <select
        className={inputClasses}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        {...props}
      >
        {children}
      </select>
    );
  }

  return (
    <div className="ui-input-wrapper">
      {icon && iconPosition === 'left' && (
        <div className="ui-input__icon ui-input__icon--left">
          {icon}
        </div>
      )}
      <input
        type={type}
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        {...props}
      />
      {icon && iconPosition === 'right' && (
        <div className="ui-input__icon ui-input__icon--right">
          {icon}
        </div>
      )}
    </div>
  );
};

export default Input;
