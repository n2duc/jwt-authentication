import { LogOut } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { handleLogoutAPI } from "../apis";
import ListUsersTable from "../components/ListUsersTable";

const Dashboard = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await handleLogoutAPI();
    // Điều huống về trang Login khi Logout
    navigate("/login");
  };
  return (
    <div>
      <h1>Admin Page</h1>
      <Button className="w-full" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" /> Logout
      </Button>
      <ListUsersTable />
    </div>
  );
};

export default Dashboard;