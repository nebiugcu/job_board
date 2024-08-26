import React, { useState, useEffect } from "react";
import axios from "axios";
import Contract from "@/components/Contract";
import { useNavigate } from "react-router-dom";

const Contracts = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [hires, setHires] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const freelancerId = userData
    ? userData.isLoggedIn && userData.userInfo.userData.Freelancer_ID
    : null;

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:8800/check")
      .then((res) => {
        console.log(res.data);
        setUserData(res.data);
        if (!res.data.isLoggedIn) {
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    console.log("nahmm", freelancerId);
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/hire/view-contracts/${freelancerId}`
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
  }, [freelancerId]);
  return (
    <div className="min-h-[70vh]">
      <div className="flex flex-col w-[70%] mx-auto shadow-sm shadow-slate-400 rounded-md p-4 m-4">
        {hires.length === 0 ? (
          <div className="flex flex-col w-[70%] mx-auto shadow-sm shadow-slate-400 rounded-md p-4 m-4">
            No Active Jobs found.
          </div>
        ) : (
          hires.map((hire, index) => {
            return (
              <div key={index}>
                <Contract
                  applicationId={hire.Application_ID}
                  hireDate={hire.Hire_Date}
                  completedDate={hire.Completed_Date}
                  rating={hire.Rating}
                  firstName={hire.FirstName}
                  lastName={hire.LastName}
                  jobTitle={hire.Job_Title}
                  jobDesc={hire.Job_Description}
                  profilePic={hire.Profile_Picture}
                  isPaid={hire.isCompleted}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Contracts;
