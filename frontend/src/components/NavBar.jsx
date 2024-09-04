import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProtectedRoute from "./ProtectedRoute";
import NavContent from "./NavContent";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(true); // made this change but it should be null
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  // const currentUser = undefined;

  // axios.defaults.withCredentials = true;
  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8800/check")
  //     .then((res) => {
  //       console.log(res.data);
  //       setUserData(res.data);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  // useEffect(() => {
  //   window.addEventListener("mousedown", (event) => {
  //     if (profileRef.current && !profileRef.current?.contains(event.target))
  //       setProfileOpen(false);
  //   });
  //   return window.removeEventListener("mousedown", (event) => {
  //     if (profileRef.current && !profileRef.current?.contains(event.target)) {
  //       setProfileOpen(false);
  //     }
  //   });
  // }, [profileRef]);

  // const handleLogout = async () => {
  //   axios
  //     .post("http://localhost:8800/logout")
  //     .then((res) => {
  //       if (res.status === 200) {
  //         navigate("/login");
  //         window.location.reload();
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("Error logging out: ", err);
  //     });
  // };

  // const currentUser = {
  //   id: 1,
  //   userName: "Nahom",
  //   isClient: userData
  //     ? userData.isLoggedIn && userData.userInfo.isClient
  //     : false,
  // };

  // if (currentUser.isClient) {
  //   if (location.pathname == "/") {
  //     navigate("/posts");
  //   }
  // } else {
  //   if (location.pathname == "/") {
  //     navigate("/jobs");
  //   }
  // }

  return (
    <div className=" bg-[#22577A] py-2 mb-10">
      <div className="flex w-full px-3 md:w-[80%] mx-auto justify-between items-center text-white">
        <div className="text-2xl font-bold font-mono w-[20%]">
          <Link to="/">Career Catalyst</Link>
        </div>
        <div>
          <ProtectedRoute>
            <NavContent />
          </ProtectedRoute>
        </div>

        {location.pathname == "/" ||
          location.pathname == "/login" ||
          (location.pathname == "/register" && (
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
          ))}
      </div>
    </div>
  );
};

export default NavBar;
