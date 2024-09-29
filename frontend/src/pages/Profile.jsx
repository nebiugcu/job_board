import { useState, useEffect } from "react";
import axios from "axios";
import api from "../api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

const api_url = import.meta.env.VITE_API_URL;

const Profile = ({ userInfo, setAccessAgain }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(userInfo);
  const [jobSeekerData, setJobSeekerData] = useState({
    user: {
      first_name: userInfo.firstName,
      last_name: userInfo.lastName,
      email: userInfo.email,
      username: userInfo.name,
    },
    profession: userInfo.profession,
    bio: userInfo.bio,
    skills: userInfo.skills,
  });

  const [employerData, setEmployerData] = useState({
    user: {
      first_name: userInfo.firstName,
      last_name: userInfo.lastName,
      email: userInfo.email,
      username: userInfo.name,
    },
    client_type: userInfo.client_type,
  });
  // const [hires, setHires] = useState([]);
  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [rating, setRating] = useState([]);

  const userData2 = {
    firstName: userInfo
      ? userInfo.isLoggedIn && userInfo.userInfo.userData.FirstName
      : null,
    lastName: userInfo
      ? userInfo.isLoggedIn && userInfo.userInfo.userData.LastName
      : null,
    profession: userInfo
      ? userInfo.isLoggedIn && userInfo.userInfo.userData.Proffession
      : null,
    bio: userInfo
      ? userInfo.isLoggedIn && userInfo.userInfo.userData.Bio
      : null,
    profilePic: userInfo
      ? userInfo.isLoggedIn && userInfo.userInfo.userData.Profile_Picture
      : null,
    email: userInfo
      ? userInfo.isLoggedIn && userInfo.userInfo.userData.Email
      : null,
    isClient: userInfo
      ? userInfo.isLoggedIn && userInfo.userInfo.isClient
      : null,
    freelancerId: userInfo
      ? userInfo.isLoggedIn && userInfo.userInfo.userData.Freelancer_ID
      : null,
    resume: userInfo
      ? userInfo.isLoggedIn && userInfo.userInfo.userData.Resume
      : null,
    clientType: userInfo
      ? userInfo.isLoggedIn && userInfo.userInfo.userData.Client_Type
      : null,
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    console.log(refreshToken);
    try {
      const res = await api.post("/api/token/refresh", {
        refresh: refreshToken,
      });
      console.log("refresh token");
      console.log(res);
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        // setIsAuthorized(true);
      } else {
        // setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      // setIsAuthorized(false);
    }
  };

  axios.defaults.withCredentials = true;
  useEffect(() => {
    console.log("%cUserInfo!", "color: blue; font-size: 14px");
    // console.log(`${api_url}${userInfo.profile_picture}`);
    console.log(userInfo);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (userInfo.is_employer) {
      if (name in employerData.user) {
        setEmployerData({
          ...employerData,
          user: { ...employerData.user, [name]: value },
        });
      } else {
        setEmployerData({
          ...employerData,
          [name]: value,
        });
      }
      console.log(employerData);
    } else {
      if (name in jobSeekerData.user) {
        setJobSeekerData({
          ...jobSeekerData,
          user: { ...jobSeekerData.user, [name]: value },
        });
      } else {
        setJobSeekerData({
          ...jobSeekerData,
          [name]: value,
        });
      }
      console.log(jobSeekerData);
      // refreshToken();
      // window.location.reload();
    }
  };

  const handleLogout = async () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  const updateProfile = async () => {
    try {
      if (userInfo.is_employer) {
        const response = await api.post(
          `/employer/${userInfo.employer_id}/update/`,
          employerData
        );
        console.log("Employer updated", response.data);

        setAccessAgain();
        handleLogout();
        // window.location.reload();
      } else {
        const response = await api.patch(
          `/jobseeker/${userInfo.job_seeker_id}/update/`,
          jobSeekerData
        );
        console.log("Jobseeker updated", response);
        setAccessAgain();
        handleLogout();
        // window.location.reload();
      }
    } catch (error) {
      console.log("Error updating profile", error.response.data);
    }
  };

  return (
    <div className="flex flex-col gap-y-7 mx-auto w-[80%] mb-10 min-h-[65vh]">
      <div className="flex gap-x-5 mx-auto w-full">
        <div className="flex flex-col w-[70%] rounded-md overflow-hidden shadow-lg shadow-slate-400">
          <div className="bg-[#57CC99] h-[200px] flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <div className="p-2 h-[30px] flex justify-center items-center cursor-pointer text-lg text-white rounded-md bg-blue-500/60">
                  {" "}
                  <span className="font-semibold">Edit Profile</span>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] md:max-w-[700px] bg-sky-200/90">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>Update your profile.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      First Name:
                    </Label>
                    <Input
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      name="first_name"
                      value={
                        userInfo.is_employer
                          ? employerData.user.first_name
                          : jobSeekerData.user.first_name
                      }
                      id="name"
                      placeholder=""
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Last Name:
                    </Label>
                    <Input
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      name="last_name"
                      value={
                        userInfo.is_employer
                          ? employerData.user.last_name
                          : jobSeekerData.user.last_name
                      }
                      id="name"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="desc" className="text-right">
                      Email
                    </Label>
                    <Input
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      name="email"
                      value={
                        userInfo.is_employer
                          ? employerData.user.email
                          : jobSeekerData.user.email
                      }
                      id="name"
                      type="email"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Username:
                    </Label>
                    <Input
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      name="username"
                      value={
                        userInfo.is_employer
                          ? employerData.user.username
                          : jobSeekerData.user.username
                      }
                      id="name"
                      className="col-span-3"
                    />
                  </div>
                  {userInfo.is_job_seeker && (
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="salary" className="text-right">
                          Bio:
                        </Label>
                        <Input
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          name="bio"
                          value={jobSeekerData.bio}
                          id="salary"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="location" className="text-right">
                          Proffession:
                        </Label>
                        <Input
                          name="profession"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          value={jobSeekerData.profession}
                          id="location"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="location" className="text-right">
                          Skills:
                        </Label>
                        <Input
                          name="skills"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          value={jobSeekerData.skills}
                          id="location"
                          className="col-span-3"
                        />
                      </div>
                    </>
                  )}
                  {userInfo.is_employer && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="location" className="text-right">
                        Client Type:
                      </Label>
                      <Input
                        name="client_type"
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        value={employerData.client_type}
                        id="location"
                        className="col-span-3"
                      />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button onClick={updateProfile} type="submit">
                    Update Profile
                  </Button>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className=" px-6 py-5 relative">
            <div className="absolute -top-[57px] bg-[#d1e5df] w-[107px] h-[107px] flex justify-center items-center rounded-full">
              <div className="w-[100px] h-[100px] bg-sky-600 overflow-hidden rounded-full">
                <Avatar className="cursor-pointer w-full h-full">
                  <AvatarImage src={`${api_url}${userInfo.profile_picture}`} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div className="mt-[60px]">
              <h1 className="text-2xl font-semibold">
                {userInfo.firstName} {userInfo.lastName}
              </h1>
              {userInfo.is_employer ? (
                <p>Employer Type: {userInfo.client_type}</p>
              ) : (
                <p className="text-lg">{userInfo.profession}</p>
              )}
              {/* <div>
                {!userData.isClient
                  ? rating.length === 0
                    ? `Rating: 0`
                    : `Rating: ${(
                        rating.reduce((acc, rate) => {
                          return (acc += rate);
                        }, 0) / rating.length
                      ).toFixed(2)}`
                  : ""}
              </div> */}
              <div className=" mt-4">
                <h3 className="font-semibold text-lg">About</h3>
                <p>
                  {userInfo.is_employer
                    ? `${userInfo.client_type}`
                    : `${userInfo.bio}`}
                </p>
                {userInfo.is_job_seeker && (
                  <>
                    <h1 className="font-medium mt-3">Skills</h1>
                    <p>{userInfo.skills}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-[30%] h-[200px] rounded-md shadow-lg p-4 shadow-slate-400">
          <div>
            <div className="flex justify-between border-b-[1px] border-slate-200">
              <h3 className="font-semibold text-lg">Account Information</h3>
            </div>
            <div className="h-[150px] mt-4">
              {" "}
              <span className="font-semibold">Email:</span> {userInfo.email}
            </div>
          </div>
          {/* {!userData.isClient && (
            <>
              <div className="flex justify-between border-b-[1px] border-slate-200">
                <h3 className="font-semibold text-lg">Portfolio and Resume</h3>
                <span>Add</span>
              </div>
              <div className="flex items-center gap-x-4 mt-5">
                <span>Download my Resume:</span>
                <a
                  href={`http://localhost:8800/images/${userData.resume}`}
                  target="_blank"
                  download="myfile.pdf"
                >
                  <FileDown />
                </a>
              </div>
            </>
          )} */}
        </div>
      </div>

      {/* <div className="w-[70%] rounded-md px-6 py-5 overflow-hidden shadow-lg shadow-slate-400">
        <div className="flex justify-between h-[150px] border-b-[1px] border-slate-200">
          <h3 className="font-semibold text-lg">Skills</h3>
          <span>Add</span>
        </div>
        <div className="flex justify-between h-[150px] border-b-[1px] border-slate-200">
          <h3 className="font-semibold text-lg">Services</h3>
          <span>Add</span>
        </div>
        <div className="flex justify-between h-[150px] border-b-[1px] border-slate-200">
          <h3 className="font-semibold text-lg">Work Experience</h3>
          <span>Add</span>
        </div>
        <div className="flex justify-between h-[150px] border-b-[1px] border-slate-200">
          <h3 className="font-semibold text-lg">Education</h3>
          <span>Add</span>
        </div>
        <div className="flex justify-between h-[150px] border-b-[1px] border-slate-200">
          <h3 className="font-semibold text-lg">
            Previous Work Experience on this platform
          </h3>
          <span>Add</span>
        </div>
      </div> */}
    </div>
  );
};

export default Profile;
