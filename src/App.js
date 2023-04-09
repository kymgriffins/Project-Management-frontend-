import "./App.css";
import Projects from "./Pages/Projects";
import Tasks from "./Pages/Tasks";
import Materials from "./Pages/Materials";
import Meetings from "./Pages/Meetings";
import ProjectItem from "./Pages/ProjectItem";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import AppLayout from "./Components/AppLayout";
import TaskItem from "./Pages/TaskItem";
// import MaterialItem from "./Pages/MaterialItem";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import AuthenticatedRoute from "./Auth/AuthenticatedRoute";
import "@fontsource/inter"; // Defaults to weight 400.
import Reports from "./Pages/Reports";
import Invoices from "./Pages/Invoices";
import ReportItem from "./Pages/ReportItem";
import InvoiceItem from "./Pages/InvoiceItem";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route exact path="/" element={<AuthenticatedRoute />}>
        <Route path="/" element={<AppLayout> </AppLayout>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/item" element={<ProjectItem />} />
          <Route path="/materials" element={<Materials />} />
          {/* <Route path="/materials/item" element={<MaterialItem />} /> */}
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/tasks/item" element={<TaskItem />} />
          <Route path="/reports" element={<Reports/>}/>
          <Route path="/reports/item" element={<ReportItem/>}/>
          <Route path="/invoices" element={<Invoices/>}/>
          <Route path="/invoices/item" element={<InvoiceItem/>}/>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
