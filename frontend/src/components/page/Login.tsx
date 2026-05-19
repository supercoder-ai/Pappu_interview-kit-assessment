/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { Button, Form, Input, message } from "antd";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../../services";
import { useAuth } from "../../context/AuthContext.tsx";

const requiredLabel = (text: string) => (
  <span>
    <span className="text-red-500">*</span> {text}
  </span>
);

const Login: FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const onSubmit = async (values: { email: string; password: string }) => {
    try {
      const user = await loginAPI(values.email, values.password);
      setUser(user);
      navigate("/home");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      message.error(err?.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Form
        layout="vertical"
        onFinish={onSubmit}
        requiredMark={false}
        
      >
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
          Eye Care App Interview
        </h2>

        <Form.Item
          label={requiredLabel("Email")}
          name="email"
          rules={[
            { required: true, message: "Please enter your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="Enter your email" size="large" />
        </Form.Item>

        <Form.Item
          label={requiredLabel("Password")}
          name="password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password placeholder="Enter your password" size="large" />
        </Form.Item>

        <Form.Item className="mb-0 mt-2">
          <Button type="primary" htmlType="submit" block size="large">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
