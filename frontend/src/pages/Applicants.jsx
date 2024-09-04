import { useState, useEffect } from "react";
import axios from "axios";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import Applicant from "@/components/Applicant";

const Applicants = () => {
  const navigate = useNavigate();
  // const [userInfo, setUserInfo] = useState(null);
  const [jobApplicants, setJobApplicants] = useState([]);
  const [userData, setUserData] = useState(null);
  const { id } = useParams();
  const jobId = id;
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:8800/check")
      .then((res) => {
        setUserData(res.data);
        if (!res.data.isLoggedIn) {
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    api
      .get(`/employer/applications/${jobId}/`)
      .then((res) => {
        console.log(res.data);
        setJobApplicants(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [jobId]);
  console.log(jobApplicants);
  return (
    <div className="min-h-[70vh]">
      {jobApplicants.length !== 0 ? (
        jobApplicants.map((applicant, index) => {
          return (
            <div key={index}>
              <Applicant
                applicationId={applicant.id}
                applicationStatus={applicant.status}
                freelancerId={applicant.Freelancer_ID}
                freelancerFirstName={applicant.FirstName}
                freelancerLastName={applicant.LastName}
                profession={applicant.Proffession}
                profilePic={applicant.Profile_Picture}
                coverLetter={applicant.cover_letter}
                jobTitle={applicant.job_title}
                email={applicant.Email}
                username={applicant.Username}
                bio={applicant.Bio}
                resume={applicant.resume}
              />
            </div>
          );
        })
      ) : (
        <>
          <div className="min-h-[70vh]">
            <div className="flex flex-col w-[70%] mx-auto shadow-sm shadow-slate-400 rounded-md p-4 m-4">
              No Applicants for this job.
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Applicants;
