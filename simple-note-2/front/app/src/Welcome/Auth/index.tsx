import React, { useState } from "react";
import { Flex } from "antd";
import SignIn from "./signIn";
import SignUp from "./signUp";
import styles from "./index.module.css";

enum CURRENT {
  SIGNIN = 0,
  SIGNUP = 1,
}

const Auth: React.FC = () => {
  const [current, setCurrent] = useState(CURRENT.SIGNIN);

  return <Flex justify="center" style={{ height: "100%" }}>
    <div className={styles.authContainer}>
      {current === CURRENT.SIGNIN && <SignIn onChange={() => setCurrent(CURRENT.SIGNUP)} />}
      {current === CURRENT.SIGNUP && <SignUp onChange={() => setCurrent(CURRENT.SIGNIN)} />}
    </div>
  </Flex>
};

export default Auth;
