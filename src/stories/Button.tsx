import React from 'react';
import './button.css';

export type Extras = {
  id: number;
  name: string;
};
interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
  extra: Extras;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({ primary = false, size = 'medium', backgroundColor, label, extra, ...props }: ButtonProps) => {
  const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
  console.log('===>Extra prop:', { id: extra.id, name: extra.name });
  return (
    <>
      {extra.id != undefined && <p>Extra ID: {extra.id}</p>}
      {extra.name != undefined && <p>Extra Name: {extra.name}</p>}
      <button
        type="button"
        className={['storybook-button', `storybook-button--${size}`, mode].join(' ')}
        style={{ backgroundColor }}
        {...props}
      >
        {label}
      </button>
    </>
  );
};
