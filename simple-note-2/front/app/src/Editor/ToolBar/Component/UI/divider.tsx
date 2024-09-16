import React from "react";
import { theme } from "antd";
import styles from "./divider.module.css";

const Divider: React.FC = () => {
    const { token } = theme.useToken();
    return <div className={styles.divider} style={{borderColor: token.colorText}}/>
}

export default Divider;