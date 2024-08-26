import React, { useState, useEffect } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const Contract = ({
  applicationId,
  hireDate,
  completedDate,
  rating,
  firstName,
  lastName,
  jobTitle,
  jobDesc,
  profilePic,
  isPaid,
}) => {
  const formatDate = (datetimeString) => {
    const date = new Date(datetimeString);
    return date.toLocaleDateString(); // Adjust options as needed
  };

  return (
    <div>
      <div className="mb-4 p-4 border rounded-md shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-x-5">
            <Avatar>
              <AvatarImage src={`http://localhost:8800/images/${profilePic}`} />
              <AvatarFallback>
                {firstName.charAt(0)}
                {lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h2>
              <span className=" text-sm text-slate-400">Client Name:</span>{" "}
              {firstName} {lastName}
            </h2>
          </div>
          <div className="flex gap-x-8 items-center">
            <strong>{rating && `Rating: ${rating}`}</strong>
            {completedDate && (
              <span className="bg-green-500/90 text-black font-semibold opacity-65 px-4 py-2 rounded-full shadow-lg shadow-green-400">
                Completed
              </span>
            )}
          </div>{" "}
          {/* Replace with actual rating if available */}
        </div>
        <div>
          <p className="font-bold text-xl text-slate-400">{jobTitle}</p>
        </div>
        <div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Job Description</AccordionTrigger>
              <AccordionContent>{jobDesc}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="gap-x-5">
            <div className="font-bold text-sm text-slate-400">
              Started: {formatDate(hireDate)}
            </div>
            <div className="font-bold text-sm text-slate-400">
              Completed: {completedDate && `${formatDate(completedDate)}`}
            </div>
          </div>
          {/* other */}
          {isPaid ? (
            <span className="text-green-500 font-mono font-semibold">
              payment completed
            </span>
          ) : (
            <span className="text-yellow-500 font-mono font-semibold">
              payment pending...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contract;
