import "./App.css";
import Projects from "./Pages/Projects";
import Tasks from "./Pages/Tasks";
import Teams from "./Pages/Teams";
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
import TeamItem from "./Pages/TeamItem";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import AuthenticatedRoute from "./Auth/AuthenticatedRoute";
import "@fontsource/inter"; // Defaults to weight 400.
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route exact path="/" element={<AuthenticatedRoute />}>
        <Route path="/" element={<AppLayout> </AppLayout>}>
          <Route path="/home" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/item" element={<ProjectItem />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/item" element={<TeamItem />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/tasks/item" element={<TaskItem />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
