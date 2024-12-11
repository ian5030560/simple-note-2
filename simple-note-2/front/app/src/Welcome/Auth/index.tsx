import React, { useState } from "react";
import { Flex } from "antd";
import SignIn from "./signIn";
import SignUp from "./signUp";
import styles from "./index.module.css";

enum CURRENT {
  SIGNIN = 0,
  SIGNUP = 1,
}

export default function Auth() {
  const [current, setCurrent] = useState(CURRENT.SIGNIN);

  return <Flex justify="center" align="center" style={{minHeight: "100%"}}>
    <div className={styles.authContainer}>
      {
        current === CURRENT.SIGNIN ?
          <SignIn onChange={() => setCurrent(CURRENT.SIGNUP)} /> :
          <SignUp onChange={() => setCurrent(CURRENT.SIGNIN)} />
      }
    </div>
  </Flex>
};
