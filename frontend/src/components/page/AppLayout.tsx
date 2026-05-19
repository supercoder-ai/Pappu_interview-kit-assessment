/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import type { FC, ReactNode } from "react";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";

const { Header, Content } = Layout;

export const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  const items: MenuProps["items"] = useMemo(() => {
    if (!user) {
      return [];
    }

    if (user.role === "optician") {
      return [
        { label: "Schedule", key: "/home" },
        { label: "Logout", key: "/logout" },
      ];
    }

    return [
      { label: "Home", key: "/home" },
      { label: "Catalogue", key: "/catalogue" },
      { label: "Logout", key: "/logout" },
    ];
  }, [user]);

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "/logout") {
      logout();
      navigate("/login");
    } else {
      navigate(e.key);
    }
  };

  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/";

  return !isLoginPage ? (
    <Layout className="min-h-screen bg-gray-100">
      <Header className="!bg-[#001529] !px-4">
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={items}
          onClick={handleMenuClick}
          className="!bg-transparent !border-none"
        />
      </Header>
      <Content className="min-h-screen">{children}</Content>
    </Layout>
  ) : (
    <div className="flex h-screen w-screen justify-center bg-gray-100">
      {children}
    </div>
  );
};
