import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase";
import { Menu, Badge } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Search from "../forms/Search";

import {
  SettingOutlined,
  AppstoreAddOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

const { SubMenu, Item } = Menu;

function Header() {
  let dispatch = useDispatch();
  let history = useHistory();
  let { user, cart } = useSelector((state) => {
    return { ...state };
  });

  history.listen((location, action) => {
    //console.log(location.pathname);
    if (location.pathname.split("/").includes("shop")) {
      setCurrent("shop");
      return;
    }
    if (location.pathname.split("/").includes("cart")) {
      setCurrent("cart");
      return;
    }
    if (location.pathname.split("/").includes("login")) {
      setCurrent("login");
      return;
    }
    if (location.pathname.split("/").includes("register")) {
      setCurrent("register");
      return;
    }
    setCurrent("");
  });

  useEffect(() => {
    console.log(window.location.href);
    if (
      window.location.href.split("/").includes("shop") ||
      window.location.href.includes("shop")
    ) {
      setCurrent("shop");
      return;
    }
    if (window.location.href.split("/").includes("cart")) {
      setCurrent("cart");
      return;
    }
    if (window.location.href.split("/").includes("login")) {
      setCurrent("login");
      return;
    }
    if (window.location.href.split("/").includes("register")) {
      setCurrent("register");
      return;
    }
    if (
      window.location.href.split("/").includes("admin") ||
      window.location.href.split("/").includes("user") ||
      window.location.href.split("/").includes("checkout")
    ) {
      setCurrent("");
      return;
    }
  }, []);

  const [current, setCurrent] = useState("home");
  const handleClick = (e) => {
    setCurrent(e.key);
  };

  const logout = () => {
    firebase.auth().signOut();
    dispatch({
      type: "LOGOUT",
      payload: null,
    });
    window.localStorage.removeItem("cart");
    dispatch({
      type: "ADD_TO_CART",
      payload: [],
    });
    history.push("/login");
  };

  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
      <Item key="home" icon={<AppstoreAddOutlined />}>
        <Link to="/">Home</Link>
      </Item>

      <Item key="shop" icon={<ShoppingOutlined />}>
        <Link to="/shop">Shop</Link>
      </Item>

      <Item key="cart" icon={<ShoppingCartOutlined />}>
        <Link to="/cart">
          <Badge count={cart.length} offset={[9, 0]}>
            Cart
          </Badge>
        </Link>
      </Item>

      {!user && (
        <Item key="register" icon={<UserAddOutlined />} className="float-right">
          <Link to="/register">Register</Link>
        </Item>
      )}
      {!user && (
        <Item key="login" icon={<UserOutlined />} className="float-right">
          <Link to="/login">Login</Link>
        </Item>
      )}
      {user && (
        <SubMenu
          key="SubMenu"
          icon={<SettingOutlined />}
          title={user.email && user.email.split("@")[0]}
          className="float-right"
        >
          {user && user.role === "subscriber" && (
            <Item>
              <Link to="/user/history">Dashboard</Link>
            </Item>
          )}
          {user && user.role === "admin" && (
            <Item>
              <Link to="/admin/dashboard">Dashboard</Link>
            </Item>
          )}
          <Item icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Item>
        </SubMenu>
      )}

      <span className="float-right p-1">
        <Search />
      </span>
    </Menu>
  );
}

export default Header;
