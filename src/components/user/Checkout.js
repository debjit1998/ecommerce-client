import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getUserCart,
  emptyUserCart,
  saveUserAddress,
  applyCoupon,
  createCashOrderForUser,
} from "../../functions/user";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function Checkout({ history }) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState();
  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [discountError, setDiscountError] = useState("");

  const dispatch = useDispatch();

  const { user, cod } = useSelector((state) => ({ ...state }));
  const couponTrueOrFalse = useSelector((state) => state.coupon);

  useEffect(() => {
    getUserCart(user.token).then((res) => {
      console.log(JSON.stringify(res.data.products, null, 4));
      setProducts(res.data.products);
      setTotal(res.data.cartTotal);
    });
  }, [user.token]);

  const saveAddressToDb = () => {
    //console.log(address.replace(/<(.|\n)*?>/g, "").trim().length);
    if (address.replace(/<(.|\n)*?>/g, "").trim().length === 0) {
      toast.error("Address cannot be empty");
      return;
    }
    saveUserAddress(address, user.token).then((res) => {
      if (res.data.ok) {
        setAddressSaved(true);
        toast.success("Address saved.");
      }
    });
  };

  const emptyCart = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");

      dispatch({
        type: "ADD_TO_CART",
        payload: [],
      });

      emptyUserCart(user.token).then((res) => {
        setProducts([]);
        setTotal(0);
        setTotalAfterDiscount(0);
        setCoupon("");
        toast.success("Cart is empty. Continue shopping");
      });
    }
  };

  const showAddress = () => {
    return (
      <>
        <ReactQuill theme="snow" value={address} onChange={setAddress} />
        <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>
          Save
        </button>
      </>
    );
  };

  const showProductSummary = () => {
    return products.map((p, i) => (
      <div key={i}>
        <p>
          {p.product.title} ({p.color}) x {p.count} = Rs.
          {p.product.price * p.count}
        </p>
      </div>
    ));
  };

  const applyDiscountCoupon = () => {
    applyCoupon(coupon, user.token)
      .then((res) => {
        setTotalAfterDiscount(res.data);
        dispatch({
          type: "COUPON_APPLIED",
          payload: true,
        });
      })
      .catch((err) => {
        setDiscountError(err.response.data);
        setTotalAfterDiscount(0);
        dispatch({
          type: "COUPON_APPLIED",
          payload: false,
        });
      });
  };

  const showApplyCoupon = () => {
    return (
      <>
        <input
          type="text"
          onChange={(e) => {
            setCoupon(e.target.value);
            setDiscountError("");
          }}
          className="form-control"
          value={coupon}
        />
        <button onClick={applyDiscountCoupon} className="btn btn-primary mt-2">
          Apply
        </button>
      </>
    );
  };

  const createCashOrder = () => {
    createCashOrderForUser(user.token, cod, couponTrueOrFalse).then((res) => {
      console.log(res.data);
      if (res.data.ok) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("cart");
        }

        dispatch({
          type: "ADD_TO_CART",
          payload: [],
        });
        dispatch({
          type: "COUPON_APPLIED",
          payload: false,
        });
        dispatch({
          type: "COD",
          payload: false,
        });

        emptyUserCart(user.token);

        setTimeout(() => {
          history.push("/user/history");
        }, 1000);
      }
    });
  };

  return (
    <div className="row" style={{ margin: "0 10px" }}>
      <div className="col-md-6">
        <h4>Delivery Address</h4>
        <br />
        <br />
        {showAddress()}
        <hr />
        <h4>Got Coupon?</h4>
        <br />
        {showApplyCoupon()}
        <br />
        {discountError && <p className="bg-danger p-2">{discountError}</p>}
      </div>

      <div className="col-md-6">
        <h4>Order Summary</h4>
        <hr />
        <p>{products.length} Product(s)</p>
        <hr />
        {showProductSummary()}
        <hr />
        <p>
          Cart Total: <b>Rs.{total}</b>
        </p>

        {totalAfterDiscount > 0 && (
          <p className="bg-success p-2">
            Discount applied. Total payable: ${totalAfterDiscount}
          </p>
        )}

        <div className="row">
          <div className="col-md-6">
            {cod ? (
              <button
                className="btn btn-primary"
                disabled={!addressSaved || !products.length}
                onClick={createCashOrder}
              >
                Place Order
              </button>
            ) : (
              <button
                className="btn btn-primary"
                disabled={!addressSaved || !products.length}
                onClick={() => history.push("/payment")}
              >
                Place Order
              </button>
            )}
          </div>
          <div className="col-md-6">
            <button
              className="btn btn-primary"
              onClick={emptyCart}
              disabled={!products.length}
            >
              Empty Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
