import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
// import { apiConnector } from '../../../services/apiConnector';
import { contactusEndpoint } from '../../../services/apis';
import CountryCode from '../../../data/countrycode.json'

const ContactUsForm = () => {

    const [loading,setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState : {errors,isSubmitSuccessful}
    } = useForm();

    const submitContactForm = async(data) => {
        console.log("Logging data",data);
        try{
            setLoading(true);
            // const response = await apiConnector("POST",contactusEndpoint.CONTACT_US_API,data);
            const response = {status: "OK"}
            console.log("Logging Response", response);
            setLoading(false);
        }catch(error){
            console.log('Error: ',error.message);
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(isSubmitSuccessful){
            reset ({
                email : "",
                firstName : "",
                lastName : "",
                message : "",
                phoneNo : "",
            })
        }
    },[reset,isSubmitSuccessful])

    
  return (
    <form onSubmit={handleSubmit(submitContactForm)}>
        <div className='flex flex-col gap-14'>

            <div className='flex gap-5'>

                {/* firstname */}
                <div className='flex flex-col'>
                    <label htmlFor='firstName'>First Name</label>
                    <input
                        type='text'
                        name='firstName'
                        id='firstName'
                        placeholder='Enter First name' 
                        style={{
                            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        }}
                        className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
                        {...register("firstName",{required : true})}
                    />
                    {
                        errors.firstName && (
                            <span>
                                Please Enter Your Name
                            </span>
                        )
                    }
                </div>

                {/* lastName */}
                <div className='flex flex-col'>
                    <label htmlFor='lastName'>Last Name</label>
                    <input
                        type='text'
                        name='lastName'
                        id='lastName'
                        placeholder='Enter Last name' 
                        style={{
                            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        }}
                        className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
                        {...register("lastName")}
                    />
                    {
                        errors.firstName && (
                            <span>
                                Please Enter Your Name
                            </span>
                        )
                    }
                </div>
                
            </div>

            {/* Email */}
            <div className='flex flex-col'>
            <label htmlFor='email'>Email Address</label>
            <input
                type='email'
                name='email'
                id='email'
                placeholder='Enter email Address' 
                style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"

                {...register("email",{required: true})}
            />
            {
                errors.email && (
                    <span>
                        Please Enter Your email Address
                    </span>
                )
            }
            </div>


            {/* Phone Field */}
            <div className='flex flex-col gap-2'>
                <label htmlFor='phoneNumber'>Phone Number</label>
                <div className='flex flex-row gap-5'>
                    {/* DropDown */}
                 
                        <select
                            name='dropdown'
                            id='dropdown'
                            style={{
                                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                            }}
                            className=" w-[10%] rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
                            {...register("countrycode",{required: true})}
                        >
                            {
                                CountryCode.map((element,index)=>{
                                    return (
                                        <option key={index} value={element.code}>
                                            {element.code} -{element.country}
                                        </option>
                                    )
                                })
                            }

                        </select>
             
            
                        <input
                            type='number'
                            name='phonenumber'
                            id='phonenumber'
                            placeholder='12345 67890'
                            style={{
                                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                            }}
                            className=" w-[80%] rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
                            {...register("phoneNo",{
                                required:{value: true, message : "Please enter Phone Number"},
                                maxLength : {value: 10, message : "Invalid Phone Number"},
                                minLength:  {value: 8, message : "Invalid Phone Number"}, 
                            })}
                        />

                    {
                        errors.phoneNo && (
                            <span>
                                {errors.phoneNo.message}
                            </span>
                        )
                    }
                </div>
               
            </div>

            {/* messsage */}
            <div className='flex flex-col'>
                <lablel htmlFor='message'>Message</lablel>
                <textarea 
                    name='message'
                    id='message'
                    cols='30'
                    rows='7'
                    placeholder='Enter Your Message here'
                    style={{
                        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                    }}
                      className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
                    {...register("message",{required: true})}
                />
                {
                    errors.message && (
                        <span>
                            Please enter your message.
                        </span>
                    )
                }
            </div>

            <button type='submit'
            className='rounded-md bg-yellow-50 text-center px-6 text-[16px] font-bold text-black h-[48px]'
            >
                Send Message
            </button>

        </div>
    </form>
  )
}

export default ContactUsForm