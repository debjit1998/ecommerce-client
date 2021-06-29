import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import {
  getCoupons,
  removeCoupon,
  createCoupon,
} from "../../../functions/coupon";
import { DeleteOutlined } from "@ant-design/icons";
import "react-datepicker/dist/react-datepicker.css";
import AdminNav from "../../nav/AdminNav";

function CreateCouponPage() {
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    getCoupons().then((res) => {
      setCoupons(res.data);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createCoupon({ name, expiry, discount }, user.token)
      .then((res) => {
        getCoupons().then((res) => {
          setCoupons(res.data);
          setLoading(false);
        });
        setName("");
        setDiscount("");
        setExpiry("");
        toast.success(`"${res.data.name}" is created`);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error(err.response.data);
      });
  };

  const handleRemove = (id) => {
    if (window.confirm("Delete?")) {
      setLoading(true);
      removeCoupon(id, user.token)
        .then((res) => {
          getCoupons().then((res) => {
            setCoupons(res.data);
            setLoading(false);
          });
          toast.success(`Coupon "${res.data.name}" deleted`);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          toast.error(err.response.data);
        });
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Coupons</h4>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="text-muted">Name</label>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                value={name}
                autoFocus
                required
              />
            </div>
            <div className="form-group">
              <label className="text-muted">Discount %</label>
              <input
                type="text"
                onChange={(e) => setDiscount(e.target.value)}
                className="form-control"
                value={discount}
                required
              />
            </div>
            <div className="form-group">
              <label className="text-muted">Expiry</label>
              <br />
              <DatePicker
                className="form-control"
                selected={new Date()}
                value={expiry}
                required
                onChange={(date) => setExpiry(date)}
              />
            </div>

            <button className="btn btn-outline-primary">Save</button>
          </form>

          <br />
          <h4>{coupons.length} coupons</h4>

          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col" style={{ textAlign: "center" }}>
                  Name
                </th>
                <th scope="col" style={{ textAlign: "center" }}>
                  Expiry
                </th>
                <th scope="col" style={{ textAlign: "center" }}>
                  Discount
                </th>
                <th scope="col" style={{ textAlign: "center" }}>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {coupons.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{new Date(c.expiry).toLocaleDateString()}</td>
                  <td>{c.discount} %</td>
                  <td>
                    <DeleteOutlined
                      className="text-danger pointer"
                      onClick={() => handleRemove(c._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CreateCouponPage;
