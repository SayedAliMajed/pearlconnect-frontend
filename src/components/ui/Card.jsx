/**
 * @fileoverview Reusable Card component for PearlConnect
 *
 * A flexible container component that provides consistent card-based layouts.
 * Supports multiple variants, padding options, and interactive states for
 * displaying grouped content throughout the application.
 */

import React from 'react';
import './Card.css';

/**
 * Card Component
 *
 * Container component for grouping related content with consistent visual styling.
 * Commonly used for displaying service listings, user profiles, forms, and other
 * content modules that benefit from card-like presentation.
 *
 * @param {Object} props - Card component properties
 * @param {ReactNode} props.children - Card content
 * @param {string} props.variant - Visual style variant ('default', 'service', 'category', etc.)
 * @param {string} props.padding - Padding amount ('small', 'medium', 'large')
 * @param {boolean} props.hover - Whether card shows hover effects
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click event handler for interactive cards
 * @param {Object} props.props - Additional props passed to container div
 * @returns {JSX.Element} Styled card container
 */
const Card = ({
  children,
  variant = 'default',
  padding = 'medium',
  hover = true,
  className = '',
  onClick,
  ...props
}) => {
  // Build CSS class string following BEM methodology
  // Includes conditional modifiers for interactive and state-based styling
  const cardClasses = [
    'ui-card',                             // Base card class
    `ui-card--${variant}`,                // Variant-specific styles
    `ui-card--padding-${padding}`,        // Padding modifier
    hover ? 'ui-card--hover' : '',        // Hover effect modifier
    onClick ? 'ui-card--clickable' : '',  // Clickable state modifier
    className                             // Additional user-defined classes
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
