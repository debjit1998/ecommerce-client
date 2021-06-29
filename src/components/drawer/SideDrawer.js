import React from "react";
import { Drawer } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Laptop from "../../images/laptop.jpg";

const imageStyle = {
  width: "100%",
  height: "100px",
  objectFit: "cover",
};
function SideDrawer() {
  const dispatch = useDispatch();
  const { drawer, cart } = useSelector((state) => ({ ...state }));

  return (
    <Drawer
      className="text-center"
      title={`Cart / ${cart.length} Product(s)`}
      placement="right"
      closable={false}
      onClose={() => {
        dispatch({
          type: "SET_VISIBLE",
          payload: false,
        });
      }}
      visible={drawer}
    >
      {cart.map((p) => (
        <div key={p._id} className="row">
          <div className="col">
            {p.images[0] ? (
              <>
                <img src={p.images[0].url} style={imageStyle} alt="product" />
                <p className="text-center bg-secondary text-light">
                  {p.title} x {p.count}
                </p>
              </>
            ) : (
              <>
                <img src={Laptop} style={imageStyle} alt="product" />
                <p className="text-center bg-secondary text-light">
                  {p.title} x {p.count}
                </p>
              </>
            )}
          </div>
        </div>
      ))}
      <hr />
      <br />
      <Link to="/cart">
        <button
          className="text-center btn btn-primary btn-raised btn-block"
          onClick={() =>
            dispatch({
              type: "SET_VISIBLE",
              payload: false,
            })
          }
        >
          Go To Cart
        </button>
      </Link>
    </Drawer>
  );
}

export default SideDrawer;
