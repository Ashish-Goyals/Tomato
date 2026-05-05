import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthService } from "../main";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { useAppData } from "../context/AppContext";
const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { fetchUser } = useAppData();

  const responseGoogle = async (authResult: any) => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${AuthService}/api/auth/login`,
        {
          code: authResult["code"],
        },
        { withCredentials: true },
      );
      await fetchUser();
      toast.success("Login Successfully");
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (res) => responseGoogle(res),
    onError: (err) => responseGoogle(err),
    flow: "auth-code",
  });
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm space-y-6 ">
        <h1 className="text-center text-3xl font-bold text-[#E23774]">
          Tomato
        </h1>{" "}
        <p className="text-center text-gray-500 text-sm">
          Log in or Sign up to continue
        </p>
        <button
          onClick={googleLogin}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border-gray-300 bg-white px-4 py-3"
        >
          <FcGoogle size={20} className="h-5 w-5" />
          <span className="text-gray-700 font-medium">
            {loading ? "Signing in..." : "Continue with Google"}
          </span>
        </button>
        <p className="text-center text-xs text-gray-400">
          By Continuing you are agree with our{" "}
          <span className="text-[#E23774]">Terms of Service</span> &{" "}
          <span className="text-[#E23774]">Privacy Policy </span> &{" "}
        </p>
      </div>
    </div>
  );
};

export default Login;
