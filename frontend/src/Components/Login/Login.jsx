import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../../redux/apiRequest";
import { useDispatch } from "react-redux";
const Login = () => {
    
    const [userName , setUserName] = useState(""); 
    const [passWord , setPassWord] = useState(""); 
    const dispatch = useDispatch(); 
    const navigate = useNavigate();
    const handleLogin = (e) => {
        e.preventDefault();
        const newuser = {
            userName: userName, 
            passWord: passWord
        }
        loginUser(newuser, dispatch, navigate)
    }

    return ( 
        <section className="login-container">
            <div className="login-title"> Log in</div>
            <form onSubmit={handleLogin}>
                <label>USERNAME</label>
                <input type="text" placeholder="Enter your username" onChange={(e) => setUserName(e.target.value)}/>
                <label>PASSWORD</label>
                <input type="password" placeholder="Enter your password" onChange={(e) => setPassWord(e.target.value)}/>
                <button type="submit"> Continue </button>
            </form>
            <div className="login-register"> Don't have an account yet? </div>
            <Link className="login-register-link" to="/register">Register one for free </Link>
        </section>
     );
}
 
export default Login;