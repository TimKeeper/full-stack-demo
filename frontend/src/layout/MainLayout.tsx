import {
  DashboardOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ProLayout } from "@ant-design/pro-components";
import { Dropdown } from "antd";
import * as React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ProLayout
      title="Admin System"
      logo="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
      layout="mix"
      splitMenus={false}
      fixedHeader
      fixSiderbar
      location={{
        pathname: location.pathname,
      }}
      menuItemRender={(item, dom) => (
        <div
          onClick={() => {
            navigate(item.path || "/");
          }}
        >
          {dom}
        </div>
      )}
      avatarProps={{
        src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
        title: "Jeremy Sun",
        render: (_props, dom) => {
          return (
            <Dropdown
              menu={{
                items: [
                  {
                    key: "logout",
                    icon: <LogoutOutlined />,
                    label: "Logout",
                    onClick: () => {
                      // Implement logout logic
                    },
                  },
                ],
              }}
            >
              {dom}
            </Dropdown>
          );
        },
      }}
      route={{
        routes: [
          {
            path: "/dashboard",
            name: "Dashboard",
            icon: <DashboardOutlined />,
          },
          {
            path: "/users",
            name: "User Management",
            icon: <UserOutlined />,
          },
        ],
      }}
    >
      <Outlet />
    </ProLayout>
  );
};

export default MainLayout;
