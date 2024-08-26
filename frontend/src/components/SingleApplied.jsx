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

const SingleApplied = ({
  jobTitle,
  clientName,
  coverLetter,
  applicationId,
  status,
}) => {
  const navigate = useNavigate();
  const deleteHandler = async () => {
    axios
      .delete(
        `http://localhost:8800/api/apply/delete-application/${applicationId}`
      )
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log(status);
  return (
    <div>
      <div className="flex flex-col w-[70%] mx-auto shadow-sm shadow-slate-400 rounded-md p-4 m-4">
        {/* <div className="flex justify-between">
          <div className="flex items-center gap-x-5">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h2>Nahom Esayas</h2>
          </div>
          <div>Rating 5.0</div>
        </div> */}
        {/* <div>
          <p className="font-bold text-xl text-slate-400">Web developer</p>
        </div> */}
        <div className="flex justify-between">
          <div className="flex flex-col">
            <h1 className="font-bold text-2xl">Job Title: {jobTitle}</h1>
            <h2>{clientName}</h2>
          </div>

          <div>
            {status === "applied" && (
              <span className="bg-yellow-500/90 text-black font-semibold opacity-65 px-4 py-2 rounded-full shadow-lg shadow-yellow-400">
                Pending...
              </span>
            )}
            {status === "accepted" && (
              <span className="bg-green-500/90 text-black font-semibold opacity-65 px-4 py-2 rounded-full shadow-lg shadow-green-400">
                Accepted
              </span>
            )}
            {status === "rejected" && (
              <span className="bg-red-500/90 text-black font-semibold opacity-65 px-4 py-2 rounded-full shadow-lg shadow-red-400">
                Rejected
              </span>
            )}
          </div>
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
          <div className="flex gap-x-5">
            <Button
              onClick={() => {
                navigate("/messages");
              }}
              className=" bg-blue-500"
            >
              Message
            </Button>
          </div>
          <Button onClick={deleteHandler} className=" bg-red-500">
            Delete Application
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SingleApplied;
