import "./App.css";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home"
import NavBar from './components/common/NavBar'
import OpenRoute from "./components/core/AuthPage/OpenRoute"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from './pages/About'
import MyProfile from './components/core/DashboardPage/MyProfile'
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/core/AuthPage/PrivateRoute";
import Error from "./pages/Error";
import Contact from "./pages/Contact";
import EnrolledCourses from "./components/core/DashboardPage/EnrolledCourses";
import Cart from "./components/core/DashboardPage/Cart";
import { ACCOUNT_TYPE } from "./utils/constant";
import { useSelector } from "react-redux";
import Setting from './components/core/DashboardPage/Settings/index'


function App() {

  const {user} = useSelector((state)=>state.profile);

  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword/>
            </OpenRoute>
          }
        />
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword/>
            </OpenRoute>
          }
        />
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail/>
            </OpenRoute>
          }
        />
        <Route
          path="about"
          element={
            <OpenRoute>
              <About/>
            </OpenRoute>
          }
        />

        <Route path="/contact" element={<Contact />} />

        <Route
          element={
          <PrivateRoute>
            <Dashboard/>
          </PrivateRoute>
        }
        >
          <Route path="dashboard/my-profile" element={<MyProfile/>} />
          <Route path="dashboard/settings" element={<Setting/>} />
      
          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="dashboard/cart" element={<Cart/>} />
                <Route path="dashboard/enrolled-courses" element={<EnrolledCourses/>} />
              </>
            )
          }

        </Route>
        
        <Route path="*" element={<Error/>} />
 
      </Routes>
    </div>
  );
}

export default App; 
