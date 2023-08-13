import { Outlet } from "react-router-dom";

import Subscription from "../components/Subscription/Subscription";

import Footer from "../shared/Footer/Footer";
import Navbar from "../shared/Navbar/Navbar";



const Root = () => {
    return (
        <div className="w-full">
            <Navbar/>
        
            <div className="min-h-[calc(100vh-160px)]">
            <div className="w-[90%] mx-auto">
            <Outlet/>

            </div>
            </div>
            <Subscription/>
            <Footer/>
        </div>
    );
};

export default Root;