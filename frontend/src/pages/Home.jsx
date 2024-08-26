import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [userData, setUserData] = useState(null);
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
  return (
    <div className="min-h-[70vh]">{userData && <>{userData.isLoggedIn}</>}</div>
  );
};

export default Home;
