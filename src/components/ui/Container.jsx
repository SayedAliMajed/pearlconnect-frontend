/**
 * @fileoverview Layout Container component for PearlConnect
 *
 * A responsive layout component that provides consistent max-widths and centering
 * for page content. Helps maintain readable content widths across different screen sizes.
 */

import React from 'react';
import './Container.css';

/**
 * Container Component
 *
 * Layout wrapper for centering and constraining content width.
 * Provides responsive max-widths and optional padding for consistent page layouts.
 * Commonly used as the outer wrapper for page content and sections.
 *
 * @param {Object} props - Container component properties
 * @param {ReactNode} props.children - Container content
 * @param {string} props.size - Max width constraint ('small', 'medium', 'large', 'xlarge')
 * @param {boolean} props.padding - Whether to include horizontal padding
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.props - Additional props passed to container div
 * @returns {JSX.Element} Centered layout container
 */
const Container = ({
  children,
  size = 'medium',
  padding = true,
  className = '',
  ...props
}) => {
  // Build CSS class string for responsive container styling
  const containerClasses = [
    'ui-container',                        // Base container class with centering
    `ui-container--${size}`,              // Size-specific max-width constraints
    padding ? 'ui-container--with-padding' : '', // Horizontal padding modifier
    className                             // Additional user-defined classes
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
};

export default Container;
