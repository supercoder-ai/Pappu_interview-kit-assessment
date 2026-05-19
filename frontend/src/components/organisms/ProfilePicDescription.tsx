/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { Descriptions } from "antd";
import { FC } from "react";
import { User } from "../../types/shared";
import { ProfileAvatar } from "../molecules/ProfileAvatar";

type ProfilePicDescriptionProps = {
  user: User;
};

export const ProfilePicDescription: FC<ProfilePicDescriptionProps> = ({
  user,
}) => {
  const initials = `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`;

  return (
    <div className="mb-6 flex items-start gap-6">
      <div className="shrink-0 pt-4 pr-3">
        <ProfileAvatar text={initials} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="mb-4 text-2xl font-bold text-gray-900">
          {user.first_name} {user.last_name}
        </h3>
        <Descriptions
          bordered
          column={1}
          size="small"
          styles={{ label: { width: 100, background: "#fafafa" } }}
        >
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{user.phone_number}</Descriptions.Item>
          <Descriptions.Item label="Birthday">
            {user.birthday &&
              new Date(user.birthday).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  );
};
