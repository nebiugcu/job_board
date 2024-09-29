import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import LoginImg from "@/assets/login.jpg";
import { useState } from "react";

const Login = () => {
  const [userLoginInfo, setUserLoginInfo] = useState({
    email: "",
    password: "",
    isClient: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserLoginInfo({ ...userLoginInfo, [e.target.name]: e.target.value });
  };
  const handleOptionChange = (e) => {
    setUserLoginInfo({ ...userLoginInfo, isClient: e.target.value === "true" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/token", {
        email: userLoginInfo.email,
        password: userLoginInfo.password,
      });
      console.log(res);
      alert("success");
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

      if (userLoginInfo.isClient) {
        navigate("/posts", {
          state: {
            isLoggedIn: true,
            isClient: true,
            password: userLoginInfo.password,
          },
        });
        window.location.reload();
        alert("success");
      }
      if (userLoginInfo.isClient === false) {
        navigate("/jobs", {
          state: {
            isLoggedIn: true,
            isClient: false,
            password: userLoginInfo.password,
          },
        });
        window.location.reload();
        alert("success");
      }
      console.log("success");
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  return (
    <div className="w-full lg:grid lg:h-[80vh] lg:grid-cols-2 xl:min-h-[500px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[450px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <form onSubmit={handleSubmit} action="">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  id="email"
                  onChange={handleChange}
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                  ></Link>
                </div>
                <Input
                  name="password"
                  id="password"
                  onChange={handleChange}
                  type="password"
                  required
                />
              </div>
              <div className="flex gap-x-5">
                <div className="flex gap-x-2">
                  <input
                    type="radio"
                    name="user-type"
                    value="true"
                    checked={userLoginInfo.isClient === true}
                    onChange={handleOptionChange}
                    id="client"
                  />
                  <label htmlFor="client">Employer</label>
                </div>
                <div className="flex gap-x-2">
                  <input
                    type="radio"
                    name="user-type"
                    value="false"
                    checked={userLoginInfo.isClient === false}
                    onChange={handleOptionChange}
                    id="freelancer"
                  />
                  <label htmlFor="freelancer">Job Seeker</label>
                </div>
              </div>

              <Button type="submit" className="w-full bg-[#38A3A5] rounded-3xl">
                Login
              </Button>
            </div>
          </form>

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center text-6xl text-center font-semibold">
        Empowering you to reach new heights
      </div>
      {/* <div className="hidden lg:block">
        <img
          src={LoginImg}
          alt="Image"
          className="h-full w-full relative -bottom-6 object-contain"
        />
      </div> */}
    </div>
  );
};

export default Login;
