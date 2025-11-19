/**
 * @fileoverview Flexible Input component for PearlConnect forms
 *
 * A unified input component that handles both text inputs and select dropdowns.
 * Provides consistent styling, validation states, and icon support for forms throughout the application.
 */

import React from 'react';
import './Input.css';

/**
 * Input Component
 *
 * Versatile form input component supporting multiple input types and select elements.
 * Handles text, password, email, number, and other input types, plus full select dropdown functionality.
 * Includes icon support, validation states, and accessibility features.
 *
 * @param {Object} props - Input component properties
 * @param {string} props.type - Input type ('text', 'password', 'email', 'number') or 'select'
 * @param {string} props.placeholder - Placeholder text for input
 * @param {string} props.value - Controlled input value
 * @param {Function} props.onChange - Change event handler
 * @param {Function} props.onFocus - Focus event handler
 * @param {Function} props.onBlur - Blur event handler
 * @param {boolean} props.disabled - Whether input is disabled
 * @param {boolean} props.error - Whether input shows error state styling
 * @param {boolean} props.fullWidth - Whether input takes full container width
 * @param {ReactNode} props.icon - Icon element to display
 * @param {string} props.iconPosition - Icon position ('left' or 'right')
 * @param {string} props.className - Additional CSS classes
 * @param {ReactNode} props.children - Child elements (for select options)
 * @param {Object} props.props - Additional props passed to input element
 * @returns {JSX.Element} Styled input or select element
 */
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
  // Build CSS class string with conditional modifiers for state and styling
  const inputClasses = [
    'ui-input',                           // Base input class
    error ? 'ui-input--error' : '',       // Error state modifier
    fullWidth ? 'ui-input--full-width' : '', // Width modifier
    type === 'select' ? 'ui-input--select' : '', // Select-specific styling
    className                            // Additional user-defined classes
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
