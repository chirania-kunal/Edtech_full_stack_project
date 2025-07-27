import React from 'react'
import Instructor from '../../../assets/Images/Instructor.png'
import HighlightText from './HighlightText'
import CTAButton from './CTAButton'
import {FaArrowRight} from "react-icons/fa"

const InstructorSection = () => {
  return (
    <div className='mt-[30px]'>
        <div className='flex flex-row gap-20 items-center '>
            <div className='w-[50%]'>
                <img

                    src={Instructor}
                    alt='Instructor'
                    className='shadow-white object-cover border-[0px] shadow-[-10px_-10px_0px_rgba(0,0,0,1)]'
                />
            </div>

            <div  className=' w-[50%] flex flex-col gap-10'>
              <div className='text-4xl font-semibold w-[50%]' >
                Become and<br/>
                <HighlightText text={"Instructor"}/>
              </div>

              <p className='font-medium text-[16px] w-[80%] text-richblack-300 '>
                Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
              </p>

              <div className='w-fit'>
                <CTAButton active={true}>
                  <div className='flex flex-row items-center gap-3 text-lg color-[#000814]]'>
                    Start Learning Today
                    <FaArrowRight/>
                  </div>
                </CTAButton>
              </div>
                
              

            </div>
        </div>
    </div>
  )
}

export default InstructorSection
