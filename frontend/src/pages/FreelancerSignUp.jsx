import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import api from "../api";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const FreelancerSignUp = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    profession: "",
    bio: "",
    skills: "",
    profilePic: null,
    resume: null,
  });
  const navigate = useNavigate();
  const {
    firstname,
    lastname,
    username,
    email,
    password,
    profession,
    bio,
    skills,
    profilePic,
    resume,
  } = formData;
  const onChange = (e) => {
    if (e.target.name === "profilePic") {
      setFormData({ ...formData, profilePic: e.target.files[0] });
    } else if (e.target.name === "resume") {
      setFormData({ ...formData, resume: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }
    const data = new FormData();
    data.append("user.first_name", firstname);
    data.append("user.last_name", lastname);
    data.append("user.username", username);
    data.append("user.email", email);
    data.append("user.password", password);
    data.append("profession", profession);
    data.append("bio", bio);
    data.append("skills", skills);
    data.append("profile_picture", profilePic);
    data.append("resume", resume);
    // api/auth/freelancer-register
    axios.defaults.withCredentials = true;
    if (profilePic == null) {
      data.delete("profile_picture");
    }
    if (resume == null) {
      data.delete("resume");
    }
    api
      .post("/api/register/jobseeker/", data)
      .then((res) => {
        console.log(res.data);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data.msg);
      });
  };
  return (
    <div className="flex justify-center items-center h-fit py-5">
      <Card className="mx-auto w-[60%]">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up as a Job Seeker</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit} action="">
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    name="firstname"
                    id="first-name"
                    onChange={onChange}
                    placeholder="Max"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    name="lastname"
                    id="last-name"
                    onChange={onChange}
                    placeholder="Robinson"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user-name">User name</Label>
                  <Input
                    name="username"
                    id="user-name"
                    onChange={onChange}
                    placeholder="Robinson"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  id="email"
                  onChange={onChange}
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  name="password"
                  id="password"
                  onChange={onChange}
                  type="password"
                />
              </div>
              <div className="w-full flex flex-col gap-y-1">
                <Label className="text-base" htmlFor="">
                  Select your profession:
                </Label>
                <Select
                  name="profession"
                  onValueChange={(value) => {
                    setFormData({ ...formData, profession: value });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose your area of expertise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Profession</SelectLabel>
                      <SelectItem value="accountant">Accountant</SelectItem>
                      <SelectItem value="Administrative Assistant">
                        Administrative Assistant
                      </SelectItem>
                      <SelectItem value="Business Analyst">
                        Business Analyst
                      </SelectItem>
                      <SelectItem value="Civil Engineer">
                        Civil Engineer
                      </SelectItem>
                      <SelectItem value="copywriter">Copywriter</SelectItem>
                      <SelectItem value="Customer Support Specialist">
                        Customer Support Specialist
                      </SelectItem>
                      <SelectItem value="Data Analyst">Data Analyst</SelectItem>
                      <SelectItem value="Digital Marketing Specialist">
                        Digital Marketing Specialist
                      </SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="graphic designer">
                        Graphic Designer
                      </SelectItem>
                      <SelectItem value="human resource">
                        Human resource Manager
                      </SelectItem>
                      <SelectItem value="Human Resources Manager">
                        Human Resources Manager
                      </SelectItem>
                      <SelectItem value="Lawyer">Lawyer</SelectItem>
                      <SelectItem value="Marketing Manager">
                        Marketing Manager
                      </SelectItem>
                      <SelectItem value="Mechanical Engineer">
                        Mechanical Engineer
                      </SelectItem>
                      <SelectItem value="photography">Photographer</SelectItem>
                      <SelectItem value="Photographer">Photographer</SelectItem>
                      <SelectItem value="Project Manager">
                        Project Manager
                      </SelectItem>
                      <SelectItem value="Registered Nurse">
                        Registered Nurse
                      </SelectItem>
                      <SelectItem value="Sales Representative">
                        Sales Representative
                      </SelectItem>
                      <SelectItem value="social media manager">
                        Social Media Manager
                      </SelectItem>
                      <SelectItem value="software engineer">
                        Software Engineer
                      </SelectItem>
                      <SelectItem value="Translator">Translator</SelectItem>
                      <SelectItem value="tutor">Tutor</SelectItem>
                      <SelectItem value="UX/UI Designer">
                        UX/UI Designer
                      </SelectItem>
                      <SelectItem value="virtual assistant">
                        Virtual Assistant
                      </SelectItem>
                      <SelectItem value="Video Editor">Video Editor</SelectItem>
                      <SelectItem value="Web Developer">
                        Web Developer
                      </SelectItem>

                      <SelectItem value="other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="skills">Your Skills</Label>
                <Input
                  name="skills"
                  id="skills"
                  onChange={onChange}
                  placeholder="Enter your skills (Ex:- Python, React, Express.js)"
                />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  name="bio"
                  onChange={onChange}
                  placeholder="Tell us a little bit about yourself"
                  id="bio"
                />
              </div>
              <div className="flex gap-x-8 items-center">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="picture">Picture</Label>
                  <Input
                    name="profilePic"
                    id="picture"
                    onChange={onChange}
                    type="file"
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="cv">Upload Resume or CV</Label>
                  <Input
                    name="resume"
                    id="cv"
                    onChange={onChange}
                    type="file"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-[#396ca0] rounded-3xl">
                Create an account
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default FreelancerSignUp;
