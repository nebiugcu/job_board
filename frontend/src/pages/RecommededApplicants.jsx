import React, { useEffect, useState } from "react";
import api from "../api";
import { useParams } from "react-router-dom";

const RecommededApplicants = () => {
  const { id } = useParams();
  const jobId = id;
  const [applicants, setApplicants] = useState([]);
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
      <div className="h-[90vh] ">
        <h1 className="text-xl font-bold w-[80%] mx-auto mb-5">
          Recommeded Applicants
        </h1>
        {applicants.length === 0 ? (
          <div className="flex flex-col w-[70%] mx-auto shadow-sm shadow-slate-400 rounded-md p-4 m-4">
            No Applicants yet for this job, to recommend!
          </div>
        ) : (
          <div className="flex gap-x-5 gap-y-2 justify-center items-center w-[90%] flex-wrap mx-auto">
            {applicants.map((applicant, index) => {
              return (
                <div
                  key={index}
                  className=" bg-slate-200 min-w-[40%] hover:scale-[1.05] duration-500 p-6 rounded-lg shadow-md shadow-slate-300 mb-6"
                >
                  <div className="flex flex-col gap-y-1 gap-x-1">
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
                        Match Percentage from skills:
                      </span>
                      : {applicant.job_seeker_match.match_percentage}%
                    </div>
                    <div>
                      {" "}
                      <span className="font-medium text-blue-800 text-lg ml-3">
                        Match based on resume:
                      </span>
                      : {applicant.resume_match.match_percentage}%
                    </div>
                    <div>
                      <span className="font-medium text-blue-800 text-lg ml-3">
                        Skills of Jobseeker:{" "}
                      </span>
                      {applicant.job_seeker.skills
                        .split(",")
                        .map((skill, index) => {
                          return <span key={index}>{skill} </span>;
                        })}
                    </div>
                    <div>
                      <span className="font-medium text-blue-800 text-lg ml-3">
                        skill Extracted from resume:{" "}
                      </span>
                      {applicant.resume_match.matched_skills.map(
                        (skill, index) => {
                          return <span key={index}>{skill} </span>;
                        }
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default RecommededApplicants;
