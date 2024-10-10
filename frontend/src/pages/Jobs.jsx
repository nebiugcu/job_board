import React, { forwardRef, useEffect, useState } from "react";
import axios from "axios";
import api from "../api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Job from "../components/Job";
import { useNavigate } from "react-router-dom";
import backImg from "../assets/3407044.jpg";
import ProtectedRoute from "@/components/ProtectedRoute";

const Jobs = () => {
  const navigate = useNavigate();
  const [allJobs, setAllJobs] = useState([]);
  const [searchedJob, setSearchedJob] = useState("");
  const [userData, setUserData] = useState(null);
  const [displayedJobs, setDisplayedJobs] = useState([]);
  const [displayLimit, setDisplayLimit] = useState(5);
  const [displayBtn, setDisplayBtn] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // const freelancerId = userData
  //   ? userData.isLoggedIn && userData.userInfo.userData.Freelancer_ID
  //   : null;
  // const isLoggedIn = userData ? (userData.isLoggedIn ? true : false) : false;
  // console.log(freelancerId);

  // axios.defaults.withCredentials = true;
  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8800/check")
  //     .then((res) => {
  //       console.log(res.data);
  //       setUserData(res.data);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);
  useEffect(() => {
    // api
    //   .get("/recommendations/8/")
    //   .then((res) => {
    //     console.log("%cRecommended Jobs!", "color: green; font-size: 16px;");
    //     console.log(res.data);
    //   })
    //   .catch((err) => {
    //     console.log("%cRecommended Jobs!", "color: yellow; font-size: 16px;");
    //     console.log(err);
    //   });
    api
      .get("/jobs/")
      .then((res) => {
        console.log(res.data);
        setAllJobs(res.data);
        setDisplayedJobs(res.data.slice(0, displayLimit));
        setDisplayBtn(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const LoadMoreJobs = () => {
    setDisplayLimit(allJobs.length); // Set the display limit to the length of the jobs array
    setDisplayedJobs(allJobs);
    setDisplayBtn(false);
  };

  const clickHandler = () => {
    const searchedJobs = allJobs.filter((job) => {
      return job.Job_Category == searchedJob;
    });
    setDisplayedJobs(searchedJobs);
  };

  const handleChange = (e) => {
    setSearchedJob(e.target.value);
    axios
      .get("http://localhost:8800/api/job/all-jobs")
      .then((res) => {
        console.log(res.data);
        console.log("nahom");
        setDisplayedJobs(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleFilter = () => {
    const filteredJobs = allJobs;
  };
  return (
    <div className="py-20 h-fit overflow-y-scroll">
      <div className="flex gap-x-14 px-10 justify-center">
        {/* Filtering sidebar */}
        <div
          // style={{
          //   backgroundImage: `url(${backImg})`,
          //   backgroundPosition: "10% 0%",
          //   backgroundSize: "700px",
          // }}
          className="w-[20%] h-[800px] p-5 shadow-md shadow-slate-500 rounded-lg"
        >
          <div className="font-semibold font-mono text-3xl mt-10 text-black">
            Search For Jobs based on your interest.
          </div>
          <div>
            <div className="mt-10 text-2xl font-mono font-bold pt-4 border-t-8 mb-2">
              Helpful Resources
            </div>
            <div className="flex flex-col gap-y-5">
              <p>
                <a
                  className="text-blue-500 text-xl"
                  href="https://www.linkedin.com/interview-prep/"
                  target="_blank"
                >
                  Interview Preparation
                </a>
              </p>
              <p>
                <a
                  className="text-blue-500 text-xl"
                  href="https://www.canva.com/resume/templates/"
                  target="_blank"
                >
                  Resume Building
                </a>
              </p>
              <p>
                <a
                  className="text-blue-500 text-xl"
                  href="https://www.careeronestop.org/JobSearch/Plan/career-counselor.aspx"
                  target="_blank"
                >
                  Career Counseling
                </a>
              </p>
              <p>
                <a
                  className="text-blue-500 text-xl"
                  href="https://www.coursera.org/browse/personal-development"
                  target="_blank"
                >
                  Skills Development Courses
                </a>
              </p>
            </div>
          </div>
          {/* Filter and clear buttons */}
          {/* <div>
            <div className="text-[#22577A] font-bold text-3xl mb-2">
              Filter Jobs
            </div>
            <div className="flex justify-between ">
              <Button
                onClick={handleFilter}
                className=" bg-[#38A3A5] rounded-md"
              >
                Filter
              </Button>
              <Button variant="outline">Clear</Button>
            </div>
            <div>
              <h2 className=" my-4 font-semibold text-lg">Job Category</h2>
              <div className="flex flex-col gap-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      setIsChecked(e.target.checked);
                      console.log(isChecked);
                    }}
                    id="software"
                  />
                  <label
                    htmlFor="software"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Software development
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="accounting" />
                  <label
                    htmlFor="accounting"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Accounting and finance
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="media" />
                  <label
                    htmlFor="media"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Media and communication
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="video" />
                  <label
                    htmlFor="video"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Video Editing
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="script" />
                  <label
                    htmlFor="script"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Script writing
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="art" />
                  <label
                    htmlFor="art"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Creative art and design
                  </label>
                </div>
              </div>
            </div>
            <div>
              <h2 className=" my-4 font-semibold text-lg">Job Type</h2>
              <div className="flex flex-col gap-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="fulltime" />
                  <label
                    htmlFor="fulltime"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Full Time
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="partime" />
                  <label
                    htmlFor="partime"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Part Time
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="freelance" />
                  <label
                    htmlFor="freelance"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Freelance
                  </label>
                </div>
              </div>
            </div>
            <div>
              <h2 className=" my-4 font-semibold text-lg">Job Site</h2>
              <div className="flex flex-col gap-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="onsite" />
                  <label
                    htmlFor="onsite"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Onsite
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remote" />
                  <label
                    htmlFor="remote"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remote
                  </label>
                </div>
              </div>
            </div>
            <div>
              <h2 className=" my-4 font-semibold text-lg">Gender</h2>
              <div className="flex flex-col gap-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="male" />
                  <label
                    htmlFor="male"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Male
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="accounting" />
                  <label
                    htmlFor="accounting"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Female
                  </label>
                </div>
              </div>
            </div>
            <div>
              <h2 className=" my-4 font-semibold text-lg">Experience level</h2>
              <div className="flex flex-col gap-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="entry" />
                  <label
                    htmlFor="entry"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Entry level
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="junior" />
                  <label
                    htmlFor="junior"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Junior level
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="intermediate" />
                  <label
                    htmlFor="intermediate"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Intermediate level
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="senior" />
                  <label
                    htmlFor="senior"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Senior level
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="expert" />
                  <label
                    htmlFor="expert"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Expert level
                  </label>
                </div>
              </div>
            </div>
          </div> */}
        </div>
        {/* Jobs List and search bar */}
        <div className="w-[65%] py-5 shadow-md shadow-slate-500 rounded-lg">
          {/* search input field */}
          <div className="flex w-full px-5 mb-3">
            <Input
              onChange={handleChange}
              className="w-[70%] mr-3"
              type="email"
              placeholder="Search"
            />
            <Button
              onClick={clickHandler}
              className=" bg-[#38A3A5]"
              type="submit"
            >
              Search
            </Button>
          </div>
          {/* job card Lists */}
          <div>
            {displayedJobs &&
              displayedJobs
                .sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                )
                .map((job, index) => {
                  return (
                    <div key={index}>
                      <ProtectedRoute>
                        <Job
                          jobTitle={job.job_title}
                          clientFName={job.employer_firstname}
                          clientLName={job.employer_lastname}
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
                          // freelancerId={freelancerId}
                          // isLoggedIn={isLoggedIn}
                          gender={job.applicants_needed}
                        />
                      </ProtectedRoute>
                    </div>
                  );
                })}
          </div>
          <div className="flex justify-center items-end">
            {displayBtn && (
              <Button onClick={LoadMoreJobs} className="bg-green-500 mx-auto">
                Load More Jobs
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
