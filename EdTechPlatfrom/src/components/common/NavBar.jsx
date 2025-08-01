import React, { useEffect ,useState} from 'react'
import logo from '../../assets/Logo/Logo-Full-Light.png'
import { Link, useLocation,matchPath } from 'react-router-dom'
import {NavbarLinks} from '../../data/navbar-links'
import { useSelector } from 'react-redux'
import {AiOutlineShoppingCart} from 'react-icons/ai'
import ProfileDropDown from '../core/AuthPage/ProfileDropDown'
import { apiConnector } from '../../services/apiConnector'
import { categories } from '../../services/apis'
import {IoIosArrowDropdownCircle} from 'react-icons/io'

const NavBar = () => {

    const {token} = useSelector((state) => state.auth );
    const {user} = useSelector((state) => state.profile);
    const {totalItems} = useSelector( (state) => state.cart);
    const location = useLocation();

    const [subLinks,setSubLinks] = useState([]);

    const fetchSubLinks =  async() => {
        try{
            const result = await apiConnector("GET",categories.CATEGORIES_API);
            console.log("Result aa gya");
            console.log("Printing SubLinks result: ",result);
            // console.log(result.data.allCategorys);
            setSubLinks(result?.data?.allCategorys || []);


        }catch(error){
            console.log("Could not fetch the category list ");
        }
    }
    // console.log(subLinks);
    useEffect( () => {
      fetchSubLinks();
    },[]);
     

    const matchRoute = (route)=>{
        return matchPath({path:route},location.pathname)
    }
    // console.log(token);


  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
        <div className='flex w-11/12 max-w-maxContent items-center justify-between'>
            {/* Image */}
            <Link to="/home">
                <img src={logo} width={160} height={42} loading='lazy' />
            </Link>

            {/* Nav Links */}
            <nav>
                <ul className='flex  gap-x-6 text-richblack-25 text-lg '>
                {
                    NavbarLinks.map((link,index) => {
                        return <li key={index}>
                            {
                                link.title === "Catalog" ? 
                                (
                                    <div className='relative flex flex-row gap-2 justify-center items-center group'>
                                        <p>{link.title}</p>
                                        <IoIosArrowDropdownCircle/>
                                        < div className='invisible absolute left-[20%]  
                                        translate-x-[-10%] translate-y-[70%]
                                        top-[40%]
                                        flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900 
                                        opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100
                                        lg:w-[300px] z-10'>

                                            <div className='absolute left-[10%] top-0
                                                            translate-x-[170%] translate-y-[-45%]
                                                            h-6 w-6 rotate-45 rounded bg-richblack-5 '>
                                            </div>
                                            {
                                                subLinks.length ?  (
                                                    subLinks.map((subLink,index) => (
                                                        <Link to='/signup' key={index}>
                                                            <p >{subLink.name}</p>
                                                        </Link>
                                                    ))
                                                ) : (<div></div>)
                                            }
                                        

                                        </div>

                                    </div>

                                ) : (

                                    <Link to={link?.path}>
                                        <p className={`${matchRoute(link?.path)? "text-yellow-25" 
                                        : "text-richbalck-25"}`}>
                                            {link.title}
                                        </p>
                                    </Link>
                                )
                            }
                        </li>
                    })
                }
                </ul>
            </nav>

            {/* Login SignUp Dashboard */}
            <div className='flex gap-x-4 items-center'>
                {
                    user && user?.accountType !== "Instructor" && (
                        <Link to="/dashboard/cart" className='relative'>
                            <AiOutlineShoppingCart/>
                            {
                                totalItems > 0 && (
                                    <span className='text-white'>
                                        {totalItems}
                                    </span>
                                )   
                            }
                        </Link>
                    )
                }
                {
                    token === null && (
                        <Link to="/login">
                            <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[5px]
                            text-richblack-100 rounded-md '>
                                Log In
                            </button>

                        </Link>
                    )
                }
                {
                   token === null && (
                    <Link to="/signup">
                        <button  className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px]
                        text-richblack-100 rounded-md'>
                            Sign Up
                        </button>

                    </Link>
                    ) 
                }
                {
                    token !== null && <ProfileDropDown/>
                }
            </div>
        </div>
    </div>
  )
}

export default NavBar