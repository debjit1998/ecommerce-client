import React, { useState, useEffect, useCallback } from "react";
import UserNav from "../nav/UserNav";
import { getWishlist, removeFromWishlist } from "../../functions/user";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { DeleteOutlined } from "@ant-design/icons";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));

  const loadWishlist = useCallback(() => {
    getWishlist(user.token).then((res) => {
      console.log(res.data.wishlist);
      setWishlist(res.data.wishlist);
    });
  }, [user.token]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const handleRemove = (productId) => {
    removeFromWishlist(productId, user.token)
      .then((res) => {
        toast.success("Product removed successfully");
        loadWishlist();
      })
      .catch((err) => {
        toast.error("Something went wrong!");
      });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col-md-10">
          <h4>Wishlist</h4>

          {wishlist.map((p) => (
            <div className="alert alert-secondary" key={p._id}>
              <Link to={`/product/${p.slug}`}>{p.title}</Link>
              <span
                onClick={() => handleRemove(p._id)}
                className="btn btn-small float-right"
                style={{ marginTop: "-5px" }}
              >
                <DeleteOutlined className="text-danger" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
