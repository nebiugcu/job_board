import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Profile1 from "@/assets/Profile2.jpg";

const SingleMessage = ({
  messagePortalId,
  clientId,
  freelancerId,
  profilePic,
  firstName,
  lastName,
}) => {
  const [message, setMessage] = useState(
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. dolorum aut dignissimos similique assumenda quos"
  );
  return (
    <div className="w-full">
      <div className="flex gap-x-4 mb-1 py-2 px-2 rounded-sm cursor-pointer min-w-[400px] items-center border-b-[1px] border-slate-300 bg-slate-50 hover:bg-sky-100 duration-300">
        {/* <Avatar>
                <AvatarImage
                  className="object-contain"
                  
                  src={Profile1}
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar> */}
        <Avatar className="cursor-pointer">
          <AvatarImage src={`http://localhost:8800/images/${profilePic}`} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-blue-800">
            {firstName} {lastName}
          </h2>
          <p className=" text-sm text-slate-500 text-nowrap">
            Click here to start chating
          </p>
        </div>
      </div>
    </div>
  );
};

export default SingleMessage;
