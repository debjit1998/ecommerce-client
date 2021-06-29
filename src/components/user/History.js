import React, { useState, useEffect, useCallback } from "react";
import UserNav from "../nav/UserNav";
import { getUserOrders } from "../../functions/user";
import { useSelector, useDispatch } from "react-redux";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import ShowPaymentInfo from "./ShowPaymentInfo";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Invoice from "../cards/Invoice";

function History() {
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));

  const loadUserOrders = useCallback(() => {
    getUserOrders(user.token).then((res) => {
      setOrders(res.data);
    });
  }, [user.token]);

  useEffect(() => {
    loadUserOrders();
  }, [loadUserOrders]);

  const showOrderInTable = (order) => {
    return (
      <table className="table table-bordered">
        <thead className="thead-light">
          <th scope="col">Title</th>
          <th scope="col">Price</th>
          <th scope="col">Brand</th>
          <th scope="col">Color</th>
          <th scope="col">Count</th>
          <th scope="col">Shipping</th>
        </thead>

        <tbody>
          {order.products.map((p, i) => (
            <tr key={i}>
              <td>
                <b>{p.product.title}</b>
              </td>
              <td>{p.product.price}</td>
              <td>{p.product.brand}</td>
              <td>{p.color}</td>
              <td>{p.count}</td>
              <td>
                <b>
                  {p.product.shipping === "Yes" ? (
                    <CheckCircleOutlined style={{ color: "green" }} />
                  ) : (
                    <CloseCircleOutlined style={{ color: "red" }} />
                  )}
                </b>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const showDownloadLink = (order) => {
    return (
      <PDFDownloadLink
        document={<Invoice order={order} />}
        className="btn btn-sm btn-block btn-outline-primary"
        fileName="invoice.pdf"
      >
        Download PDF
      </PDFDownloadLink>
    );
  };

  const showEachOrder = () => {
    return orders.reverse().map((order, i) => {
      return (
        <div key={i} className="m-5 p-3 card">
          <ShowPaymentInfo order={order} />

          {showOrderInTable(order)}
          <div className="row">
            <div className="col">{showDownloadLink(order)}</div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col text-center">
          {orders.length ? (
            <h4>User purchase orders</h4>
          ) : (
            <h4>No purchase orders</h4>
          )}

          {showEachOrder()}
        </div>
      </div>
    </div>
  );
}

export default History;
