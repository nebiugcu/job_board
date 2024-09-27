import React, { useEffect, useState } from "react";
import api from "../api";
import { useParams } from "react-router-dom";

const RecommededApplicants = () => {
  const { id } = useParams();
  const jobId = id;
  const [applicants, setApplicants] = useState(null);
  useEffect(() => {
    api
      .get(`/recommend-applicants/${jobId}/`)
      .then((res) => {
        console.log("%cRecommended Jobs!", "color: green; font-size: 16px;");
        console.log(res.data);
        setApplicants(res.data);
      })
      .catch((err) => {
        console.log("%cRecommended Jobs!", "color: yellow; font-size: 16px;");
        console.log(err);
      });
  }, []);

  return (
    <>
      <div className="h-[70vh] ">
        <h1 className="text-xl font-bold w-[80%] mx-auto mb-5">
          Recommeded Jobs
        </h1>
        {applicants &&
          applicants.map((applicant, index) => {
            return (
              <div
                key={index}
                className=" bg-slate-200 w-[80%] p-6 rounded-lg shadow-sm shadow-slate-600 mx-auto mb-6"
              >
                <div className="flex gap-y-1 gap-x-1">
                  <div>
                    <span className=" font-medium text-blue-800 text-lg ml-3">
                      JobSeeker
                    </span>
                    : {applicant.job_seeker.first_name}{" "}
                    {applicant.job_seeker.last_name}
                  </div>
                  <div>
                    <span className="font-medium text-blue-800 text-lg ml-3">
                      Cover Letter
                    </span>
                    : {applicant.cover_letter}
                  </div>

                  <div>
                    {" "}
                    <span className="font-medium text-blue-800 text-lg ml-3">
                      Match Percentage
                    </span>
                    : {applicant.job_seeker.match_percentage}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default RecommededApplicants;
