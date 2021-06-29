import React from "react";
import { Link } from "react-router-dom";
import { Card } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Laptop from "../../images/laptop.jpg";
const { Meta } = Card;

function AdminProductCard({ product, handleRemove }) {
  const { title, description, images, slug } = product;
  return (
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
        <Link to={`/admin/product/${slug}`}>
          <EditOutlined className="text-warning" />
        </Link>,
        <DeleteOutlined
          className="text-danger"
          onClick={() => handleRemove(slug)}
        />,
      ]}
    >
      <Meta title={title} description={`${description.substring(0, 40)}...`} />
    </Card>
  );
}

export default AdminProductCard;
