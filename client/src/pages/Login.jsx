import React, { useState } from "react";
import { assets } from "../assets/assets";

function login() {
  const [state, setState] = useState("Sign Up");

  return (
    <div className="flex justify-center items-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-100 to-purple-200">
      <img
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center ">{state === "Sign Up" ? "Create account" : "Login"}</h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "Create your account"
            : "Login to your account!"}
        </p>

        <form>
             <div className="mb-4 flex items-center gap-3  w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
               <img src={assets.person_icon} alt='' />
               <input className="text-white text-md rounded-full outline-none px-10 " type="text" placeholder="Full Name" required />
             </div>
             <div className="mb-4 flex items-center gap-3  w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
               <img src={assets.mail_icon} alt='' />
               <input className="text-white text-md rounded-full outline-none px-10 " type="email" placeholder="E-mail" required />
             </div>
             <div className="mb-4 flex items-center gap-3  w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
               <img src={assets.lock_icon} alt='' />
               <input className="text-white text-md rounded-full outline-none px-10" type="password" placeholder="Password" required />
             </div>
             <div className="flex justify-center">
               <button className="bg-blue-600 px-10 py-2 text-indigo-100 rounded-full ">Submit</button>
               </div>


        </form>
      </div>
    </div>
  );
}

export default login;
