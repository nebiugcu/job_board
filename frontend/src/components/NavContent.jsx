import React, { useEffect } from "react";
import NavContentEmployer from "./NavContentEmployer";
import NavContentJobSeeker from "./NavContentJobSeeker";

const NavContent = ({ userInfo }) => {
  useEffect(() => {
    console.log(userInfo);
    console.log("and;lkfja;sl");
  }, []);
  return (
    <div>
      {userInfo.is_employer ? <NavContentEmployer username={userInfo.name} profile_pic={userInfo.profile_picture} /> : <NavContentJobSeeker username={userInfo.name} profile_pic={userInfo.profile_picture} />}
    </div>
  );
};

export default NavContent;
