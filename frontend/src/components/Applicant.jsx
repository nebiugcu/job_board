import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FileDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon } from "@radix-ui/react-icons";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const Applicant = ({
  applicationId,
  applicationStatus,
  freelancerId,
  freelancerFirstName,
  freelancerLastName,
  profession,
  profilePic,
  coverLetter,
  jobTitle,
  username,
  bio,
  resume,
}) => {
  console.log("asdkd");
  console.log(applicationStatus);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const isClient = userData
    ? userData.isLoggedIn && userData.userInfo.isClient
    : null;

  const clientId = userData
    ? userData.isLoggedIn && userData.userInfo.userData.Client_ID
    : null;

  const sentMessagePortalData = {
    isClient: isClient,
    clientId: clientId,
    freelancerId: freelancerId,
  };

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

  const handleMessagePort = async () => {
    axios
      .post(
        "http://localhost:8800/api/message/create-message",
        sentMessagePortalData
      )
      .then((res) => {
        console.log(res.data);
        navigate("/messages");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleApplicantsHire = async () => {
    console.log(applicationId, clientId, freelancerId);
    const data = {
      applicationId: applicationId,
      clientId: clientId,
      freelancerId: freelancerId,
    };

    try {
      const response = await axios.post(
        `http://localhost:8800/api/hire/hireApplicant`,
        data
      );
      if (response.data.message == 1) {
        navigate(0);
      } else {
        alert("oops! There might be a problem please try again");
      }
    } catch (e) {
      alert("it looks like something is wrong!");
      console.error(e.message);
    }
  };

  const handleApplicationReject = async () => {
    console.log(applicationId);
    const data = {
      applicationId: applicationId,
    };

    try {
      const response = await axios.post(
        `http://localhost:8800/api/hire/rejectApplication`,
        data
      );
      if (response.data.message == 1) {
        navigate(0);
      }
    } catch (e) {
      alert("it looks like something is wrong!");
      console.error(e.message);
    }
  };
  return (
    <div>
      <div className="flex flex-col w-[70%] mx-auto shadow-sm shadow-slate-400 rounded-md p-4 m-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-x-5">
            <Avatar>
              <AvatarImage src={`http://localhost:8800/images/${profilePic}`} />
              <AvatarFallback>FN</AvatarFallback>
            </Avatar>
            <h2>
              {freelancerFirstName} {freelancerLastName}
            </h2>
          </div>
          <div>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link">@{username}</Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex space-x-6">
                  <Avatar>
                    <AvatarImage
                      src={`http://localhost:8800/images/${profilePic}`}
                    />
                    <AvatarFallback>VC</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">@{username}</h4>
                    <p className="text-sm">
                      <span className="font-semibold">Bio:</span> {bio}
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
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
          <div>
            <a
              className="flex items-center gap-x-2 my-3"
              href={`http://localhost:8800/images/${resume}`}
              target="_blank"
              download="myfile.pdf"
            >
              <FileDown />
              <span>Download Resume</span>
            </a>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-x-5">
            {/* {applicationStatus === "applied " ? (
              <Button
                onClick={() => {
                  handleApplicantsHire(applicationId);
                }}
                className="bg-green-600"
              >
                Hire
              </Button>
            ) : applicationStatus === "accepted" ? (
              <div>Accepted</div>
            ) : (
              applicationStatus && console.log(applicationStatus, "nahom")
            )} */}
            {applicationStatus === "applied" ? (
              <Button onClick={handleApplicantsHire} className="bg-green-600">
                Hire
              </Button>
            ) : applicationStatus === "accepted" ? (
              <div>Accepted</div>
            ) : (
              <div>Rejected</div>
            )}

            <Button onClick={handleMessagePort} className=" bg-blue-500">
              Message
            </Button>
          </div>
          {applicationStatus === "applied" && (
            <Button onClick={handleApplicationReject} className=" bg-red-500">
              Reject
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Applicant;
