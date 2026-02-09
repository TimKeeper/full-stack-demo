
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { LoginForm, ProFormText } from "@ant-design/pro-components";
import { message } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login } from "../api/user";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return (
    <div
      style={{
        backgroundColor: "white",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LoginForm
        title="Ant Design Admin"
        subTitle="Full Stack Admin Demo"
        onFinish={async (values) => {
          try {
            const res = await login({
              username: values.username,
              password: values.password,
            });
            
            // Assuming res contains accessToken like { accessToken: '...', user: ... }
            if (res && res.accessToken) {
              localStorage.setItem("token", res.accessToken);
              message.success("Login successful!");
              
              const redirect = searchParams.get("redirect");
              navigate(redirect || "/");
              return true;
            }
          } catch (error) {
            // Error handling is usually done in request interceptor, but we can catch specific cases here
            console.error(error);
          }
          return false;
        }}
      >
        <ProFormText
          name="username"
          fieldProps={{
            size: "large",
            prefix: <UserOutlined />,
          }}
          placeholder={"admin"}
          rules={[
            {
              required: true,
              message: "Please enter username!",
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: "large",
            prefix: <LockOutlined />,
          }}
          placeholder={"password"}
          rules={[
            {
              required: true,
              message: "Please enter password!",
            },
          ]}
        />
      </LoginForm>
    </div>
  );
}
