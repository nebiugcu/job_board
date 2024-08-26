import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PostJob = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [jobData, setJobData] = useState({
    job_title: "",
    job_type: "",
    applicant_needed: "",
    job_desc: "",
    job_cat: "",
    job_site: "",
    deadline: "",
    experience: "",
    salary: "",
    location: "",
  });

  const clientId = userData
    ? userData.isLoggedIn && userData.userInfo.userData.Client_ID
    : null;

  const sentJobData = {
    client_id: clientId,
    ...jobData,
  };

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (e) => {
    setJobData({ ...jobData, job_type: e.target.value });
  };

  const handleOptionChange2 = (e) => {
    setJobData({ ...jobData, job_site: e.target.value });
  };

  const handleCheckboxChange = () => {
    console.log("dlkdlkddk");
    const maleChecked = document.getElementById("male").checked;
    const femaleChecked = document.getElementById("female").checked;
    console.log(maleChecked, femaleChecked);
    let gender = "";
    if (maleChecked && femaleChecked) {
      gender = "both";
    } else if (maleChecked) {
      gender = "male";
    } else if (femaleChecked) {
      gender = "female";
    }
    console.log("riva", gender);

    setJobData((prevFormData) => ({
      ...prevFormData,
      applicant_needed: gender,
    }));
  };
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:8800/check")
      .then((res) => {
        console.log(res.data);
        setUserData(res.data);
        if (!res.data.isLoggedIn) {
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("dhdk");
    console.log(sentJobData);
    axios
      .post("http://localhost:8800/api/job/post-job", sentJobData)
      .then((res) => {
        console.log(res.data);
        navigate("/posts");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className=" h-fit mb-10">
      <Card className="mx-auto w-[80%]">
        <CardHeader>
          <CardTitle className="text-3xl">Post a Job</CardTitle>
          <CardDescription>Enter detail of the job</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} action="">
            <div className="grid gap-y-2">
              <div className="grid gap-2">
                <Label className="text-xl" htmlFor="job-title">
                  Job Title
                </Label>
                <Input
                  name="job_title"
                  onChange={handleChange}
                  id="job-title"
                  placeholder="Enter Title"
                  required
                />
              </div>
              <div className="flex gap-x-14 my-5">
                <div className="grid gap-y-3">
                  <Label className="text-xl" htmlFor="job-type">
                    Job Type
                  </Label>
                  <div className="flex gap-x-5 pl-4">
                    <div className="flex items-center gap-x-2">
                      <input
                        type="radio"
                        value="full time"
                        checked={jobData.job_type == "full time"}
                        onChange={handleOptionChange}
                        name="job-type"
                        id="r1"
                      />
                      <Label htmlFor="r1">Full Time</Label>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <input
                        type="radio"
                        value="part time"
                        checked={jobData.job_type == "part time"}
                        onChange={handleOptionChange}
                        id="r2"
                      />
                      <Label htmlFor="r2">Part Time</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="freelance"
                        checked={jobData.job_type == "freelance"}
                        onChange={handleOptionChange}
                        name="job-type"
                        id="r3"
                      />
                      <Label htmlFor="r3">Freelance</Label>
                    </div>
                  </div>
                </div>
                <div className="grid gap-y-3">
                  <Label className="text-xl" htmlFor="applicants">
                    Applicants Needed
                  </Label>
                  <div className="flex gap-x-4 pl-4">
                    <div className="flex gap-x-2 items-center">
                      <input
                        type="checkbox"
                        name=""
                        id="male"
                        onClick={handleCheckboxChange}
                        className="w-[15px] h-[15px]"
                      />
                      {/* <Checkbox id="male" /> */}
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex gap-x-2 items-center">
                      <input
                        type="checkbox"
                        name=""
                        id="female"
                        onClick={handleCheckboxChange}
                        className="w-[15px] h-[15px]"
                      />
                      {/* <Checkbox id="female" /> */}
                      <Label htmlFor="female">Female</Label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid gap-y-3">
                <Label className="text-xl" htmlFor="job-description">
                  Job Description
                </Label>
                <Textarea
                  name="job_desc"
                  onChange={handleChange}
                  placeholder="Type your message here."
                />
              </div>
              <div className="grid gap-y-3">
                <Label className="text-xl" htmlFor="catagory">
                  Job Category
                </Label>
                <Select
                  onValueChange={(value) => {
                    setJobData({ ...jobData, job_cat: value });
                  }}
                >
                  <SelectTrigger className="w-[70%]">
                    <SelectValue placeholder="Select the Job's category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      <SelectItem value="Software Development">
                        Software Development
                      </SelectItem>
                      <SelectItem value="Finance">
                        Accounting and Finance
                      </SelectItem>
                      <SelectItem value="Media">
                        Media and Communication
                      </SelectItem>
                      <SelectItem value="Editing">Video Editing</SelectItem>
                      <SelectItem value="Design">
                        Creative art and design
                      </SelectItem>
                      <SelectItem value="Music">Music and Audio</SelectItem>
                      <SelectItem value="Service">Customer Service</SelectItem>
                      <SelectItem value="Consulting">Consulting</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-x-20">
                <div className="grid gap-y-3">
                  <Label className="text-xl" htmlFor="job-type">
                    Job Type
                  </Label>
                  <div className="flex gap-x-5 pl-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="on site"
                        checked={jobData.job_site == "on site"}
                        onChange={handleOptionChange2}
                        name="job-site"
                        id="onsite"
                      />
                      <Label htmlFor="onsite">On-Site</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="remote"
                        checked={jobData.job_site == "remote"}
                        onChange={handleOptionChange2}
                        name="job-site"
                        id="remote"
                      />
                      <Label htmlFor="remote">Remote</Label>
                    </div>
                  </div>
                </div>
                <div className="grid mt-3 gap-y-3">
                  <Label className="text-xl" htmlFor="date">
                    Application Deadline
                  </Label>
                  <Input
                    type="date"
                    onChange={(e) => {
                      setJobData({ ...jobData, deadline: e.target.value });
                    }}
                    id="date"
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="grid gap-y-2">
                <Label className="text-xl" htmlFor="catagory">
                  Experience level
                </Label>
                <Select
                  onValueChange={(value) => {
                    setJobData({ ...jobData, experience: value });
                  }}
                >
                  <SelectTrigger className="w-[70%]">
                    <SelectValue placeholder="Select the Expertise type the job requires" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Experience Levels</SelectLabel>
                      <SelectItem value="expert">Expert</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="intermidiate">Intermidate</SelectItem>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="entry">Entry</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-x-8">
                <div className="flex flex-col gap-y-3">
                  <Label className="text-xl" htmlFor="salary">
                    Salary
                  </Label>
                  <Input
                    className="w-[300px]"
                    type="number"
                    name="salary"
                    onChange={handleChange}
                    placeholder="Salary"
                    id="salary"
                  />
                </div>
                <div className="flex flex-col gap-y-3">
                  <Label className="text-xl" htmlFor="location">
                    Location
                  </Label>
                  <Input
                    className="w-[300px]"
                    type="text"
                    name="location"
                    onChange={handleChange}
                    placeholder="Location"
                    id="location"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="">
                  Post Job
                </Button>
              </div>
            </div>
          </form>

          {/* <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input id="first-name" placeholder="Max" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input id="last-name" placeholder="Robinson" required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
            <Button type="submit" className="w-full">
              Create an account
            </Button>
            <Button variant="outline" className="w-full">
              Sign up with GitHub
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="#" className="underline">
              Sign in
            </Link>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default PostJob;
