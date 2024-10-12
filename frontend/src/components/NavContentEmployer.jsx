import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";

const api_url = import.meta.env.VITE_API_URL;

const NavContentEmployer = ({ username, profile_pic, firstName, lastName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    window.addEventListener("mousedown", (event) => {
      if (profileRef.current && !profileRef.current?.contains(event.target))
        setProfileOpen(false);
    });
    return window.removeEventListener("mousedown", (event) => {
      if (profileRef.current && !profileRef.current?.contains(event.target)) {
        setProfileOpen(false);
      }
    });
  }, [profileRef]);

  const handleLogout = async () => {
    localStorage.clear();
    window.location.reload();
    navigate("/login");
    
  };
  return (
    <>
      <div className="flex justify-between items-center ml-52 gap-x-8">
        <div>
          <ul className="flex justify-between gap-x-10">
            <li>
              <Link to="/posts">Job posts</Link>
            </li>
            <li>
              <a href="http://127.0.0.1:8000/employer/candidate-match/">
                Find applicants
              </a>
            </li>
            {/* <li>
              <Link to="/active-jobs">Active Jobs</Link>
            </li>
            <li>
              <Link to="/messages">Messages</Link>
            </li> */}
          </ul>
        </div>
        <div>
          <div className="flex items-center justify-center gap-x-4 relative">
            <Avatar
              onClick={() => {
                setProfileOpen(!profileOpen);
              }}
              className="cursor-pointer"
            >
              <AvatarImage src={`${api_url}${profile_pic}`} />
              <AvatarFallback>
                {firstName[0]}
                {lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className=" text-lg font-bold">{username}</span>
            </div>
            {profileOpen && (
              <div
                ref={profileRef}
                className=" bg-[#3d7b4c] z-30 absolute top-[45px] right-0 text-slate-300 w-[150px] flex flex-col py-3 px-2 rounded-[7px]"
              >
                <span
                  onClick={() => {
                    setProfileOpen(false);
                  }}
                >
                  <Link to="/profile"> Profile</Link>
                </span>
                <span
                  onClick={() => {
                    setProfileOpen(false);
                  }}
                >
                  <Link to="/postjob">Post a job</Link>
                </span>
                {/* <span
                  onClick={() => {
                    setProfileOpen(false);
                  }}
                >
                  <Link to="/hires">Hired Jobs</Link>
                </span> */}

                <span
                  onClick={() => {
                    setProfileOpen(false);
                  }}
                >
                  <button onClick={handleLogout} to="/login">
                    Log out
                  </button>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavContentEmployer;
