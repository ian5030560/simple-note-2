import React, { useState } from "react";
import { Flex } from "antd";
import SignIn from "./signIn";
import SignUp from "./signUp";

enum CURRENT {
  SIGNIN = 0,
  SIGNUP = 1,
}

const Auth: React.FC = () => {
  const [current, setCurrent] = useState(CURRENT.SIGNIN);

  return <Flex justify="center">
    {current === CURRENT.SIGNIN && <SignIn onChange={() => setCurrent(CURRENT.SIGNUP)}/>}
    {current === CURRENT.SIGNUP && <SignUp onChange={() => setCurrent(CURRENT.SIGNIN)}/>}
  </Flex>
};

export default Auth;
