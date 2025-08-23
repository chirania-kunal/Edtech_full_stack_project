import React from 'react'
import ContactUsForm from '../ContactPage/ContactUsForm'

const ContactFormSection = () => {
  return (
    <div className='mx-auto'>
            <h1 className='text-center text-4xl  font-semibold'>Get in Touch</h1>
            <p className='text-center text-md text-richblack-300 mt-[10px]'>
                We'd love to here for you, Please fill out this form.
            </p>
            <div className='mt-[30px] '>
                <ContactUsForm/>
            </div>
    </div>
  )
}

export default ContactFormSection