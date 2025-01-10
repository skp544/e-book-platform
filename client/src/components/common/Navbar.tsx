import {
  Navbar as NextUiNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Badge,
} from "@nextui-org/react";
import { FaBookReader } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import ProfileOptions from "../profile/ProfileOptions.tsx";
import DarkModeSwitch from "./DarkModeSwitch.tsx";
import useCart from "../../hooks/useCart.ts";

const Navbar = () => {
  const { totalCount } = useCart();

  return (
    <NextUiNavbar>
      <NavbarBrand>
        <Link to={"/"} className={"flex items-center justify-center space-x-2"}>
          <FaBookReader size={24} />
          <p className="font-bold text-inherit">Store</p>
        </Link>
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem>
          <DarkModeSwitch />
        </NavbarItem>
        <NavbarItem>
          <Link to="/cart">
            <Badge content={totalCount} color={"danger"} shape={"circle"}>
              <FaCartShopping size={24} />
            </Badge>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <ProfileOptions />
        </NavbarItem>
      </NavbarContent>
    </NextUiNavbar>
  );
};

export default Navbar;
