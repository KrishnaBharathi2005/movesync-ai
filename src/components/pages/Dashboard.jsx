import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>

      <h1>Welcome to MoveSync AI</h1>

      <p>You are successfully logged in.</p>

      <button onClick={logout}>
        Logout
      </button>

    </div>
  );
}

export default Dashboard;
