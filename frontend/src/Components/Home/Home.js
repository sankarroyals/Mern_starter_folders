import React from "react";
import { useSelector } from "react-redux";
const Home = () => {
  const { role, userName } = useSelector((store) => store.auth.loginDetails);
  return (
    <div style={{ overflowX: 'hidden' }}>
      <center>
        <h1>Welcome {userName}!</h1>

      </center>
    </div>
  );
};

export default Home;
