import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {
  CircularProgress,
  IconButton,
  Tooltip,
  Container,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DataGridLayout } from "../Components/DataGridLayout";
import { useNavigate, useLocation } from "react-router-dom";
import { Visibility } from "@mui/icons-material";
import { useAuth } from "../Auth/AuthProvider";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { StatusBox } from "../Components/StatusBox";
const ProjectItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authState } = useAuth();
  console.log("authState", authState?.user?.user_id);
  const userId = authState.user.user_id;
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState();
  const projectId = location.state?.row?.id;
  const projectName = location.state?.row?.name;
  const URL = `http://127.0.0.1:8000/tasks/project/${projectId}`;

  const fetchTasks = () => {
    axios.get(URL).then((response) => {
      setTasks(response.data);
      console.log(response.data);
    });
  };
  const handleShowTask = useCallback(
    (id, row) => () => {
      navigate("/tasks/item", { state: { id: id, row: row } });

      // console.log("id", id);
      console.log("row", row);
    },
    []
  );
  useEffect(() => {
    fetchTasks();
  }, [tasks]);
  // console.log("Tasks", tasks);
  const columns = [
    { field: "id", headerName: "id", description: "", flex: 0.01 },
    { field: "name", headerName: "Task", description: "", flex: 0.1 },
    {
      field: "project_id",
      headerName: "Project Name",
      description: "",
      flex: 0.1,
      renderCell: (params) => {
        // console.log("PARAMS", params);
        return (
          <>
            <Typography>{params.value.name}</Typography>
          </>
        );
      },
    },
    {
      field: "assigned_to",
      headerName: "Assigned To",
      description: "",
      flex: 0.1,
      renderCell: (params) => {
        // console.log("PARAMS", params);
        return (
          <>
            {/* check if is logged in, display oly mine apart from Manager */}
            <Typography>{params.value.username}</Typography>
          </>
        );
      },
    },

    // { field: "planned_start_date", headerName: "Date Started", description: "", flex: 0.1 },
    {
      field: "planned_budget",
      headerName: "Budget",
      description: "",
      flex: 0.1,
    },
    {
      field: "current_expense",
      headerName: "Expense",
      description: "",
      flex: 0.1,
    },

    {
      field: "status",
      headerName: "Status",
      description: "",
      flex: 0.1,
      renderCell: (params) => {
        if (params.row.status === "pending") {
          return <StatusBox status="Pending" color="danger" />;
          // return(

          //   <Chip label="Facebook" color="primary" icon={<FacebookIcon />} />
          // )
        }
        if (params.row.status === "inprogress") {
          return <StatusBox status="inprogress" color="primaryLight" />;
        }
        if (params.row.status === "completed") {
          return <StatusBox status="completed" color="success" />;
        }
      },
    },
    {
      field: "priority",
      headerName: "Priority",
      description: "",
      flex: 0.1,
      renderCell: (params) => {
        if (params.row.priority === "high") {
          return <StatusBox status="High" color="danger" />;
          // return(

          //   <Chip label="Facebook" color="primary" icon={<FacebookIcon />} />
          // )
        }
        if (params.row.priority === "medium") {
          return <StatusBox status="Medium" color="primaryLight" />;
        }
        if (params.row.priority === "low") {
          return <StatusBox status="Low" color="success" />;
        }
      },
    },
    {
      field: "planned_end_date",
      headerName: "Due Date",
      description: "",
      flex: 0.1,
    },
    {
      field: "View Details",
      headerName: "View ",
      description: "",
      flex: 0.02,
      renderCell: (params) => {
        return (
          <Tooltip title="View">
            <IconButton
              color="primary"
              aria-label="view"
              onClick={handleShowTask(params.row.Caseid, params.row)}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
        );
      },
    },

    // { field: "quantity", headerName: "Quantity", description: "", flex: 0.1 },
  ];

  return (
    <div>
      <Container maxWidth="xl">
        <Box sx={{ backgroundColor: "#ffffff", pt: 2 }}>
          <Grid container justifyContent="Start" sx={{ mb: 2, mr: 3 }}>
            <Typography variant="h5" component="h5">
              Tasks in {projectName} Project
            </Typography>

            {/* onClick={handleCreateDialogOpen} */}
          </Grid>
          <DataGridLayout>
            <DataGrid
              rowHeight={50}
              rows={tasks}
              //  if tabValue is 0 show all data

              columns={columns}
              getRowId={(row) => row.id}
              pageSize={20}
            />
          </DataGridLayout>
        </Box>
      </Container>
    </div>
  );
};

export default ProjectItem;
