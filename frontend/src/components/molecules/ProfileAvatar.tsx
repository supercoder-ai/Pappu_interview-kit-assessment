/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { Avatar } from "antd";
import type { FC } from "react";

type ProfileAvatarProps = {
  text: string;
  size?: number;
};

export const ProfileAvatar: FC<ProfileAvatarProps> = ({ text, size = 96 }) => {
  return (
    <Avatar
      size={size}
      style={{
        backgroundColor: "#d9d9d9",
        color: "#ffffff",
        fontSize: size * 0.32,
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {text.toUpperCase()}
    </Avatar>
  );
};
