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
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { DataGridLayout } from "../Components/DataGridLayout";
import { useNavigate } from "react-router-dom";
import { Visibility } from "@mui/icons-material";
import { useAuth } from "../Auth/AuthProvider";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import _ from "lodash";
import { blue, green, red, orange } from "@mui/material/colors";
import { StatusBox } from "../Components/StatusBox";
const Tasks = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  console.log("authState", authState?.user?.user_id);
  const userId = authState.user.user_id;
  const [tasks, setTasks] = useState([]);
  const URL = `http://127.0.0.1:8000/tasks/${userId}`;

  const fetchTasks = () => {
    axios.get(URL).then((response) => {
      setTasks(response.data).catch((error) =>
        console.log("This is the error", error)
      );
    });
  };
  const completedTasks = _.filter(tasks, { status: "completed" });
  const pendingTasks = _.filter(tasks, { status: "pending" });
  const onHoldTasks = _.filter(tasks, { status: "on-hold" });
  const inprogressTasks = _.filter(tasks, { status: "inprogress" });
  console.log("Completed tasks", inprogressTasks);
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
  let color = "inherit";

  switch (tasks.status) {
    case "completed":
      color = green[500];
      break;
    case "inprogress":
      color = blue[500];
      break;
    case "onhold":
      color = orange[500];
      break;
    case "pending":
      color = red[500];
      break;
    default:
      break;
  }
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
    // {
    //   field: "assigned_to",
    //   headerName: "Assigned To",
    //   description: "",
    //   flex: 0.1,
    //   renderCell: (params) => {
    //     // console.log("PARAMS", params);
    //     return (
    //       <>
    //         {/* check if is logged in, display oly mine apart from Manager */}
    //         <Typography>{params.value.username}</Typography>
    //       </>
    //     );
    //   },
    // },

    // { field: "planned_start_date", headerName: "Date Started", description: "", flex: 0.1 },
    // {
    //   field: "planned_budget",
    //   headerName: "Budget",
    //   description: "",
    //   flex: 0.1,
    // },
    // {
    //   field: "current_expense",
    //   headerName: "Expense",
    //   description: "",
    //   flex: 0.1,
    // },

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
          <Grid container spacing={4}>
            <Grid item md={4}>
              <Paper elevation={3} sx={{ borderRadius: 1 }}>
                <List>
                  {/* Pending */}
                  <Typography variant="h6" gutterBottom sx={{ pl: 2, pt: 2 }}>
                    All Tasks
                  </Typography>
                  {tasks.map((task) => (
                    <ListItem key={task.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="success"
                            checked={task.status === "completed"}
                            // onChange={() => handleTaskClick(task.id)}
                          />
                        }
                        label={
                          <ListItemText
                            primary={task.name}
                            style={{
                              // if task.status is "completed" then color green , if inprogress blue, if onhold orange, pending red
                              color:
                                task.status === "completed"
                                  ? "green"
                                  : task.status === "inprogress"
                                  ? "blue"
                                  : task.status === "onHold"
                                  ? "orange"
                                  : task.status === "pending"
                                  ? "red"
                                  : "black",

                              textDecoration:
                                task.status === "completed"
                                  ? "line-through"
                                  : "none",
                            }}
                          />
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item md={4}>
              <Paper elevation={3} sx={{ borderRadius: 1 }}>
                <List>
                  {/* Pending */}
                  <Typography variant="h6" gutterBottom sx={{ pl: 2, pt: 2 }}>
                    Pending
                  </Typography>
                  {pendingTasks.map((task) => (
                    <ListItem key={task.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={task.status === "completed"}
                            // onChange={() => handleTaskClick(task.id)}
                          />
                        }
                        label={
                          <ListItemText
                            primary={task.name}
                            style={{
                              color: red[500],
                            }}
                          />
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item md={4}>
              <Paper elevation={3} sx={{ borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ pl: 2, pt: 2 }}>
                  InProgress
                </Typography>
                <List>
                  {/* InProgress */}
                  {inprogressTasks.map((task) => (
                    <ListItem key={task.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={task.status === "completed"}
                            // onChange={() => handleTaskClick(task.id)}
                          />
                        }
                        label={
                          <ListItemText
                            primary={task.name}
                            style={{
                              color: blue[500],
                            }}
                          />
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item md={4}>
              <Paper elevation={3} sx={{ borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ pl: 2, pt: 2 }}>
                  On Hold
                </Typography>
                <List>
                  {/* On Hold */}
                  {onHoldTasks.map((task) => (
                    <ListItem key={task.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={task.status === "completed"}
                            // onChange={() => handleTaskClick(task.id)}
                          />
                        }
                        label={
                          <ListItemText
                            primary={task.name}
                            style={{
                              color: orange[500],
                            }}
                          />
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item md={4}>
              <Paper elevation={3} sx={{ borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ p: 2 }}>
                  Completed
                </Typography>
                <List>
                  {/* On Hold */}
                  {completedTasks.map((task) => (
                    <ListItem key={task.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={task.status === "completed"}
                            color="success"
                            // onChange={() => handleTaskClick(task.id)}
                          />
                        }
                        label={
                          <ListItemText
                            primary={task.name}
                            style={{
                              textDecoration:
                                task.status === "completed"
                                  ? "line-through"
                                  : "none",
                              color: green[500],
                            }}
                          />
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default Tasks;
