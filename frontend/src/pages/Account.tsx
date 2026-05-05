import React from "react";
import { useAppData } from "../context/AppContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthService } from "../main";
import { toast } from "react-hot-toast";
import { BiPackage, BiMapPin, BiLogOut } from "react-icons/bi";
const Account = () => {
  const { user, setUser, setIsAuth } = useAppData();
  const firstuser = user?.name.charAt(0).toUpperCase();

  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      const result = await axios.post(
        `${AuthService}/api/auth/logout`,
        {},
        { withCredentials: true },
      );
      setUser(null);
      setIsAuth(false);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      console.log(err);
      toast.error("Logout failed");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-md rounded-lg bg-white shadow-sm">
        <div className="flex items-center gap-4 border-b p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-xl font-semibold text-white ">
            {firstuser}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
        <div className="divide-y ">
          <div
            className="flex cursor-pointer items-center gap-4 p-5 hover:bg-gray-50"
            onClick={() => navigate("/orders")}
          >
            <BiPackage className="h-5 w-5 text-red-500" />
            <span className="font-medium">Your Orders</span>
          </div>
        </div>
        <div className="divide-y ">
          <div
            className="flex cursor-pointer items-center gap-4 p-5 hover:bg-gray-50"
            onClick={() => navigate("/address")}
          >
            <BiMapPin className="h-5 w-5 text-red-500" />
            <span className="font-medium">Address</span>
          </div>
        </div>
        <div className="divide-y ">
          <div
            className="flex cursor-pointer items-center gap-4 p-5 hover:bg-gray-50"
            onClick={logoutHandler}
          >
            <BiLogOut className="h-5 w-5 text-red-500" />
            <span className="font-medium">Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
