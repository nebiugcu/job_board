import { useState, useEffect } from "react";
import axios from "axios";
import ActiveJob from "@/components/ActiveJob";
import { useNavigate } from "react-router-dom";

const ActiveJobs = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);

  const clientId = userData?.isLoggedIn
    ? userData.userInfo.userData.Client_ID
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
    if (!clientId) return;

    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/job/ActiveJobs/${clientId}`
        );
        setJobs(response.data); // Assuming response.data is an array of jobs
        setLoading(false);
      } catch (e) {
        console.log(e);
        setError(e);
        setLoading(false);
      }
    };

    fetchJobs();
  }, [clientId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="h-[70vh]">
      {jobs.length === 0 ? (
        <div className="flex flex-col w-[70%] mx-auto shadow-sm shadow-slate-400 rounded-md p-4 m-4">
          No Active Jobs found.
        </div>
      ) : (
        jobs.map((job, index) => (
          <div key={index}>
            <ActiveJob
              hireId={job.Hire_ID}
              jobTitle={job.Job_Title}
              jobDesc={job.Job_Description}
              jobCat={job.Job_Category}
              firstName={job.Freelancer_FirstName}
              lastName={job.Freelancer_LastName}
              profilePic={job.Profile_Picture}
              profession={job.Profession}
              coverLetter={job.Cover_Letter}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default ActiveJobs;
