import React, { useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { formatDistanceToNow, parseISO, format } from "date-fns";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

const ClientJob = ({
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
}) => {
  const navigate = useNavigate();
  const [updatedJobTitle, setUpdatedJobTitle] = useState("");
  const [updatedJobDesc, setUpdatedJobDesc] = useState("");
  const [updatedJobSalary, setUpdatedJobSalary] = useState("");
  const [updatedJobLocation, setUpdatedJobLocation] = useState("");
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
  };
  console.log(clientName);

  const handleJobDelete = async () => {
    axios
      .delete(`http://localhost:8800/api/job/delete-job/${jobId}`)
      .then((res) => {
        console.log(res);
        //navigate(0);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateJobPost = async () => {
    const data = {
      jobId: jobId,
      jobTitle: updatedJobTitle,
      jobDesc: updatedJobDesc,
      salary: updatedJobSalary,
      location: updatedJobLocation,
    };
    axios
      .post("http://localhost:8800/api/job/update-job", data)
      .then((res) => {
        console.log(res.data);
        // navigate(0);
      })
      .catch((err) => {
        console.log(err);
      });
    setUpdatedJobDesc("");
    setUpdatedJobLocation("");
    setUpdatedJobSalary("");
    setUpdatedJobTitle("");
  };
  return (
    <div className="flex flex-col gap-y-4 border-b-[1px] border-slate-300 py-6 mb-4 px-5 font-mono hover:bg-slate-100 duration-75">
      {/* Job Title */}
      <div className="flex gap-x-3 items-center">
        <h1 className="font-bold text-2xl">{jobTitle}</h1>
        <Dialog>
          <DialogTrigger asChild>
            <div className="p-2 bg-slate-200 rounded-full">
              {" "}
              <Pencil />
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Job Post</DialogTitle>
              <DialogDescription>
                Make changes to your job post here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Job Title
                </Label>
                <Input
                  onChange={(e) => {
                    setUpdatedJobTitle(e.target.value);
                  }}
                  id="name"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="desc" className="text-right">
                  Description
                </Label>
                <Textarea
                  onChange={(e) => {
                    setUpdatedJobDesc(e.target.value);
                  }}
                  className="col-span-3"
                  placeholder="Type your message here."
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="salary" className="text-right">
                  Salary
                </Label>
                <Input
                  onChange={(e) => {
                    setUpdatedJobSalary(e.target.value);
                  }}
                  id="salary"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input
                  onChange={(e) => {
                    setUpdatedJobLocation(e.target.value);
                  }}
                  id="location"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={updateJobPost} type="submit">
                Update Job Post
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
          {jobSite} - {jobType}
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
          <span>{experience ? experience : "intermidate"}</span>
        </div>
        {/* Application Deadline */}
        <div className="flex flex-col">
          <span className=" text-slate-500">Application Deadline</span>
          <span>{format(parseISO(deadline), "MMMM dd, yyyy")}</span>
        </div>
        {/* Apply button */}
        <div className="flex flex-col">
          <Link
            to={
              location.pathname === "/jobs"
                ? "/application"
                : `/applicants/${jobId}`
            }
          >
            <Button className={`bg-[#38A3A5] px-4 w-[250px] mb-4`}>
              Applicants
            </Button>
          </Link>

          <Button
            onClick={handleJobDelete}
            className="bg-red-500 px-4 w-[250px]"
          >
            Delete Job
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientJob;
