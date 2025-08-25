import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import CountryCode from '../../../../data/countrycode.json'

import { updateProfile } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../common/IconBtn"

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitProfileForm = async (data) => {
    console.log("Form Data - ", data)
    try {
      dispatch(updateProfile(token, data))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit(submitProfileForm)}>
        {/* Profile Information */}
        <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
          <h2 className="text-lg font-semibold text-richblack-5">
            Profile Information
          </h2>
          <div className="flex flex-col gap-5 lg:flex-row">
            
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="firstName" className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="Enter first name"
                {...register("firstName", { required: true })}
                defaultValue={user?.firstName}
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
              />
              {errors.firstName && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your first name.
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="lastName" className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Enter first name"
                {...register("lastName", { required: true })}
                defaultValue={user?.lastName}
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
              />
              {errors.lastName && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your last name.
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="dateOfBirth" className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                {...register("dateOfBirth", {
                  required: {
                    value: true,
                    message: "Please enter your Date of Birth.",
                  },
                  max: {
                    value: new Date().toISOString().split("T")[0],
                    message: "Date of Birth cannot be in the future.",
                  },
                })}
                defaultValue={user?.additionalDetails?.dateOfBirth}
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className=" text-white w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
              />
              {errors.dateOfBirth && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  {errors.dateOfBirth.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="gender" className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Gender
              </label>
              <select
                type="text"
                name="gender"
                id="gender"
                {...register("gender", { required: true })}
                defaultValue={user?.additionalDetails?.gender}
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
              >
                {genders.map((ele, i) => {
                  return (
                    <option key={i} value={ele}>
                      {ele}
                    </option>
                  )
                })}
              </select>
              {errors.gender && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your Date of Birth.
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-5 lg:flex-row">

          <div className="flex flex-col gap-2 lg:w-[48%]">
                <label htmlFor="phoneNumber" className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">Phone Number</label>
                <div className="flex flex-row gap-5">
                  <select
                    id="countrycode"
                    className="w-[20%] rounded-[0.5rem] bg-richblack-700 p-[10px] text-richblack-5 shadow-inner"
                    {...register('countrycode', { required: true })}
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                    
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
                    style={{
                      boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                    }}
                    {...register('phoneNo', {
                      required: { value: true, message: 'Please enter phone number' },
                      maxLength: { value: 10, message: 'Invalid phone number' },
                      minLength: { value: 8, message: 'Invalid phone number' },
                    })}
                  />
                </div>
                <div className="min-h-[20px]">
                  {errors.phoneNo && (
                    <span className="-mt-1 text-[12px] text-yellow-100">
                      {errors.phoneNo.message}
                    </span>
                  )}
                </div>
              </div>


            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="about" className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                About
              </label>
              <input
                type="text"
                name="about"
                id="about"
                placeholder="Enter Bio Details"
                {...register("about", { required: true })}
                defaultValue={user?.additionalDetails?.about}
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
              />
              {errors.about && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your About.
                </span>
              )}
            </div>

          </div>
        </div>

          
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              navigate("/dashboard/my-profile")
            }}
            className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
          >
            Cancel
          </button>
          <IconBtn type="submit" text="Save" />
        </div>
      </form>
    </>
  )
}