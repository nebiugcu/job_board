import { useState } from "react";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import FreelancerImg from "../assets/user.png";
import ClientImg from "../assets/businessman.png";

const Register = () => {
  const [userType, setUserType] = useState(null);
  return (
    <div className="h-[70vh] flex flex-col gap-y-10 justify-center items-center">
      <div>
        <h1 className="text-5xl text-center font-mono font-semibold text-green-700">
          Which role describes
          <br /> your account ?
        </h1>
      </div>
      <div className="flex justify-center items-center h-fit">
        <RadioGroup className="flex gap-x-10" defaultValue="comfortable">
          <div
            onClick={() => {
              setUserType("freelancer");
            }}
            className={`${
              userType === "freelancer" &&
              "duration-300 shadow-lg shadow-green-800 border-green-500"
            } flex flex-col shadow-md shadow-slate-600 border-[1px] border-slate-300 p-6 w-[190px] h-[190px] rounded-lg space-x-2`}
          >
            <div className="flex gap-x-5">
              <RadioGroupItem
                checked={userType === "freelancer" && true}
                value="default"
                id="r1"
              />
              <Label htmlFor="r1">Freelancer</Label>
            </div>
            <img
              className="object-cover w-[90%] mt-3"
              src={FreelancerImg}
              alt=""
            />
          </div>
          <div
            onClick={() => {
              setUserType("client");
            }}
            className={`${
              userType === "client" &&
              "shadow-lg shadow-green-800 border-green-500 duration-300"
            } flex flex-col shadow-md shadow-slate-600 border-[1px] border-slate-300 p-6 w-[190px] h-[190px] rounded-lg space-x-2`}
          >
            <div className="flex gap-x-5">
              <RadioGroupItem
                checked={userType === "client" && true}
                value="comfortable"
                id="r2"
              />
              <Label htmlFor="r2">Client</Label>
            </div>
            <img className="object-cover w-[90%] mt-3" src={ClientImg} alt="" />
          </div>
        </RadioGroup>
      </div>
      <Link
        to={
          userType
            ? userType === "freelancer"
              ? "/freelancer-signup"
              : "/client-signup"
            : "/register"
        }
      >
        <Button className="bg-[#38A3A5]">Continue</Button>
      </Link>
    </div>
  );
};

export default Register;
