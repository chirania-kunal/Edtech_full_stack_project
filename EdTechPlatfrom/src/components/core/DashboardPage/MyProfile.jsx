import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { VscEdit } from 'react-icons/vsc'
import IconBtn from '../../common/IconBtn'

const MyProfile = () => {
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate();

  return (
    <div className="text-white w-full p-6 space-y-6">

      {/* Breadcrumb */}
      <div className="text-sm text-richblack-300">
        <Link to="/">Home</Link> / 
        <Link to="/dashboard" className="ml-1">Dashboard</Link> / 
        <span className="ml-1 text-richblack-100">My Profile</span>
      </div>

      <h1 className="text-3xl font-semibold text-center">My Profile</h1>

      {/* Profile Section */}
      <div className="flex items-center justify-between rounded-md border border-richblack-700 bg-richblack-800 p-6">
        <div className="flex gap-4 items-center">
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="w-[80px] h-[80px] rounded-full object-cover border border-richblack-600"
          />
          <div>
            <p className="font-medium text-lg">{user?.firstName + " " + user?.lastName}</p>
            <p className="text-richblack-300">{user?.email}</p>
          </div>
        </div>
        <IconBtn
          text="Edit"
          iconName="VscEdit"
          onclick={() => navigate("/dashboard/settings")}
        >
         <VscEdit fontSize={18} />
        </IconBtn>

      </div>

      {/* About Section */}
      <div className="rounded-md border border-richblack-700 bg-richblack-800 p-6">
        <div className="flex justify-between items-center mb-2">
          <p className="font-medium text-lg">About</p>
          <IconBtn
            text="Edit"
            onclick={() => navigate("/dashboard/settings")}
          >
            <VscEdit fontSize={18} />
          </IconBtn>
        </div>
        <p className="text-richblack-300">
          {user?.additionalDetails?.about ?? "Write something about yourself..."}
        </p>
      </div>

      {/* Personal Details Section */}
      <div className="rounded-md border border-richblack-700 bg-richblack-800 p-6">
        <div className="flex justify-between items-center mb-4">
          <p className="font-medium text-lg">Personal Details</p>
          <IconBtn
            text="Edit"
            onclick={() => navigate("/dashboard/settings")}
          >
             <VscEdit fontSize={18} />
            </IconBtn>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-richblack-300 text-sm">First Name</p>
            <p>{user?.firstName}</p>
          </div>
          <div>
            <p className="text-richblack-300 text-sm">Last Name</p>
            <p>{user?.lastName}</p>
          </div>
          <div>
            <p className="text-richblack-300 text-sm">Email</p>
            <p>{user?.email}</p>
          </div>
          <div>
            <p className="text-richblack-300 text-sm">Phone Number</p>
            <p>{user?.additionalDetails?.contactNumber ?? "Add Contact Number"}</p>
          </div>
          <div>
            <p className="text-richblack-300 text-sm">Gender</p>
            <p>{user?.additionalDetails?.gender ?? "Add Gender"}</p>
          </div>
          <div>
            <p className="text-richblack-300 text-sm">Date of Birth</p>
            <p>{user?.additionalDetails?.dateOfBirth ?? "Add Date of Birth"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProfile
