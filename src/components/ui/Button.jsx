/**
 * @fileoverview Reusable Button component for PearlConnect
 *
 * A flexible, accessible button component that provides consistent styling
 * and behavior across the application. Supports multiple variants, sizes,
 * and states for different use cases throughout the UI.
 */

import React from 'react';
import './Button.css';

/**
 * Button Component
 *
 * Versatile button component supporting multiple visual variants and sizes.
 * Handles form submissions, user interactions, and different call-to-action styles.
 *
 * @param {Object} props - Button component properties
 * @param {ReactNode} props.children - Button content (text, icons, etc.)
 * @param {string} props.variant - Visual style variant ('primary', 'secondary', 'danger', etc.)
 * @param {string} props.size - Size variant ('small', 'medium', 'large')
 * @param {boolean} props.disabled - Whether button is disabled and non-interactive
 * @param {boolean} props.fullWidth - Whether button should take full container width
 * @param {Function} props.onClick - Click event handler
 * @param {string} props.type - Button type for forms ('button', 'submit', 'reset')
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.props - Additional props passed to button element
 * @returns {JSX.Element} Styled button component
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  // Build CSS class string from component props
  // Uses BEM methodology: base class + modifiers for variants, sizes, and states
  const buttonClasses = [
    'ui-button',                           // Base button class
    `ui-button--${variant}`,              // Variant-specific styles (primary, secondary, danger)
    `ui-button--${size}`,                 // Size-specific styles (small, medium, large)
    fullWidth ? 'ui-button--full-width' : '', // Optional full-width modifier
    className                              // Additional user-defined classes
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
