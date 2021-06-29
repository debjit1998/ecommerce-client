import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Tooltip } from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import Laptop from "../../images/laptop.jpg";
import { showAverage } from "../../functions/rating";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";

const { Meta } = Card;

function ProductCard({ product }) {
  const { images, title, description, slug, price } = product;
  const [tooltip, setTooltip] = useState("Click to add");
  const dispatch = useDispatch();

  const { user, cart } = useSelector((state) => ({ ...state }));

  const handleAddToCart = () => {
    let cart = [];
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      cart.push({
        ...product,
        count: 1,
      });
      //remove duplicates
      let unique = _.uniqWith(cart, (a, b) => {
        return a._id === b._id;
      });

      //save to local storage
      localStorage.setItem("cart", JSON.stringify(unique));

      setTooltip("Added");

      dispatch({
        type: "ADD_TO_CART",
        payload: unique,
      });

      dispatch({
        type: "SET_VISIBLE",
        payload: true,
      });
    }
  };

  return (
    <>
      {product && product.ratings && product.ratings.length > 0 ? (
        showAverage(product)
      ) : (
        <div className="text-center pb-3 pt-1">No ratings yet</div>
      )}
      <Card
        cover={
          <img
            src={images && images.length ? images[0].url : Laptop}
            style={{ height: "150px", objectFit: "cover" }}
            className="p-1"
            alt="product"
          />
        }
        actions={[
          <Link to={`/product/${slug}`}>
            <EyeOutlined className="text-warning" /> <br />
            View Product
          </Link>,
          <Tooltip title={tooltip}>
            <a onClick={handleAddToCart} disabled={product.quantity < 1}>
              <ShoppingCartOutlined className="text-danger" />
              <br />
              {product.quantity < 1 ? "Out of stock" : "Add to Cart"}
            </a>
          </Tooltip>,
        ]}
      >
        <Meta
          title={`${title} - Rs. ${price}`}
          description={`${description.substring(0, 40)}...`}
        />
      </Card>
    </>
  );
}

export default ProductCard;
