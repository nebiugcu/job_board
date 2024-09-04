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
      {userInfo.is_employer ? <NavContentEmployer /> : <NavContentJobSeeker />}
    </div>
  );
};

export default NavContent;
