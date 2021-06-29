import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSubs } from "../../functions/sub";

function SubList() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSubs().then((c) => {
      setSubs(c.data);
      setLoading(false);
    });
  }, []);

  const showSubs = () => {
    return subs.map((s) => (
      <div
        className="col btn btn-outlined-primary btn-lg btn-block btn-raised m-3"
        key={s._id}
      >
        <Link to={`/sub/${s.slug}`}>{s.name}</Link>
      </div>
    ));
  };

  return (
    <div className="container">
      <div className="row">
        {loading ? (
          <h4 className="text-center text-danger">Loading...</h4>
        ) : (
          showSubs()
        )}
      </div>
    </div>
  );
}

export default SubList;
