import Job from "@/components/ClientJob";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Posts = () => {
  const [allClientJobs, setAllClientJobs] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const clientId = userData
    ? userData.isLoggedIn && userData.userInfo.userData.Client_ID
    : null;
  const clientName = userData
    ? userData.isLoggedIn && userData.userInfo.userData.Username
    : null;
  console.log(clientId);
  console.log(clientName);

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
    api
      .get(`/employer/jobs/`)
      .then((res) => {
        console.log(res.data);
        setAllClientJobs(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [clientId]);
  return (
    <div className="min-h-[70vh]">
      <div className="flex flex-col w-[80%] mx-auto">
        <div className="rounded-md mb-5 shadow-sm shadow-slate-700">
          {allClientJobs.length === 0 ? (
            <div className="flex flex-col w-[70%] mx-auto shadow-sm shadow-slate-400 rounded-md p-4 m-4">
              No Active Jobs found.
            </div>
          ) : (
            allClientJobs
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
              .map((job, index) => {
                return (
                  <div key={index}>
                    <Job
                      jobTitle={job.job_title}
                      clientName={job.id}
                      postedAt={job.created_at}
                      locatedAt={job.location}
                      jobDescription={job.job_description}
                      jobCategory={job.job_category}
                      jobSite={job.job_site}
                      jobType={job.job_type}
                      salary={job.salary}
                      experience={job.experience_level}
                      deadline={job.application_deadline}
                      jobId={job.id}
                      gender={job.applicants_needed}
                    />
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts;
