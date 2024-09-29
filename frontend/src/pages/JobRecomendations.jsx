import React, { useEffect, useState } from "react";
import api from "../api";
import { useParams } from "react-router-dom";

const JobRecomendations = () => {
  const [jobs, setJobs] = useState(null);
  const { id } = useParams();
  const job_seeker_id = id;
  useEffect(() => {
    console.log("id", job_seeker_id);
    api
      .get(`/recommendations/${job_seeker_id}/`)
      .then((res) => {
        console.log("%cRecommended Jobs!", "color: green; font-size: 16px;");
        console.log(res.data);
        setJobs(res.data);
      })
      .catch((err) => {
        console.log("%cRecommended Jobs!", "color: yellow; font-size: 16px;");
        console.log(err);
      });
  }, []);
  return (
    <div className="h-[90vh]">
      <h1 className="text-xl font-bold w-[70%] mx-auto mb-5">
        Recommeded Jobs
      </h1>
      {jobs &&
        jobs.map((job, index) => {
          return (
            <div
              key={index}
              className=" bg-slate-200 w-[80%] p-6 rounded-lg shadow-sm shadow-slate-600 mx-auto mb-6"
            >
              <div className="flex gap-y-1 gap-x-1">
                <div>
                  <span className=" font-medium text-blue-800 text-lg ml-3">
                    Employer
                  </span>
                  : {job.employer_firstname} {job.employer_lastname}
                </div>
                <div>
                  <span className="font-medium text-blue-800 text-lg ml-3">
                    Job Title
                  </span>
                  : {job.job_title}
                </div>
                <div>
                  <span className="font-medium text-blue-800 text-lg ml-3">
                    Job Description
                  </span>
                  : {job.job_description}
                </div>
                <div>
                  {" "}
                  <span className="font-medium text-blue-800 text-lg ml-3">
                    Match Percentage
                  </span>
                  : {job.match_percentage}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default JobRecomendations;
