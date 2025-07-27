import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { resetPassword } from '../services/operations/authAPI';

const UpdatePassword = () => {

    const dispatch = useDispatch();
    const location = useLocation();
    const [formData,setFormData] = useState({
        password : "",
        confirmPassword : "",
    })
    const [showPassword,setShowPassword] = useState(false);
    const [showConfirmPassword,setShowConfirmPassword] = useState(false);
    const {loading} = useSelector((state) => state.auth);

    const handleOnChange = (e) => {
        setFormData( (prevData) =>(
            {
                ...prevData,
                [e.target.name] : e.target.value,
            }
        ))
    }
    
    const {password,confirmPassword} = formData;

    const handleOnSubmit= (e)=>{
        e.preventDefault();
        const token = location.pathname.split('/').at(-1);
        console.log(password);
        console.log(confirmPassword);
        console.log(token);
        dispatch(resetPassword(password,confirmPassword,token));
    }
  return (
    <div className='text-white'>
        {
            loading ? (
                <div>
                    Loading....
                </div>
            ) : (
                <div>
                    <h1>Choose new Password</h1>
                    <p>Almost done. Enter your new password and youre all set.</p>
                    <form  onSubmit={handleOnSubmit}>
                        <label>
                            <p>New Password*</p>
                            <input 
                                required
                                type={showPassword ? 'text' : 'password'}
                                name='password'
                                value={password}
                                onChange={handleOnChange}
                                placeholder='Password'
                                className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                            />
                            <span
                                onClick={() => {setShowPassword((prev)=> !prev)}}
                            >
                                {
                                    showPassword ? <AiFillEyeInvisible fontSize={24}/>
                                    : <AiFillEye fontSize={24}/>
                                }
                            </span>
                        </label>

                        <label>
                            <p>Confirm New Password*</p>
                            <input 
                                required
                                type={showConfirmPassword ? 'text' : 'password'}
                                name='confirmPassword'
                                value={confirmPassword}
                                onChange={handleOnChange}
                                placeholder='Confirm Password'
                                className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                            />
                            <span
                                onClick={() => {setShowConfirmPassword((prev)=> !prev)}}
                            >
                                {
                                    showConfirmPassword ? <AiFillEyeInvisible fontSize={24}/>
                                    : <AiFillEye fontSize={24}/>
                                }
                            </span>
                        </label>

                        <button type='submit'>
                            Reset Password
                        </button>
                    </form>

                    <div>
                        <Link to="/login">
                            <p>Back to Login</p>
                        </Link>
                    </div>

                </div>
            )
        }
    </div>
  )
}

export default UpdatePassword