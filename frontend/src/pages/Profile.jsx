import { useState, useEffect } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [hires, setHires] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState([]);

  const userData = {
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

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:8800/check")
      .then((res) => {
        console.log(res.data);
        setUserInfo(res.data);
        if (!res.data.isLoggedIn) {
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    console.log(userData.freelancerId, "akdjf;lakeoieakdj");
    axios
      .get(`http://localhost:8800/api/hire/see-rating/${userData.freelancerId}`)
      .then((res) => {
        console.log(res.data);
        setRating(
          res.data.map((rate) => {
            if (rate.Rating === null) {
              return 0;
            } else {
              return parseInt(rate.Rating);
            }
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    console.log("nahmm");
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/hire/view-contracts/${userData.freelancerId}`
        );
        setHires(response.data);
        console.log("nahom");
        console.log(response.data);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setError(e);
        setLoading(false);
      }
    };

    fetchJobs();
  }, [userData.freelancerId]);

  return (
    <div className="flex flex-col gap-y-7 mx-auto w-[80%] mb-10 min-h-[65vh]">
      <div className="flex gap-x-5 mx-auto w-full">
        <div className="flex flex-col w-[70%] rounded-md overflow-hidden shadow-lg shadow-slate-400">
          <div className="bg-[#57CC99] h-[200px]"></div>
          <div className=" px-6 py-5 relative">
            <div className="absolute -top-[57px] bg-[#d1e5df] w-[107px] h-[107px] flex justify-center items-center rounded-full">
              <div className="w-[100px] h-[100px] bg-sky-600 overflow-hidden rounded-full">
                <Avatar className="cursor-pointer w-full h-full">
                  <AvatarImage
                    src={`http://localhost:8800/images/${userData.profilePic}`}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div className="mt-[60px]">
              <h1 className="text-xl font-semibold">
                {userData.firstName} {userData.lastName}
              </h1>
              <p>{userData.profession}</p>
              <div>
                {!userData.isClient
                  ? rating.length === 0
                    ? `Rating: 0`
                    : `Rating: ${(
                        rating.reduce((acc, rate) => {
                          return (acc += rate);
                        }, 0) / rating.length
                      ).toFixed(2)}`
                  : ""}
              </div>
              <div className=" mt-4">
                <h3 className="font-semibold text-lg">About</h3>
                <p>
                  {userData.isClient
                    ? userData.clientType === "Private"
                      ? "I am a private client"
                      : "We're a business organization"
                    : `${userData.bio}`}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[30%] h-[400px] rounded-md shadow-lg p-4 shadow-slate-400">
          <div>
            <div className="flex justify-between border-b-[1px] border-slate-200">
              <h3 className="font-semibold text-lg">Contact Info</h3>
              <span>Add</span>
            </div>
            <div className="h-[150px] mt-4">
              {" "}
              <span className="font-semibold">Email:</span> {userData.email}
            </div>
          </div>
          {!userData.isClient && (
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
          )}
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
