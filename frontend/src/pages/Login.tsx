import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const responseGoogle = async (authResult:any)=>{
    setLoading(true); 
    try {
        const result = await axios.post(``)
    } catch (error) {
        
    }
  }
  return <div>Login</div>;
};

export default Login;
