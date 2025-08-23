import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../../../services/operations/profileAPI'
import ProgressBar from '@ramonak/react-progress-bar'
import { Link } from 'react-router-dom'
import { FiMoreVertical } from "react-icons/fi"

const EnrolledCourses = () => {
  const { token } = useSelector((state) => state.auth)
  const [enrolledCourses, setEnrolledCourses] = useState(null)
  const [openMenuIndex, setOpenMenuIndex] = useState(null)

  const getEnrolledCoursesData = async () => {
    try {
      const response = await getUserEnrolledCourses(token)
      console.log("Response", response)
      setEnrolledCourses(response)
    } catch (error) {
      console.log("Unable to fetch enrolled Courses", error)
    }
  }

  useEffect(() => {
    getEnrolledCoursesData()
  }, [])

  return (
    <div className="text-white w-full">
      {/* Breadcrumbs */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="text-sm text-richblack-300">
          <Link to="/">Home</Link> /
          <Link to="/dashboard" className="ml-1">Dashboard</Link> /
          <span className="ml-1 text-richblack-100">Enrolled Courses</span>
        </div>
        <div className="text-3xl font-semibold">Enrolled Courses</div>
      </div>

      {/* Content */}
      <div>
        {!enrolledCourses ? (
          <div className="spinner">Loading...</div>
        ) : !enrolledCourses.length ? (
          <p>You have not enrolled in any course yet</p>
        ) : (
          <div className="border border-richblack-700 rounded-md">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 border-b border-richblack-700 bg-richblack-800 px-6 py-3 text-richblack-200 text-sm">
              <p className="col-span-6">Course Name</p>
              <p className="col-span-3">Duration</p>
              <p className="col-span-3">Progress</p>
            </div>

            {/* Rows */}
            {enrolledCourses.map((course, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-4 items-center px-6 py-4 border-b border-richblack-700 hover:bg-richblack-900 relative"
              >
                {/* Course Info */}
                <div className="col-span-6 flex items-center gap-4">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-[52px] h-[52px] rounded-md object-cover"
                  />
                  <div>
                    <p className="font-medium">{course.courseName}</p>
                    <p className="text-sm text-richblack-300">
                      {course.courseDescription}
                    </p>
                  </div>
                </div>

                {/* Duration */}
                <div className="col-span-3">
                  {course?.totalDuration || "2hr 30mins"}
                </div>

                {/* Progress + Menu */}
                <div className="col-span-3 flex items-center justify-between">
                  <div className="w-full">
                    <p className="text-sm mb-1">
                      {course.progressPercentage === 100
                        ? "Completed"
                        : `Progress ${course.progressPercentage || 0}%`}
                    </p>
                    <ProgressBar
                      completed={course.progressPercentage || 0}
                      height="8px"
                      isLabelVisible={false}
                      bgColor={
                        course.progressPercentage === 100 ? "#22c55e" : "#38bdf8"
                      }
                    />
                  </div>

                  {/* 3-dot menu */}
                  <div className="relative ml-2">
                    <button
                      onClick={() =>
                        setOpenMenuIndex(openMenuIndex === index ? null : index)
                      }
                    >
                      <FiMoreVertical className="text-lg" />
                    </button>

                    {openMenuIndex === index && (
                      <div className="absolute right-0 top-6 w-48 bg-richblack-800 border border-richblack-700 rounded-md shadow-lg z-10">
                        <button
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-richblack-700"
                          onClick={() => console.log("Mark Completed")}
                        >
                          ✅ Mark as Completed
                        </button>
                        <button
                          className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-richblack-700"
                          onClick={() => console.log("Remove course")}
                        >
                          🗑 Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EnrolledCourses
