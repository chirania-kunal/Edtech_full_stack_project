import React from 'react'

const IconBtn = ({
    text,
    onclick,
    children,
    disabled,
    outline=false,
    customClasses,
    type
}) => {

  return (
        <button
        disabled={disabled}
        onClick={onclick}
        type={type}
        >
            {
                children ? (
                    <>
                        <span>
                            {text}
                        </span>
                        {children}
                    </>
                ) : (<span>{text}</span>)
            }
        </button>
  )
}

export default IconBtn