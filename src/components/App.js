import { useEffect, lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import "antd/dist/antd.css";
import "react-toastify/dist/ReactToastify.css";

import { auth } from "../firebase";
import { currentUser } from "../functions/auth";
import { LoadingOutlined } from "@ant-design/icons";

const UserRoute = lazy(() => import("./routes/UserRoute"));
const AdminRoute = lazy(() => import("./routes/AdminRoute"));
const Home = lazy(() => import("./Home"));
const Product = lazy(() => import("./Product"));
const Login = lazy(() => import("./auth/Login"));
const Register = lazy(() => import("./auth/Register"));
const RegisterComplete = lazy(() => import("./auth/RegisterComplete"));
const Header = lazy(() => import("./nav/Header"));
const SideDrawer = lazy(() => import("./drawer/SideDrawer"));
const History = lazy(() => import("./user/History"));
const Password = lazy(() => import("./user/Password"));
const Wishlist = lazy(() => import("./user/Wishlist"));
const CategoryCreate = lazy(() => import("./admin/category/CategoryCreate"));
const CategoryUpdate = lazy(() => import("./admin/category/CategoryUpdate"));
const SubCreate = lazy(() => import("./admin/sub/SubCreate"));
const SubUpdate = lazy(() => import("./admin/sub/SubUpdate"));
const ProductCreate = lazy(() => import("./admin/product/ProductCreate"));
const AllProducts = lazy(() => import("./admin/product/AllProducts"));
const ProductUpdate = lazy(() => import("./admin/product/ProductUpdate"));
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));
const ForgotPassword = lazy(() => import("./auth/ForgotPassword"));

const CategoryHome = lazy(() => import("./category/CategoryHome"));
const SubHome = lazy(() => import("./sub/SubHome"));
const Shop = lazy(() => import("./Shop"));
const Cart = lazy(() => import("./Cart"));
const Checkout = lazy(() => import("./user/Checkout"));
const CreateCouponPage = lazy(() => import("./admin/coupon/CreateCouponPage"));
const Payment = lazy(() => import("./user/Payment"));

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        currentUser(idTokenResult.token)
          .then((res) => {
            console.log(res);
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name: res.data.name,
                email: user.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });

    return unsubscribe;
  }, [dispatch]);
  return (
    <Suspense
      fallback={
        <div className="col text-center p-5">
          __Ec <LoadingOutlined />
          mmerce__
        </div>
      }
    >
      <Header />
      <SideDrawer />
      <ToastContainer />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/product/:slug" exact component={Product} />
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <Route path="/register/complete" exact component={RegisterComplete} />
        <Route path="/forgot/password" exact component={ForgotPassword} />
        <Route path="/category/:slug" exact component={CategoryHome} />
        <Route path="/sub/:slug" exact component={SubHome} />
        <Route path="/shop" exact component={Shop} />
        <Route path="/cart" exact component={Cart} />
        <UserRoute path="/user/history" exact component={History} />
        <UserRoute path="/user/password" exact component={Password} />
        <UserRoute path="/user/wishlist" exact component={Wishlist} />
        <UserRoute path="/payment" exact component={Payment} />
        <UserRoute path="/checkout" exact component={Checkout} />
        <AdminRoute path="/admin/dashboard" exact component={AdminDashboard} />
        <AdminRoute path="/admin/category" exact component={CategoryCreate} />
        <AdminRoute
          path="/admin/category/:slug"
          exact
          component={CategoryUpdate}
        />
        <AdminRoute path="/admin/sub" exact component={SubCreate} />
        <AdminRoute path="/admin/sub/:slug" exact component={SubUpdate} />
        <AdminRoute path="/admin/product/" exact component={ProductCreate} />
        <AdminRoute path="/admin/products/" exact component={AllProducts} />
        <AdminRoute
          path="/admin/product/:slug"
          exact
          component={ProductUpdate}
        />
        <AdminRoute path="/admin/coupon/" exact component={CreateCouponPage} />
      </Switch>
    </Suspense>
  );
}

export default App;
