import SingleApplied from "@/components/SingleApplied";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const JobsApplied = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [jobsApplied, setJobsApplied] = useState([]);
  const freelancerId = userInfo
    ? userInfo.isLoggedIn && userInfo.userInfo.userData.Freelancer_ID
    : null;
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:8800/check")
      .then((res) => {
        setUserInfo(res.data);
        if (!res.data.isLoggedIn) {
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (freelancerId) {
      axios
        .get(`http://localhost:8800/api/apply/get-applications/${freelancerId}`)
        .then((res) => {
          console.log(res.data);
          setJobsApplied(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [freelancerId]);

  return (
    <div className="flex flex-col min-h-[70vh]">
      {jobsApplied.length !== 0 ? (
        jobsApplied.map((job, index) => {
          return (
            <div key={index}>
              <SingleApplied
                jobTitle={job.Job_Title}
                clientName={job.Username}
                coverLetter={job.Cover_Letter}
                applicationId={job.Application_ID}
                status={job.status}
              />
            </div>
          );
        })
      ) : (
        <>
          <div className="min-h-[70vh]">
            <div className="flex flex-col w-[70%] mx-auto shadow-sm shadow-slate-400 rounded-md p-4 m-4">
              You haven&apos;t applied yet.
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default JobsApplied;
