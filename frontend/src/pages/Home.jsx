import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import HomeImg from "../assets/home.jpg";
import HomeImg2 from "../assets/home2.jpg";
import HomeImg3 from "../assets/home-img.jpg";

const Home = () => {
  const style = {
    backgroundImage: `url(${HomeImg3})`,
    backgroundSize: "cover", // Adjust background size
    backgroundPosition: "center", // Adjust background position
    height: "100vh", // Adjust height
    width: "100vw", // Adjust width
  };
  return (
    <div
      style={style}
      className="min-h-[70vh] flex flex-col gap-y-5 w-[80%] mx-auto"
    >
      <div className=" shadow-md shadow-black font-bold pb-3">
        <div className="mt-10 text-2xl text-center font-mono font-bold pt-4 border-t-8 mb-2">
          Helpful Resources
        </div>
        <div className="flex gap-x-10 justify-center">
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
      <div className="flex justify-between gap-x-24">
        {/* <div className="w-[55%] flex flex-col gap-y-3 justify-center items-start">
          <h1 className="text-5xl font-bold">
            Hire the Best Talent with Smart Applicant Matching
          </h1>
          <p className="text-3xl">
            As an employer, finding the right candidates is fast and efficient.
            Post jobs in minutes and let our AI tools recommend top applicants
            based on their resumes and cover letters. Save time by connecting
            with qualified professionals who fit your job requirements, and
            streamline your hiring process with intelligent matching technology.
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default Home;
