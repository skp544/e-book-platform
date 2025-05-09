import { FC } from "react";
import { Profile } from "../../types";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  User,
} from "@heroui/react";
import { Link } from "react-router-dom";

interface LinkProps {
  title: string;
  to: string;
}

const DropdownLink: FC<LinkProps> = ({ title, to }) => {
  return (
    <Link className="block w-full px-2 py-1.5" to={to}>
      {title}
    </Link>
  );
};

interface Props {
  profile: Profile;
  signOut: () => void;
}

const ProfileMenu: FC<Props> = ({ profile, signOut }) => {
  const { name, email, role, avatar } = profile;
  return (
    <div className={"flex items-center gap-4"}>
      <Dropdown placement={"bottom-start"}>
        <DropdownTrigger>
          <User
            as={"button"}
            avatarProps={{
              isBordered: true,
              src: avatar,
            }}
            className={"transition-transform"}
            name={name?.split(" ")[0]}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownSection showDivider>
            <DropdownItem
              textValue="just to remove warning"
              key="profile"
              className="h-14 gap-2"
            >
              <div>
                <p className="font-bold">Signed in as</p>
                <p className="font-bold">{email}</p>
              </div>
            </DropdownItem>
            <DropdownItem key="my_library" textValue="library" className="p-0">
              <DropdownLink title="My Library" to="/library" />
            </DropdownItem>
            <DropdownItem textValue="orders" key="orders" className="p-0">
              <DropdownLink title="My Orders" to="/orders" />
            </DropdownItem>
          </DropdownSection>

          {role === "author" ? (
            <DropdownSection showDivider>
              <DropdownItem key="analytics">Analytics</DropdownItem>
              <DropdownItem
                textValue="Create New Book"
                key="create_new_book"
                className="p-0"
              >
                <DropdownLink title="Create New Book" to="/create-new-book" />
              </DropdownItem>
            </DropdownSection>
          ) : (
            <DropdownItem
              key={"emp"}
              textValue="empty item"
              className="p-0"
            ></DropdownItem>
          )}

          <DropdownItem className={"p-0"} key="configurations">
            <DropdownLink title="Profile" to="/profile" />
          </DropdownItem>
          <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
          <DropdownItem onPress={signOut} key="logout" color="danger">
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};
export default ProfileMenu;
