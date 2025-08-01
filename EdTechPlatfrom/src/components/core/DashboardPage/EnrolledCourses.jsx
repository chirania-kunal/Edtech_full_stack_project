import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import {getUserEnrolledCourses} from '../../../services/operations/profileAPI'
import ProgressBar from '@ramonak/react-progress-bar'

const EnrolledCourses = () => {

  const {token} = useSelector((state)=> state.auth);

  const [enrolledCourses,setEnrolledCourses] = useState(null);

  const getEnrolledCourses = async() => {
    try{
      const response= await getUserEnrolledCourses(token);
      setEnrolledCourses(response);
      console.log(enrolledCourses);
    }catch(error){
      console.log("Unable to fetch enrolled Courses");
    }
  }

  useEffect(()=>{
    getEnrolledCourses();
  },[]);
    

  return (
    <div className='text-white'>
        <div>Enrolled Courses</div>
        <div>
          {
            !enrolledCourses ?
            (
            <div>
              Loading...
            </div>
            ) :
             !enrolledCourses.length ? (<p>You have not enrolled in any course yet</p>)
             :(
                <div>
                  <div>
                    <p>Course Name</p>
                    <p>Durations</p>
                    <p>Progress</p>
                  </div>
                  {/* Card starting form here */}
                  {
                    enrolledCourses.map((course,index)=>(
                      <div>
                        <div>
                          <img src={course.thumbnail}/>
                          <div>
                            <p>{course.courseName}</p>
                            <p>{course.courseDescription}</p>
                          </div>
                        </div>

                        <div>
                          {course?.totalDuration}
                        </div>

                        <div>
                            <p>Progess: {course.progressPercentage || 0}%</p>
                            <ProgressBar 
                              completed={course.progressPercentage || 0} 
                              height='8px'
                              isLabelVisible={false}
                              
                              />
                             
                        </div>
                      </div>
                    ))
                  }
                </div>

              )
          }
        </div>
    </div>
  )
}

export default EnrolledCourses