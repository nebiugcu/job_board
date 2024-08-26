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
import { useNavigate } from "react-router-dom";
import { set } from "date-fns";

const Hire = ({
  applicationId,
  hireDate,
  completedDate,
  rating,
  firstName,
  lastName,
  jobTitle,
  jobDesc,
  profilePic,
  hireId,
  paymentPaid,
}) => {
  const navigate = useNavigate();
  const [rate, setRate] = useState(null);
  const [payBtnVisble, setPayBtnVisble] = useState(true);
  const [form, setForm] = useState({
    amount: "",
    currency: "ETB",
    email: "",
    first_name: firstName,
    last_name: lastName,
    phone_number: "",
  });

  const tx_ref = `${form.first_name}-${Date.now()}`;
  const formatDate = (datetimeString) => {
    const date = new Date(datetimeString);
    return date.toLocaleDateString(); // Adjust options as needed
  };

  const handleRate = async () => {
    const rateData = {
      rating: rate,
      applicationId: applicationId,
    };
    axios
      .post("http://localhost:8800/api/hire/rate", rateData)
      .then((res) => {
        console.log(res.data);
        setRate("");
        navigate(0);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePayment = async () => {
    const paymentData = {
      hireId: hireId,
      isCompleted: true,
    };
    try {
      const res = await axios.post(
        "http://localhost:8800/accept-payment",
        {
          ...form,
          tx_ref,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      window.location.href = res.data.data.checkout_url;
      console.log(res);
      console.log("nahomm");
      setForm({
        amount: "",
        currency: "Birr",
        email: "",
        first_name: firstName,
        last_name: lastName,
        phone_number: "",
        tx_ref,
      });
      setPayBtnVisble(false);

      // payment handler

      axios
        .post("http://localhost:8800/api/hire/payment-complete", paymentData)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log("Error", error);
    }
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
              <span className=" text-sm text-slate-400">Done By:</span>{" "}
              {firstName} {lastName}
            </h2>
          </div>
          <div>
            <strong>Rating {rating} </strong>
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
              Started {formatDate(hireDate)}
            </div>
            <div className="font-bold text-sm text-slate-400">
              Completed: {completedDate && `${formatDate(completedDate)}`}
            </div>
          </div>
          {/* other */}
          <div className="flex gap-x-4">
            {!paymentPaid ? (
              <Dialog>
                <DialogTrigger asChild>
                  <button className=" bg-green-500 px-5 py-2 rounded-xl text-white font-mono font-semibold">
                    Pay with Chapa
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Pay Freelancer</DialogTitle>
                    <DialogDescription>
                      Enter payment information.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="amount" className="text-right">
                        Amount:
                      </Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        onChange={(e) => {
                          setForm({ ...form, amount: e.target.value });
                        }}
                        placeholder="Enter amount"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right">
                        Phone:
                      </Label>
                      <Input
                        id="phone"
                        type="number"
                        name="phone_number"
                        onChange={(e) => {
                          setForm({ ...form, phone_number: e.target.value });
                        }}
                        placeholder="Enter phone number"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Email:
                      </Label>
                      <Input
                        id="name"
                        type="email"
                        name="email"
                        onChange={(e) => {
                          setForm({ ...form, email: e.target.value });
                        }}
                        placeholder="Enter email address"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handlePayment} type="submit">
                      Pay
                    </Button>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <>
                <span className="text-green-500 font-mono font-semibold">
                  payment successful
                </span>
              </>
            )}

            {!rating && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className=" bg-blue-500 px-5 py-2 rounded-xl text-white font-mono font-semibold"
                    variant="outline"
                  >
                    Rate Freelancer
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Rate Freelancer (rate out of 5)</DialogTitle>
                    <DialogDescription>
                      Were you satsfied by their work? Give feedback by rating
                      them.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Rate Value
                      </Label>
                      <Input
                        id="name"
                        type="number"
                        value={rate}
                        onChange={(e) => {
                          setRate(e.target.value);
                        }}
                        max="5"
                        min="0"
                        placeholder="5"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleRate} type="submit">
                      Submit Rate
                    </Button>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hire;
