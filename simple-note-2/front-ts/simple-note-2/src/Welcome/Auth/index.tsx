import React, { useState } from "react";
import { Flex, theme } from "antd";
import SignIn from "./signIn";
import SignUp from "./signUp";

enum CURRENT {
  SIGNIN = 0,
  SIGNUP = 1,
}

const Auth: React.FC = () => {
  const [current, setCurrent] = useState(CURRENT.SIGNIN);
  const { token } = theme.useToken();

  return (
    <Flex
      justify="center"
      style={{
        backgroundColor: token.colorBgBase,
        minHeight: "85%",
      }}
    >
      {current === CURRENT.SIGNIN && (
        <SignIn
          onChange={() => {
            setCurrent(CURRENT.SIGNUP);
          }}
        />
      )}
      {current === CURRENT.SIGNUP && (
        <SignUp
          onChange={() => {
            setCurrent(CURRENT.SIGNIN);
          }}
        />
      )}
    </Flex>
  );
};

export default Auth;
