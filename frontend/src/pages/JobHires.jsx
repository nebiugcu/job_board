import React, { useState, useEffect } from "react";
import axios from "axios";
import Hire from "@/components/Hire";
import { useNavigate } from "react-router-dom";

const JobHires = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [hires, setHires] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const clientId = userData
    ? userData.isLoggedIn && userData.userInfo.userData.Client_ID
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
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/hire/viewHired/${clientId}`
        );
        setHires(response.data);
        console.log("nahom");
        setLoading(false);
      } catch (e) {
        console.log(e);
        setError(e);
        setLoading(false);
      }
    };

    fetchJobs();
  }, [clientId]);

  if (!hires) {
    return (
      <>
        <div className="min-h-[70vh]">
          <div className="flex flex-col w-[70%] mx-auto shadow-sm shadow-slate-400 rounded-md p-4 m-4">
            No Hires Found
          </div>
        </div>
      </>
    );
  }
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
                <Hire
                  applicationId={hire.Application_ID}
                  hireDate={hire.Hire_Date}
                  completedDate={hire.Completed_Date}
                  rating={hire.Rating}
                  firstName={hire.FirstName}
                  lastName={hire.LastName}
                  jobTitle={hire.Job_Title}
                  jobDesc={hire.Job_Description}
                  profilePic={hire.Profile_Picture}
                  hireId={hire.Hire_ID}
                  paymentPaid={hire.isCompleted}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default JobHires;
