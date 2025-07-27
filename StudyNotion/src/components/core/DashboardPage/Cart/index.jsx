import { useSelector } from "react-redux";
import RenderTotalAmount from "./RenderTotalAmount";
import RenderCartCourses from './RenderCartCourses';

export default function Cart(){

    const {total,totalItems} = useSelector((state)=>state.cart);

    return (
        <div className="text-white">
            <h1>Your Cart</h1>
            <p>{totalItems} Courses in Cart</p>
            
            {total>0 ? 
            (
            <div>
                <RenderCartCourses/>
                <RenderTotalAmount/>
            </div>
            )
            :
            (
                <p>Your Cart is Empty</p>
            )    
            }
        </div>
    )
}