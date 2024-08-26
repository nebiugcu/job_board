import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const ActiveJob = ({
  hireId,
  jobTitle,
  jobDesc,
  jobCat,
  firstName,
  lastName,
  profilePic,
  profession,
  coverLetter,
}) => {
  const navigate = useNavigate();
  const handleJobComplete = async (event) => {
    const data = {
      hireId: hireId,
    };
    try {
      const response = await axios.post(
        `http://localhost:8800/api/job/CompleteJob`,
        data
      );
      if (response.data.message == "1") {
        alert("Completed!!!");
        navigate(0);
      }
    } catch (error) {
      console.error(error.message);
      alert("Something wrong please refresh and try again");
    }
  };

  return (
    <div>
      <div className="flex flex-col w-[70%] mx-auto shadow-sm shadow-slate-400 rounded-md p-4 m-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-x-5">
            <Avatar>
              <AvatarImage src={`http://localhost:8800/images/${profilePic}`} />
              <AvatarFallback>
                {firstName.charAt(0)}
                {lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h2>
              {firstName} {lastName}
            </h2>
          </div>
          <div>{jobCat}</div>
        </div>
        <div>
          <p className="font-bold text-xl text-slate-400">{profession}</p>
        </div>
        <div>
          <h1 className="font-bold text-2xl">Job Title: {jobTitle}</h1>
        </div>
        <div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Application cover letter</AccordionTrigger>
              <AccordionContent>{coverLetter}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-x-5"></div>

          <Button onClick={handleJobComplete} className=" bg-blue-500">
            Complete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActiveJob;
