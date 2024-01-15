import React, { useState } from "react";
import { Flex, theme } from "antd";
// import AuthForm from "./form";
import SignIn from "./signIn";
import SignUp from "./signUp";

// const SignUp = ({ onChange }) => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();
//   const [cause, setCause] = useState("");

//   return (
//     <AuthForm
//       form={form}
//       id="register"
//       url="http://localhost:8000/signin/"
//       title="註冊"
//       switchText="登入"
//       onSwitch={onChange}
//       success={{
//         title: "註冊成功",
//         subtitle: "註冊成功請返回首頁登入",
//         onSuccessClose: () => navigate(0),
//       }}
//       failure={{
//         title: "註冊失敗",
//         subtitle: cause,
//         onFailure: (res) => {
//           setCause(() => {
//             switch (res.status) {
//               case 401:
//                 return "username 重複";
//               case 402:
//                 return "email 重複";
//               case 400:
//                 return "註冊錯誤，請重新輸入";
//               default:
//                 return "發生重大錯誤，請重新提交";
//             }
//           })
//         },
//       }}
//     >
//       <Form.Item
//         label="username"
//         name="username"
//         rules={[
//           {
//             required: true,
//           },
//         ]}
//       >
//         <Input />
//       </Form.Item>
//       <Form.Item
//         label="email"
//         name="email"
//         rules={[
//           {
//             type: "email",
//             required: true,
//           },
//         ]}
//       >
//         <Input type="email" />
//       </Form.Item>
//       <Form.Item
//         label="password"
//         name="password"
//         rules={[
//           {
//             required: true,
//             min: 8,
//             max: 30,
//           },
//         ]}
//       >
//         <Input.Password />
//       </Form.Item>
//     </AuthForm>
//   );
// };

const Auth = () => {
  const [current, setCurrent] = useState(0);
  const { token } = theme.useToken();

  return (
    <Flex
      justify="center"
      style={{
        backgroundColor: token.colorBgBase,
        minHeight: "85%",
      }}
    >
      {current === 0 && (
        <SignIn
          onChange={() => {
            setCurrent(1);
          }}
        />
      )}
      {current === 1 && (
        <SignUp
          onChange={() => {
            setCurrent(0);
          }}
        />
      )}
    </Flex>
  );
};

export default Auth;
