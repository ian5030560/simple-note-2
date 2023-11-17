import React from "react";
import { Menu, Form, Container,Message } from "semantic-ui-react";

function Signin() {
  const [activeItem, setActiveItem] = React.useState("register");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <Container>
      <Menu widths="2">
        <Menu.Item
          active={activeItem === "register"}
          onClick={() => setActiveItem("register")}
        >
          註冊
        </Menu.Item>
        <Menu.Item
          active={activeItem === "signin"}
          onClick={() => setActiveItem("signin")}
        >
          登入
        </Menu.Item>
      </Menu>
      <Form>
        <Form.Input
          label="信箱(帳號)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="請輸入信箱"
        />
        <Form.Input
          label="密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="請輸入密碼"
          type="password"
        />
        <Form.Button>
          {activeItem === "register" && "註冊"}
          {activeItem === "signin" && "登入"}
        </Form.Button>
      </Form>
    </Container>    
  );
  
}

export default Signin;
