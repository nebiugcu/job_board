import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(true); // made this change but it should be null
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  // const currentUser = undefined;

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:8800/check")
      .then((res) => {
        console.log(res.data);
        setUserData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

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

  const currentUser = {
    id: 1,
    userName: "Nahom",
    isClient: userData
      ? userData.isLoggedIn && userData.userInfo.isClient
      : false,
  };

  if (currentUser.isClient) {
    if (location.pathname == "/") {
      navigate("/posts");
    }
  } else {
    if (location.pathname == "/") {
      navigate("/jobs");
    }
  }

  return (
    <div className=" bg-[#22577A] py-2 mb-10">
      <div className="flex w-full px-3 md:w-[80%] mx-auto justify-between items-center text-white">
        <div className="text-2xl font-bold font-mono">
          <Link to="/">Carrer Catalysts</Link>
        </div>
        {userData ? (
          userData.isLoggedIn ? (
            <div>
              <ul className="flex justify-between gap-x-4">
                {!currentUser && (
                  <li className="">
                    <Link to="/jobs">Explore Jobs</Link>
                  </li>
                )}
                {currentUser ? (
                  currentUser.isClient ? (
                    <>
                      <li>
                        <Link to="/posts">Job posts</Link>
                      </li>
                      <li>
                        <Link to="/active-jobs">Active Jobs</Link>
                      </li>
                      <li>
                        <Link to="/messages">Messages</Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link to="/jobs">Explore Jobs</Link>
                      </li>
                      <li>
                        <Link to="/applications">Applications</Link>
                      </li>
                      <li>
                        <Link to="/messages">Messages</Link>
                      </li>
                    </>
                  )
                ) : (
                  <>
                    <li>About Us</li>
                  </>
                )}
              </ul>
            </div>
          ) : (
            <>
              <div>
                <Link to="/jobs">Explore Jobs</Link>
              </div>
            </>
          )
        ) : (
          <></>
        )}
        {userData ? (
          userData.isLoggedIn ? (
            <div>
              {currentUser ? (
                <>
                  <div className="flex items-center justify-center gap-x-4 relative">
                    <Avatar
                      onClick={() => {
                        setProfileOpen(!profileOpen);
                      }}
                      className="cursor-pointer"
                    >
                      <AvatarImage
                        src={`http://localhost:8800/images/${userData.userInfo.userData.Profile_Picture}`}
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className=" text-lg font-bold">
                        {userData.userInfo.userData.Username}
                      </span>
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
                        {currentUser.isClient ? (
                          <>
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
                          </>
                        ) : (
                          <span
                            onClick={() => {
                              setProfileOpen(false);
                            }}
                          >
                            <Link to="/contracts">My Contracts</Link>
                          </span>
                        )}
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
                </>
              ) : (
                <>
                  <Link to="/login">
                    <button className="bg-[#38A3A5] px-4 py-1 rounded-full mr-3 font-medium">
                      Log in
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="bg-[#38A3A5] px-4 py-1 rounded-full mr-3 font-medium">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="flex justify-evenly gap-x-4 items-center">
                <Link to="/login">
                  <button className="bg-green-600 text-white text-lg font-semibold px-4 py-2 rounded-md">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="bg-blue-600 text-white text-lg font-semibold px-4 py-2 rounded-md">
                    Register
                  </button>
                </Link>
              </div>
            </>
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default NavBar;
