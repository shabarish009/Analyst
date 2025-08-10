import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, ...rest }) => {
  return (
    <button
      {...rest}
      className={`btn ${variant}`}
      style={{
        padding: '6px 12px',
        border: '1px solid #003c74',
        background: variant === 'primary' ? '#dfe8f6' : 'transparent',
        borderRadius: 2,
        boxShadow: 'inset 1px 1px 0 #fff',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

