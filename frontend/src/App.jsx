import "./App.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import axios from "axios";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Jobs from "./pages/Jobs";
import Posts from "./pages/Posts";
import Messages from "./pages/Messages";
import Message from "./components/Message";
import Applicants from "./pages/Applicants";
import Hires from "./components/Hire";
import JobHires from "./pages/JobHires";
import JobsApplied from "./pages/JobsApplied";
import Application from "./pages/Application";
import Profile from "./pages/Profile";
import ClientSignup from "./pages/ClientSignUp";
import FreelancerSignUp from "./pages/FreelancerSignUp";
import PostJob from "./pages/PostJob";
import { useEffect, useState } from "react";
import ActiveJobs from "./pages/ActiveJobs";
import Contracts from "./pages/Contracts";

function App() {
  const [userInfo, setUserInfo] = useState(null);
  console.log("nahom7878hkkh");
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:8800/check")
      .then((res) => {
        setUserInfo(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  const Layout = () => {
    return (
      <>
        <NavBar userData={userInfo} />
        <Outlet />
        <Footer />
      </>
    );
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home userData={userInfo} />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/client-signup",
          element: <ClientSignup />,
        },
        {
          path: "/freelancer-signup",
          element: <FreelancerSignUp />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/jobs",
          element: <Jobs />,
        },
        {
          path: "/posts",
          element: <Posts />,
        },
        {
          path: "/postjob",
          element: <PostJob />,
        },
        {
          path: "/messages",
          element: <Messages />,
        },
        {
          path: "/message/:id",
          element: <Message />,
        },
        {
          path: "/applicants/:id",
          element: <Applicants />,
        },
        {
          path: "/applications",
          element: <JobsApplied />,
        },
        {
          path: "/hires",
          element: <JobHires />,
        },
        {
          path: "/contracts",
          element: <Contracts />,
        },
        {
          path: "/application",
          element: <Application />,
        },
        {
          path: "/active-jobs",
          element: <ActiveJobs />,
        },
      ],
    },
  ]);
  return (
    <>
      <div>
        <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;
