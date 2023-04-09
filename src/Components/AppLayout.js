import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { TopNav } from "../layouts/dashboard/top-nav";
const AppLayout = () => {
    return <div style={{
        padding: '50px 0px 0px 300px'
    }}>
        <Sidebar />
        <TopNav  />
        <Outlet />
    </div>;
};

export default AppLayout;