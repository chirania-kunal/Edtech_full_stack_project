import React from 'react'

import Logo1 from '../../../assets/TimeLineLogo/Logo1.svg'
import Logo2 from '../../../assets/TimeLineLogo/Logo2.svg'
import Logo3 from '../../../assets/TimeLineLogo/Logo3.svg'
import Logo4 from '../../../assets/TimeLineLogo/Logo4.svg'
import timeLineImage from '../../../assets/Images/TimelineImage.png'




const TimeLineSection = () => {

    const timeLine = [
        {
            Logo : Logo1,
            Heading : "Leadership",
            Description : "Fully committed to the success company"
        },
        {
            Logo : Logo2,
            Heading : "Leadership",
            Description : "Fully committed to the success company"
        },
        {
            Logo : Logo3,
            Heading : "Leadership",
            Description : "Fully committed to the success company"
        },
        {
            Logo : Logo4,
            Heading : "Leadership",
            Description : "Fully committed to the success company"
        }
    ]

  return (
    <div>
        <div className='flex flex-row gap-15 items-center'> 
            <div className=' w-[45%] flex flex-col gap-5'>
                {
                    timeLine.map((element,index) => {
                        return (
                            <div className='flex flex-row gap-6 ' key={index}>
                                <div className='w-[50px] h-[50px] bg-white flex items-center rounded-full object-cover shadow-lg p-3'>
                                    <img src={element.Logo} />
                                </div>

                                <div>
                                    <h2 className='font-semibold text-[18px]'>{element.Heading}</h2>
                                    <p className='text-base'>{element.Description}</p>
                                </div>

                            </div>
                        )
                    })
                }
            </div>

            <div className='relative shadow-blue-200 '>
                <img src={timeLineImage}
                alt='timeLineImage'
                className='shadow-white object-cover h-fit '
                />

                <div className='absolute bg-caribbeangreen-700 flex flex-row  text-white uppercase py-10 
                 left-[50%] translate-x-[-50%] translate-y-[-50%]'>
                    <div className='flex flex-row gap-5 items-center border-r border-caribbeangreen-300 px-7'>
                        <p className='text-3xl font-bold'>10</p>
                        <p className='text-caribbeangreen-300 text-sm'>Years of Experience</p>
                    </div>
                    <div className='flex flex-row gap-5 items-center   px-7'>
                        <p className='text-3xl font-bold'>250</p>
                        <p className='text-caribbeangreen-300 text-sm'>Type of Courses</p>
                    </div>
                </div>

            </div>
        </div>

    </div>
  )
}

export default TimeLineSection