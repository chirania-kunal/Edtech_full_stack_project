import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import IconBtn from '../../common/IconBtn'

const MyProfile = () => {

    const {user} = useSelector((state) =>state.profile)
    const navigate = useNavigate();

  return (
    <div className='text-white w-full'>
        <h1 className='text-center text-3xl'>
            My Profile
        </h1>
        
        {/* Section 1 */}
        <div className=' flex flex-row gap-x-2'>
                <img 
                src={user?.image}
                alt={`profile-${user?.firsName}`}
                className='aspect-square w-[70px] rounded-full object-cover'/>
                <div className=' flex flex-col'>
                    <p>{user?.firstName+" "+user?.lastName}</p>
                    <p>{user?.email}</p>
                </div>
            <IconBtn
                text="Edit"
                onclick={()=>{
                    navigate("/dashboard/settings")
                }}/>
        </div>

        {/* Section 2 */}
        <div className='mt-5'>
            <div>
                <p>About</p>
                <IconBtn
                text="Edit"
                onclick={()=>{
                    navigate("/dashboard/settings")
                }}
                />
            </div>
            <p>{user?.additionalDetails?.about ?? "Write Something about Yourself"}</p>
        </div>

        {/* section 3 */}

        <div>
            <div>
                <p>Personal Details</p>
                <IconBtn
                text={"Edit"}
                onclick={()=>{
                    navigate("/dashboard/settings")
                }}
                />
            </div>
            <div>
                <div>
                    <p>First Name</p>
                    <p>{user?.firstName}</p>
                </div>
                <div>
                    <p>Email</p>
                    <p>{user?.email}</p>
                </div>
                <div>
                    <p>Gender</p>
                    <p>{user?.additionalDetails?.gender ?? "Add Gender"}</p>
                </div>
                <div>
                    <p>Last Name</p>
                    <p>{user?.additionalDetails?.lastName}</p>
                </div>
                <div>
                    <p>Phone Number</p>
                    <p>{user?.additionalDetails?.contactNumber ?? "Add Contact Number"}</p>
                </div>
                <div>
                    <p>Date of Birth</p>
                    <p>{user?.additionalDetails?.dateOfBirth ?? "Add Date of Birth"}</p>
                </div>
                
            </div>
        </div>

    </div>
  )
}

export default MyProfile