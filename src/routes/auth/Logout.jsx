import {useEffect, useState} from "react";

function Logout() {

    useEffect(() => {
        if(localStorage.getItem("token")) {
            localStorage.clear();
            window.location.href = "/home";
            return;
        }
    }, []);

    return (
        <div className={"bg-[#1e1e1e] text-white h-screen flex justify-center items-center"}>
        </div>
    );
}

export default Logout;