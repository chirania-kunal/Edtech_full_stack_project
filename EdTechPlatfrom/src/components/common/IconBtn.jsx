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

    // console.log("Icon name:");
    // const Icon=iconName?Icons[iconName]: null ;
    // console.log(Icon);
  return (
        <div>
            <button
            disabled={disabled}
            onClick={onclick}
            type={type}
            className={`text-center text-[12px] px-6 py-3 rounded-md font-bold 
                ${ !disabled ? "bg-yellow-50 text-black" : "bg-richblack-800" } 
                hover:scale-95 transition-all duration-200
                `}
            >
                {
                    children ? (
                        <div className='flex flex-row justify-center items-center gap-x-2'>
                            {children}
                            <span>
                                {text}
                            </span>
                        </div>
                    ) : 
                    (
                    <div>
                        {/* <Icon className="text-lg"/> */}
                        <span>{text}</span>

                    </div>
                    )
                }
            </button>

        </div>
  )
}

export default IconBtn