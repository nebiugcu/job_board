import { useState, useEffect } from "react";
import axios from "axios";
import api from "../api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { formatDistanceToNow, parseISO, format } from "date-fns";

const Application = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);
  const job = location.state || {};
  const applicationInfo = {
    job_id: job.jobId,
    cover_letter: coverLetter,
    resume: resume,
  };
  useEffect(() => {
    console.log(job);
    console.log("trying to get job info from application page");
  }, []);

  // axios.defaults.withCredentials = true;
  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8800/check")
  //     .then((res) => {
  //       console.log(res.data);
  //       setUserInfo(res.data);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  const onChange = (e) => {
    setResume(e.target.files[0]);
  };

  const submitHandler = () => {
    const formData = new FormData();
    formData.append("job", applicationInfo.job_id);
    formData.append("cover_letter", applicationInfo.cover_letter);
    formData.append("resume", applicationInfo.resume);
    console.log(applicationInfo);
    api
      .post("/api/applications/", formData)
      .then((res) => {
        console.log(res.data);
        navigate("/applications");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <div className="flex gap-x-5 justify-center my-5">
        <div className="w-[60%] px-10 py-4 flex flex-col gap-y-5 rounded-sm shadow-sm shadow-slate-600">
          <h1 className="text-2xl font-medium text-teal-800">About the Job</h1>
          <div className="border-b-[1px] pb-5 border-b-gray-400">
            <p className="text-4xl font-bold mb-3">{job.jobTitle}</p>
            <div className="flex gap-x-4">
              <p className=" bg-slate-200 py-1 px-3 rounded-full shadow-sm shadow-slate-500">
                {" "}
                {job.jobCategory}
              </p>
              <p className=" bg-slate-200 py-1 px-3 rounded-full shadow-sm shadow-slate-500">
                {formatDistanceToNow(parseISO(job.postedAt), {
                  addSuffix: true,
                })}
              </p>
              <p className=" bg-slate-200 py-1 px-3 rounded-full shadow-sm shadow-slate-500">
                {job.locatedAt}
              </p>
            </div>
          </div>
          <div>
            <p className=" text-start">
              <strong>Job Description:</strong>&nbsp; {job.jobDescription}
            </p>
          </div>
          <div className="flex gap-x-10 border-b-[1px] pb-5 border-b-gray-400">
            <div className="flex flex-col">
              <span className="text-lg text-slate-500">Monthly</span>
              <span className="font-semibold">${job.salary}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg text-slate-500">Experience Level</span>
              <span className="font-semibold">{job.experience}</span>
            </div>
          </div>
          <div className="mb-3">
            <h1 className="text-xl font-semibold mb-2">
              Write a cover a letter for the job.
            </h1>
            <Textarea
              onChange={(e) => {
                setCoverLetter(e.target.value);
              }}
              placeholder="Type your message here."
            />
            <div className="grid w-full max-w-sm items-center mt-2 gap-1.5">
              <Label htmlFor="cv">Upload Resume or CV</Label>
              <Input name="resume" id="cv" onChange={onChange} type="file" />
            </div>
            <div className=" mt-4 flex justify-between">
              <span className="hover:text-[#57CC99] cursor-pointer">
                <Link to="/jobs">
                  <ArrowLeft className="inline-block" /> Return to List
                </Link>
              </span>
              <Button onClick={submitHandler} className="bg-[#38A3A5]">
                Submit Proposal
              </Button>
            </div>
          </div>
        </div>
        <div className="shadow-md shadow-slate-400 w-[25%] h-fit py-4 px-5 rounded-md hover:scale-[1.02] duration-1000">
          <div>
            <h1 className="text-2xl font-medium text-teal-800 mb-3">
              About The Employer
            </h1>
            <div className="mb-3">
              <h2 className="hover:text-emerald-700 font-medium ">
                <span className="text-sky-800">Name:</span> {job.clientFName}{" "}
                {job.clientLName}
              </h2>
            </div>
            <div className=""></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Application;
