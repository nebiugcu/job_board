import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import Img from "../assets/3407044.jpg";

const NavContentEmployer = ({ userInfo }) => {
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
    axios
      .post("http://localhost:8800/logout")
      .then((res) => {
        if (res.status === 200) {
          navigate("/login");
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log("Error logging out: ", err);
      });
  };
  return (
    <>
      <div className="flex justify-between items-center gap-x-80">
        <div>
          <ul className="flex justify-between gap-x-4">
            <li>
              <Link to="/posts">Job posts</Link>
            </li>
            <li>
              <Link to="/active-jobs">Active Jobs</Link>
            </li>
            <li>
              <Link to="/messages">Messages</Link>
            </li>
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
              <AvatarImage src={Img} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <span className=" text-lg font-bold">someone</span>
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
                <span
                  onClick={() => {
                    setProfileOpen(false);
                  }}
                >
                  <Link to="/hires">Hired Jobs</Link>
                </span>

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
