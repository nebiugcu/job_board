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
      {userInfo &&
        (userInfo.is_employer ? (
          <NavContentEmployer
            username={userInfo && userInfo.name}
            profile_pic={userInfo && userInfo.profile_picture}
            firstName={userInfo && userInfo.firstName}
            lastName={userInfo && userInfo.lastName}
          />
        ) : (
          <NavContentJobSeeker
            username={userInfo && userInfo.name}
            profile_pic={userInfo && userInfo.profile_picture}
            job_seeker_id={userInfo && userInfo.job_seeker_id}
            firstName={userInfo && userInfo.firstName}
            lastName={userInfo && userInfo.lastName}
          />
        ))}
    </div>
  );
};

export default NavContent;
