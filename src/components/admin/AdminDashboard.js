import React, { useState, useEffect, useCallback } from "react";
import AdminNav from "../nav/AdminNav";
import { getOrders, changeStatus } from "../../functions/admin";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Orders from "./orders/Orders";

function AdminDashboard() {
  const { user } = useSelector((state) => ({ ...state }));
  const [orders, setOrders] = useState([]);

  const loadOrders = useCallback(() => {
    getOrders(user.token).then((res) => {
      setOrders(res.data);
    });
  }, [user.token]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = (orderId, orderStatus) => {
    changeStatus(orderId, orderStatus, user.token)
      .then((res) => {
        toast.success("Status updated");
        loadOrders();
      })
      .catch((err) => {
        toast.error("Something went wrong!");
      });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          <h4>Admin Dashboard</h4>
          <Orders orders={orders} handleStatusChange={handleStatusChange} />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
