import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Job from "../components/Job";
import { useNavigate } from "react-router-dom";
import backImg from "../assets/3407044.jpg";

const Jobs = () => {
  const navigate = useNavigate();
  const [allJobs, setAllJobs] = useState([]);
  const [searchedJob, setSearchedJob] = useState("");
  const [userData, setUserData] = useState(null);
  const [displayedJobs, setDisplayedJobs] = useState([]);
  const [displayLimit, setDisplayLimit] = useState(5);
  const [displayBtn, setDisplayBtn] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const freelancerId = userData
    ? userData.isLoggedIn && userData.userInfo.userData.Freelancer_ID
    : null;
  const isLoggedIn = userData ? (userData.isLoggedIn ? true : false) : false;
  console.log(freelancerId);

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:8800/check")
      .then((res) => {
        console.log(res.data);
        setUserData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:8800/api/job/all-jobs")
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
    <div className="py-5">
      <div className="flex gap-x-14 px-10 justify-center">
        {/* Filtering sidebar */}
        <div
          style={{
            backgroundImage: `url(${backImg})`,
            backgroundPosition: "10% 0%",
            backgroundSize: "700px",
          }}
          className="w-[20%] h-[800px] p-5 shadow-md shadow-slate-500 rounded-lg"
        >
          <div className="font-semibold font-mono text-3xl mt-10 text-white">
            Search For Jobs based on your interest.
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
              displayedJobs.map((job, index) => {
                return (
                  <div key={index}>
                    <Job
                      jobTitle={job.Job_Title}
                      clientName={job.Username}
                      postedAt={job.Created_at}
                      locatedAt={job.Location}
                      jobDescription={job.Job_Description}
                      jobCategory={job.Job_Category}
                      jobSite={job.Job_Site}
                      jobType={job.Job_Type}
                      salary={job.Salary}
                      experience={job.Experience_Level}
                      deadline={job.Application_Deadline}
                      jobId={job.Job_ID}
                      freelancerId={freelancerId}
                      isLoggedIn={isLoggedIn}
                      gender={job.Applicants_Needed}
                    />
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
