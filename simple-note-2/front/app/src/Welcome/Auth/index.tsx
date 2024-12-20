import React, { useState } from "react";
import { Flex, theme } from "antd";
import SignIn from "./signIn";
import SignUp from "./signUp";
import styles from "./index.module.css";

enum CURRENT {
  SIGNIN = 0,
  SIGNUP = 1,
}

export default function Auth() {
  const [current, setCurrent] = useState(CURRENT.SIGNIN);
  const { token } = theme.useToken();

  return <Flex justify="center" align="center" style={{ minHeight: "100%" }}>
    <div className={styles.authContainer} style={{ boxShadow: token.boxShadow }}>
      {
        current === CURRENT.SIGNIN ?
          <SignIn onChange={() => setCurrent(CURRENT.SIGNUP)} /> :
          <SignUp onChange={() => setCurrent(CURRENT.SIGNIN)} />
      }
    </div>
  </Flex>
};
