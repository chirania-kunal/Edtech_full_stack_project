import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
// import { apiConnector } from '../../../services/apiConnector';
import { contactusEndpoint } from '../../../services/apis'
import CountryCode from '../../../data/countrycode.json'
import toast from 'react-hot-toast'

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm()

  const submitContactForm = async (data) => {
    console.log('Logging data', data)
    try {
      setLoading(true)
      // const response = await apiConnector("POST",contactusEndpoint.CONTACT_US_API,data);
      const response = { status: 'OK' }
      console.log('Logging Response', response)
      setLoading(false)
    } catch (error) {
      console.log('Error: ', error.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      toast.success('Form Submitted Successfully!')
      reset({
        email: '',
        firstName: '',
        lastName: '',
        message: '',
        phoneNo: '',
      })
    }
  }, [reset, isSubmitSuccessful])

  return (
    <form onSubmit={handleSubmit(submitContactForm)}>
      <div className="flex flex-col gap-4 ">
        <div className="flex gap-x-4">
          {/* firstname */}
          <div className="flex flex-col w-[50%]">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              placeholder="Enter First name"
              className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5 shadow-inner"
              {...register('firstName', {
                required: 'Please enter your first name',
              })}
            />
            <div className="min-h-[20px]">
              {errors.firstName && (
                <span className="text-pink-700 text-sm">
                  {errors.firstName.message}
                </span>
              )}
            </div>
          </div>

          {/* lastName */}
          <div className="flex flex-col w-[50%]">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              placeholder="Enter Last name"
              className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5 shadow-inner"
              {...register('lastName', {
                required: 'Please enter your last name',
              })}
            />
            <div className="min-h-[20px]">
              {errors.lastName && (
                <span className="text-pink-700 text-sm">
                  {errors.lastName.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email address"
            className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5 shadow-inner"
            {...register('email', {
              required: 'Please enter your email address',
            })}
          />
          <div className="min-h-[20px]">
            {errors.email && (
              <span className="text-pink-700 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
        </div>

        {/* Phone Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="phoneNumber">Phone Number</label>
          <div className="flex flex-row gap-5">
            <select
              id="countrycode"
              className="w-[15%] rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5 shadow-inner"
              {...register('countrycode', { required: true })}
            >
              {CountryCode.map((element, index) => (
                <option key={index} value={element.code}>
                  {element.code} - {element.country}
                </option>
              ))}
            </select>

            <input
              type="number"
              id="phonenumber"
              placeholder="12345 67890"
              className="w-[85%] rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5 shadow-inner"
              {...register('phoneNo', {
                required: { value: true, message: 'Please enter phone number' },
                maxLength: { value: 10, message: 'Invalid phone number' },
                minLength: { value: 8, message: 'Invalid phone number' },
              })}
            />
          </div>
          <div className="min-h-[20px]">
            {errors.phoneNo && (
              <span className="text-pink-700 text-sm">
                {errors.phoneNo.message}
              </span>
            )}
          </div>
        </div>

        {/* message */}
        <div className="flex flex-col">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            rows="7"
            placeholder="Enter your message here"
            className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5 shadow-inner"
            {...register('message', {
              required: 'Please enter your message',
            })}
          />
          <div className="min-h-[20px]">
            {errors.message && (
              <span className="text-pink-700 text-sm">
                {errors.message.message}
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="rounded-md bg-yellow-50 text-center px-6 text-[16px] font-bold text-black h-[48px]"
        >
          Send Message
        </button>
      </div>
    </form>
  )
}

export default ContactUsForm
