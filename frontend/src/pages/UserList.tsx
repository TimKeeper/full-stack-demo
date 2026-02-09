import type { ActionType, ProColumns } from "@ant-design/pro-components";
import type { CreateUserDto, User } from "../api/user";
import { PlusOutlined } from "@ant-design/icons";
import { ModalForm, ProFormText, ProTable } from "@ant-design/pro-components";
import { Button, message, Popconfirm, Tag } from "antd";
import * as React from "react";
import { useRef } from "react";
import { createUser, deleteUser, getUsers } from "../api/user";

const UserList: React.FC = () => {
  const actionRef = useRef<ActionType>(null);

  const columns: ProColumns<User>[] = [
    {
      title: "ID",
      dataIndex: "id",
      width: 48,
      search: false,
    },
    {
      title: "Username",
      dataIndex: "username",
      copyable: true,
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
    },
    {
      title: "Nickname",
      dataIndex: "nickname",
      valueType: "text",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      valueType: "dateTime",
      search: false,
      render: (_, record) => (
        <Tag>{new Date(record.created_at).toLocaleString()}</Tag>
      ),
    },
    {
      title: "Action",
      valueType: "option",
      key: "option",
      render: (_text, record, _, _action) => [
        <a
          key="editable"
          onClick={() => {
            message.info("Edit functionality implementation pending");
          }}
        >
          Edit
        </a>,
        <Popconfirm
          key="delete"
          title="Are you sure to delete?"
          onConfirm={async () => {
            await deleteUser(record.id);
            message.success("Deleted successfully");
            actionRef.current?.reload();
          }}
        >
          <a style={{ color: "red" }}>Delete</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <ProTable<User>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (_params = {}, _sort, _filter) => {
        // Here we just fetch all for demo, in real world params should be passed to backend
        const data = await getUsers();
        // Since we are not doing server-side filtering/sorting yet, we just return all data
        // ProTable expects specific format: { data: [], success: true, total: number }
        return {
          data,
          success: true,
          total: data.length,
        };
      }}
      editable={{
        type: "multiple",
      }}
      columnsState={{
        persistenceKey: "pro-table-user-list",
        persistenceType: "localStorage",
      }}
      rowKey="id"
      search={{
        labelWidth: "auto",
      }}
      dateFormatter="string"
      headerTitle="User List"
      toolBarRender={() => [
        <ModalForm<CreateUserDto>
          key="modal-form"
          title="Create New User"
          trigger={
            <Button type="primary">
              <PlusOutlined />
              New User
            </Button>
          }
          autoFocusFirstInput
          modalProps={{
            destroyOnClose: true,
          }}
          onFinish={async (values) => {
            await createUser(values);
            message.success("User created successfully");
            // Reload the table
            actionRef.current?.reload();
            return true;
          }}
        >
          <ProFormText
            name="username"
            label="Username"
            placeholder="Please enter user name"
            rules={[{ required: true, message: "Please enter username" }]}
          />
          <ProFormText.Password
            name="password"
            label="Password"
            placeholder="Please enter password"
            rules={[{ required: true, message: "Please enter password" }]}
          />
          <ProFormText
            name="nickname"
            label="Nickname"
            placeholder="Please enter nickname (Optional)"
          />
        </ModalForm>,
      ]}
    />
  );
};

export default UserList;
