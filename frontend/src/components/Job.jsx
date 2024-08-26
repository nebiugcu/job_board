import React from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { formatDistanceToNow, parseISO, format } from "date-fns";
import { Button } from "@/components/ui/button";

const Job = ({
  jobTitle,
  clientName,
  postedAt,
  locatedAt,
  jobDescription,
  jobCategory,
  jobSite,
  jobType,
  salary,
  experience,
  deadline,
  jobId,
  gender,
  freelancerId,
  isLoggedIn,
}) => {
  const navigate = useNavigate();
  const job = {
    jobId: jobId,
    jobTitle: jobTitle,
    clientName: clientName,
    postedAt: postedAt,
    locatedAt: locatedAt,
    jobDescription: jobDescription,
    jobCategory: jobCategory,
    jobSite: jobSite,
    jobType: jobType,
    salary: salary,
    experience: experience,
    deadline: deadline,
    gender: gender,
  };

  const applicationDatePassed = () => {
    const applicationDate = new Date(deadline);
    const currentDate = new Date();
    if (currentDate > applicationDate) {
      return true;
    } else {
      return false;
    }
  };

  const goToApplication = (job) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    const data = {
      jobId: jobId,
      freelancerId: freelancerId,
    };
    if (applicationDatePassed()) {
      alert("Sorry, Application date has passed!!");
    } else {
      axios
        .post(`http://localhost:8800/api/apply/check-applicant`, data)
        .then((res) => {
          console.log(res.data);
          if (res.data.isApplied) {
            alert("You have already applied to this job");
          } else {
            navigate("/application", { state: { job: job } });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  // const location = useLocation();
  // console.log(location);
  return (
    <div className="flex flex-col gap-y-4 border-b-[1px] border-slate-300 py-6 mb-4 px-5 font-mono hover:bg-slate-100 duration-75">
      {/* Job Title */}
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl">{jobTitle}</h1>
        <div>
          {applicationDatePassed() && (
            <>
              <div className=" bg-red-400/70 px-4 py-1 text-white rounded-full shadow-md shadow-red-600">
                expired
              </div>
            </>
          )}
        </div>
      </div>
      {/* Job related Info-1 */}
      <div className="flex gap-x-8">
        <span className="text-sm text-slate-500 font-medium">{clientName}</span>
        <span className="text-sm text-slate-500 font-medium">
          {formatDistanceToNow(parseISO(postedAt), { addSuffix: true })}
        </span>
        <span className="text-sm text-slate-500 font-medium">{locatedAt}</span>
      </div>
      {/* Job Description */}
      <div className="font-mono font-medium">
        <h3>Job Description:</h3>
        <p className="">{jobDescription}</p>
      </div>
      {/* Job related Info-2 */}
      <div className="flex gap-x-5">
        {/* Job category */}
        <div className=" bg-slate-200 px-2 py-1 rounded-full">
          {jobCategory}
        </div>
        {/* Job type and Job site */}
        <div className=" bg-slate-200 px-2 py-1 rounded-full">
          {`${jobSite} - ${jobType}`}
        </div>
        <div className=" bg-slate-200 px-2 py-1 rounded-full">
          Gender - {gender === "" ? "both" : gender}
        </div>
      </div>
      {/* Job related Info-3 */}
      <div className="flex justify-between">
        {/* Job Payment type */}
        <div className="flex flex-col">
          <span className=" text-slate-500">Monthly</span>
          <span>${salary}</span>
        </div>
        {/* Experience level */}
        <div className="flex flex-col">
          <span className=" text-slate-500">Expenrence level</span>
          <span>{experience ? experience : "intermidiate"}</span>
        </div>
        {/* Application Deadline */}
        <div className="flex flex-col">
          <span className=" text-slate-500">Application Deadline</span>
          <span>{format(parseISO(deadline), "MMMM dd, yyyy")}</span>
        </div>
        {/* Apply button */}

        <Button
          onClick={() => goToApplication(job)}
          className={`${
            location.pathname === "/jobs" ? "bg-[#38A3A5]" : "bg-red-500"
          } px-4 w-[250px]`}
        >
          {location.pathname === "/jobs" ? "Apply" : "Delete Job"}
        </Button>
      </div>
    </div>
  );
};

export default Job;
