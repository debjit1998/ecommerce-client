import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ProductCardInCheckout from "./cards/ProductCardInCheckout";
import { userCart } from "../functions/user";

function Cart({ history }) {
  const { user, cart } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  const getTotal = () => {
    return cart.reduce((current, next) => {
      return current + next.count * next.price;
    }, 0);
  };

  const saveOrderToDb = () => {
    userCart(cart, user.token)
      .then((res) => {
        if (res.data.ok) {
          history.push("/checkout");
        }
      })
      .catch((err) => {
        console.log("cart save error", err);
      });
  };

  const saveCashOrderToDb = () => {
    dispatch({
      type: "COD",
      payload: true,
    });

    userCart(cart, user.token)
      .then((res) => {
        if (res.data.ok) {
          history.push("/checkout");
        }
      })
      .catch((err) => {
        console.log("cart save error", err);
      });
  };

  const showCartItems = () => {
    return (
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th scope="col">Image</th>
            <th scope="col">Title</th>
            <th scope="col">Price</th>
            <th scope="col">Brand</th>
            <th scope="col">Color</th>
            <th scope="col">Count</th>
            <th scope="col">Shipping</th>
            <th scope="col">Remove</th>
          </tr>
        </thead>

        {cart.map((p) => (
          <ProductCardInCheckout key={p._id} p={p} />
        ))}
      </table>
    );
  };

  return (
    <div className="container-fluid pt-2">
      <div className="row">
        <div className="col">
          <h4>Cart / {cart.length} Product(s)</h4>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8">
          {!cart.length ? (
            <p>
              No products in the cart.{" "}
              <Link to="/shop">Continue shopping.</Link>
            </p>
          ) : (
            showCartItems()
          )}
        </div>
        <div className="col-md-4">
          <h4>Order Summary</h4>
          <hr />
          <p>Products</p>
          {cart.map((c, i) => (
            <div key={i}>
              <p>
                {c.title} * {c.count} = Rs.{c.price * c.count}
              </p>
            </div>
          ))}
          <hr />
          Total: <b>Rs.{getTotal()}</b>
          <hr />
          {user ? (
            <>
              <button
                className="btn btn-small btn-primary mt-2"
                onClick={saveOrderToDb}
                disabled={!cart.length}
              >
                Proceed to Checkout
              </button>
              <br />
              <button
                className="btn btn-small btn-warning mt-2"
                onClick={saveCashOrderToDb}
                disabled={!cart.length}
              >
                Pay Cash on delivery
              </button>
            </>
          ) : (
            <button className="btn btn-small btn-primary mt-2">
              <Link
                to={{
                  pathname: "/login",
                  state: { from: "/cart" },
                }}
              >
                Login to Checkout
              </Link>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;
