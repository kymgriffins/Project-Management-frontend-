import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { DataGrid,GridToolbar } from "@mui/x-data-grid";
import {
  CircularProgress,
  IconButton,
  Tooltip,
  Container,
  Typography,
  Select,
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
  InputLabel,
  SvgIcon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
} from "@mui/material";
import { DataGridLayout } from "../Components/DataGridLayout";
import { useNavigate, useLocation } from "react-router-dom";
import { Visibility } from "@mui/icons-material";
import { useAuth } from "../Auth/AuthProvider";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { StatusBox } from "../Components/StatusBox";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
function CustomToolbar() {
  return (
    <GridToolbar>
      <TextField label="Search" variant="standard" />
    </GridToolbar>
  );
}
const ProjectItem = () => {
  const [task, setTask] = useState({
    name: "",
    desc: "",
    assigned: [],
    team: "",
    priority: "",
    start: "",
    end: "",
    budget: "",
  });

  const [open, setOpen] = useState(false);
  const [poperOpen, setPopperOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { authState } = useAuth();
  console.log("authState", authState?.user?.user_id);
  const userId = authState.user.user_id;
  const [tasks, setTasks] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const[records,setRecords]=useState([])
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [priority, setPriority] = useState("");
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
console.log("ROW ",location?.state?.row)
// const IMG = location?.state?.row?.blueprints
// console.log("IMG", IMG)
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get("http://127.0.0.1:8000/auth/register/", {
        params: {
          roles: "member",
        },
      });
      setUsers(response.data.filter((user) => user.roles.includes("member")));
      console.log(":::", response.data);
    };
    const fetchTeams = async () => {
      const response = await axios.get("http://127.0.0.1:8000/teams");
      setTeams(response.data);
    };
    const fetchRecords = async () => {
      const response = await axios.get(`http://127.0.0.1:8000/projectsrecords/${projectId}`);
      setRecords(response.data);
    };
    fetchUsers();
    fetchTeams();
    fetchRecords()
  }, []);
  console.log("usersSelected", selectedUser);

  const projectId = location.state?.row?.id;
  const projectName = location.state?.row?.name;
  console.log("STATE", location?.state?.row)
  const URL = `http://127.0.0.1:8000/taskitem/${projectId}`;
  // const URL = `http://127.0.0.1:8000/tasks/`;

  const fetchTasks = () => {
    axios.get(URL).then((response) => {
      setTasks(response.data);
      console.log(response.data,"TASKS");
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
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };
  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };
  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };
  const priorityOptions = [
    {
      value: "high",
      label: "High",
    },
    {
      value: "medium",
      label: "Medium",
    },
    {
      value: "low",
      label: "Low",
    },
  ];

  const createTask = async (e) => {
    e.preventDefault();
    if (
      !task.name ||
      !task.description 
    
    ) {
      setSnackbarSeverity("info");
      setSnackBarMessage(
        "Please fill out all required fields before creating a task."
      );
      setSnackBarOpen(true);

      return;
    }
    const data = {
      name: task.name,
      description: task.description,
      assigned_to: selectedUser,
      team: selectedTeam,
      priority: priority,
      end: task.end,
      budget: task.budget,
      status:"pending",
      project_id:projectId
    };

    // try {
    //   const res = await axios.post("http://127.0.0.1:8000/tasks/", data);
    //   setSnackbarMessage("Task created successfully!");
    //   setSnackbarSeverity("success");
    //   setSnackbarOpen(true);
    //   console.log(res.data);
    //   handleClose();
    // } catch (e) {
    //   setSnackbarMessage("An error occurred while adding task.");
    //   setSnackbarSeverity("error");
    //   setSnackbarOpen(true);
    //   console.error(e);
    // }
    try {
      const res = await axios.post("http://127.0.0.1:8000/tasks/", data);
      if (res.status === 201) {
        setSnackBarMessage("Task  successfully created");
        setSnackbarSeverity("success");
        setSnackBarOpen(true);
        console.log(res.data);
        handleClose();
      } else {
        throw new Error("Failed to create project");
      }
    } catch (error) {
      setSnackBarMessage("Error creating task. Please try again.");
      setSnackbarSeverity("error");
      setSnackBarOpen(true);
      console.error(error);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, []);
  const handleClickOpen = () => {
    setPopperOpen(true);
  };
  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  const handleClose = () => {
    setPopperOpen(false);
  };
  // console.log("Tasks", tasks);
  const columns = [
    { field: "id", headerName: "id", description: "", flex: 0.01 },
    { field: "name", headerName: "Task", description: "", flex: 0.1 },
    // {
    //   field: "project_id",
    //   headerName: "Project Name",
    //   description: "",
    //   flex: 0.1,
    //   renderCell: (params) => {
    //     console.log("PARAMS", params);
    //     return (
    //       <>
    //         <Typography>{params.value.name}</Typography>
    //       </>
    //     );
    //   },
    // },
    // {
    //   field: "assigned_to",
    //   headerName: "Assigned To",
    //   description: "",
    //   flex: 0.1,
    //   renderCell: (params) => {
    //     console.log("PARAMS", params);
    //     return (
    //       <>
    //         {/* check if is logged in, display oly mine apart from Manager */}
    //         <Typography>{params.row.username}</Typography>
    //       </>
    //     );
    //   },
    // },

    // { field: "planned_start_date", headerName: "Date Started", description: "", flex: 0.1 },
    {
      field: "planned_budget",
      headerName: "Budget",
      description: "",
      flex: 0.1,
      renderCell: (params) => {
       
          return   <Typography>{params.row.planned_budget}</Typography>
        
      },
    },
    {
      field: "current_expense",
      headerName: "Expense",
      description: "",
      flex: 0.1,
      renderCell: (params) => {
       
        return   <Typography>{params.row.current_expense}</Typography>
      
    },
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
      renderCell: (params) => {
        console.log("END DATE",params.row)
       
        return   <Typography>{params.row.planned_end_date}</Typography>
      
    },
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
  const handleTaskChange = (e) => {
    const { id, value } = e.target;
    setTask({ ...task, [id]: value });
  };

  return (
    <div>
      <Container maxWidth="xl">
        <Snackbar
            open={snackBarOpen}
            autoHideDuration={6000}
            onClose={handleSnackBarClose}
            message={snackBarMessage}
            severity={snackbarSeverity}
            ContentProps={{
              sx: {
                backgroundColor:
                  snackbarSeverity === "success"
                    ? "#4caf50"
                    : snackbarSeverity === "error"
                    ? "#f44336"
                    : snackbarSeverity === "warning"
                    ? "#ff9800"
                    : "#2196f3",
                color: "#ffffff",
              },
            }}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleSnackBarClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Add
        </Button>
        <Box sx={{ backgroundColor: "#ffffff", pt: 2 }}>
          <Dialog
            open={poperOpen}
            onClose={handleClose}
            fullWidth={true}
            maxWidth={"lg"}
          >
            <form encType="multipart/form-data" onSubmit={createTask}>
              <DialogTitle>Add Report</DialogTitle>
              <DialogContent dividers>
                <DialogContentText>
                  Fill in the details to add a report .
                </DialogContentText>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                  {/* <div dangerouslySetInnerHTML={{ __html: location?.state?.row?.description  }}></div> */}
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Task Name"
                      type="text"
                      value={task.name}
                      fullWidth
                      variant="outlined"
                      onChange={handleTaskChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <InputLabel id="user-select-label">Select User</InputLabel>
                    <Select
                      labelId="user-select-label"
                      value={selectedUser}
                      onChange={handleUserChange}
                      style={{ width: "100%" }}
                    >
                      {users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.username}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <InputLabel id="team-select-label">Select Team</InputLabel>
                    <Select
                      labelId="team-select-label"
                      value={selectedTeam}
                      onChange={handleTeamChange}
                      style={{ width: "100%" }}
                    >
                      {teams.map((team) => (
                        <MenuItem key={team.id} value={team.id}>
                          {team.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <InputLabel id="priority-select-label">
                      Select Priority
                    </InputLabel>
                    <Select
                      labelId="priority-select-label"
                      value={priority}
                      onChange={handlePriorityChange}
                      style={{ width: "100%" }}
                    >
                      {priorityOptions.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>

                  

                  <Grid item xs={12} md={6}>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="budget"
                      label="Budget"
                      type="number"
                      value={task.budget}
                      fullWidth
                      variant="outlined"
                      onChange={handleTaskChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="description"
                      label="Description"
                      type="text"
                      value={task.description}
                      fullWidth
                      // multiline
                      // rows={4}
                      variant="outlined"
                      onChange={handleTaskChange}
                    />
                  </Grid>
                </Grid>
               
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={createTask}>Add</Button>
              </DialogActions>
            </form>
          </Dialog>

          <Grid container justifyContent="Start" sx={{ mb: 2, mr: 3 }}>
            <Typography variant="h5" component="h5">
            {projectName} Project
            </Typography>

            {/* onClick={handleClickOpen} */}
          </Grid>
           {/* <div dangerouslySetInnerHTML={{ __html: location?.state?.row?.description  }}></div> */}
           {location?.state?.row?.description }
           {/* <img
  src={`https://res.cloudinary.com/dj9cp8xcv/${IMG}`}
  alt={location?.state?.blueprints}
  loading="lazy"
  style={{ width: 600, height: 600 }}
/> */}

<Grid container spacing={2}>
  {location?.state?.row?.blueprints.map((blueprint) => (
    <Grid item xs={6} md={3} key={blueprint.id} sx={{ height: 300 }}>
      <img
        src={`https://res.cloudinary.com/dj9cp8xcv/${blueprint.image}`}
        alt={blueprint.id}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </Grid>
  ))}
</Grid>

          {/* <DataGridLayout>
            <DataGrid
              rowHeight={50}
              rows={tasks}
              //  if tabValue is 0 show all data

              columns={columns}
              getRowId={(row) => row.id}
              pageSize={20}
            />
          </DataGridLayout> */}
        </Box>
      </Container>
    </div>
  );
};

export default ProjectItem;
