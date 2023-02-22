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
const ProjectItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authState } = useAuth();
  console.log("authState", authState?.user?.user_id);
  const userId = authState.user.user_id;
  const [tasks, setTasks] = useState([]);
  const projectId = location.state?.row?.id;
  const URL = `http://127.0.0.1:8000/tasks/project/${projectId}`;

  const fetchTasks = () => {
    axios.get(URL).then((response) => {
      setTasks(response.data).catch((error) =>
        console.log("This is the error", error)
      );
    });
  };
  const handleShowTask = useCallback(
    (id, row) => () => {
      navigate("/tasks/item", { state: { id: id, row: row } });
      // console.log("id", id);
      // console.log("row", row);
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

    { field: "status", headerName: "Status", description: "", flex: 0.1 },
    { field: "priority", headerName: "Priority", description: "", flex: 0.1 },
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
          {/* <Grid container justifyContent="end" sx={{ mb: 2, mr: 3 }}>
            <TextField
              fullWidth={false}
              style={{ mr: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SvgIcon color="action" fontSize="small">
                      <SearchIcon />
                    </SvgIcon>
                  </InputAdornment>
                ),
              }}
              placeholder="Search Case"
              variant="outlined"
            />

            <Button variant="contained" startIcon={<AddIcon />} >Add</Button>
onClick={handleCreateDialogOpen}

          </Grid> */}
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
