import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
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
  MenuItem,
  Select,
  InputAdornment,
  InputLabel,
  SvgIcon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { StatusBox } from "../Components/StatusBox";
import { Visibility } from "@mui/icons-material";
import { DataGridLayout } from "../Components/DataGridLayout";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import moment from "moment";
import { StatisticBox } from "../Components/Statistics";
import { TaskBox } from "../Components/Statistics";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useAuth } from "../Auth/AuthProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { TextareaAutosize } from '@mui/base';
import _ from "lodash";
import Stack from "@mui/material/Stack";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseIcon from "@mui/icons-material/Close";

const theme = createTheme({
  typography: {
    fontFamily: "Inter",
  },
  palette: {
    primary: {
      main: "#2196f3", // change primary color
    },
    success: {
      main: "#4caf50", // change success color
    },
    error: {
      main: "#f44336", // change error color
    },
    background: {
      default: "#ffffff", // change default background color
    },
    text: {
      primary: "#333333", // change primary text color
      secondary: "#999999", // change secondary text color
    },
  },
});

// const URL = "http://127.0.0.1:8000/projects/";
// const BLUPRINTURL = "http://127.0.0.1:8000/blueprint/"
// const URL = "http://127.0.0.1:8000/projects/";

const URL = "https://web-production-f86e.up.railway.app/projects/"
const BLUPRINTURL = "https://web-production-f86e.up.railway.app/blueprint/"

const Projects = () => {
  const [project, setProject] = useState({
    name: "",
    description: "",
    scope: "",
    startDate: null,
    endDate: "",
    budget: "",
    supervisor: "",
    architect: "",
    foreman: "",
    location: "",
    blueprints: "",
  });
  const [loading, setLoading] = useState(false);
  // const [editorState, setEditorState] = useState(
  //   EditorState.createWithContent(ContentState.createFromText(project.scope))
  // );

  const navigate = useNavigate();
  // const location = useLocation();

  const [poperOpen, setPopperOpen] = useState(false);
  // console.log("location", location.state);
  const [projects, setProjects] = useState([]);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [count, setCount] = useState({});
  const [allProjects, setAllProjects] = useState("");
  const [architects, setArchitects] = useState([]);
  const [foreman, setForeman] = useState([]);
  const [manager, setManager] = useState([]);
  const [selectedArchitect, setSelectedArchitect] = useState("");
  const [selectedForeman, setSelectedForeman] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState("");

  const { currentUser } = useAuth();
  // console.log("Current User", currentUser);

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };
  const endDate = moment(project.endDate).format("MMMM Do YYYY");

  const handleCreateProject = async () => {
    try {
      setLoading(true);
      // Step 1: Create the project
      const projectData = {
        name: project.name,
        description: project.description,
        location: project.location,
        start_date: project.start_date,
        end_date: endDate,
        status: "on-hold",
        estimated_budget: project.budget,
        supervisor: currentUser?.user_id,
        architect: currentUser?.user_id,
        foreman: selectedForeman,
        created_by: currentUser?.user_id,
      };
      const createProjectResponse = await axios.post(URL, projectData);
      if (createProjectResponse.status === 201) {
        const projectId = createProjectResponse.data.id;
  
        // Step 2: Upload blueprints
        const blueprintFormDataList = [];
        selectedFiles.forEach((file) => {
          const blueprintFormData = new FormData();
          blueprintFormData.append("project", projectId);
          blueprintFormData.append("image", file);
          blueprintFormDataList.push(blueprintFormData);
        });
        const uploadBlueprintResponses = await Promise.all(
          blueprintFormDataList.map((formData) =>
            axios.post(BLUPRINTURL, formData)
          )
        );
  
        // Step 3: Navigate to project page
        setSnackBarMessage("Project created successfully");
        setSnackbarSeverity("success");
        setSnackBarOpen(true);
        setPopperOpen(false);
        // navigate(`/projects/${projectId}`);
      } else {
        throw new Error("Failed to create project");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        // Missing or invalid data
        setSnackBarMessage("Please input all the required data");
        setSnackbarSeverity("warning");
        setSnackBarOpen(true);
      } else {
        // Other error
        setSnackBarMessage("Error creating project");
        setSnackbarSeverity("error");
        setSnackBarOpen(true);
        setPopperOpen(false);
      }
    }
  };
  
  

  const fetchProjects = () => {
    axios.get(URL).then((response) => {
      const orderedProjects = _.orderBy(
        response.data,
        ["created_at"],
        ["desc"]
      );
      const rows = orderedProjects.map((project, index) => ({
        id: index + 1,
        name: project.name,
        status: project.status,
        location: project.location,
        end_date: project.end_date,
        estimated_budget: project.estimated_budget,
        blueprints:project.blueprints
      }));
      console.log(orderedProjects.blueprints)
  
    
      setProjects(rows);
      const statusCounts = orderedProjects.reduce((acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
      }, {});
      setCount(statusCounts);
      const totalCount = orderedProjects?.length;
      setAllProjects(totalCount);
      // console.log(statusCounts);
      // Output: { pending: 2, ongoing: 1, completed: 3 }
    });
  };

  useEffect(() => {
    fetchProjects();
  }, [projects]);
  const handleShowProject = useCallback(
    (row) => () => {
      navigate("/projects/item", { state: { row: row } });

      // console.log("row", row);
    },
    []
  );
  const handleFileInputChange = (event) => {
    setSelectedFiles([...selectedFiles, ...event.target.files]);
  };
  
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get("http://127.0.0.1:8000/auth/register/");
      setArchitects(
        response.data.filter((user) => user.roles.includes("architect"))
      );
      setForeman(
        response.data.filter((user) => user.roles.includes("foreman"))
      );
      setManager(
        response.data.filter((user) => user.roles.includes("manager"))
      );

      console.log(":::", response.data);
    };

    fetchUsers();
  }, []);
  const handleSelectArch = (event) => {
    setSelectedArchitect(event.target.value);
  };
  const handleSelectFore = (event) => {
    setSelectedForeman(event.target.value);
  };
  const handleSelectManager = (event) => {
    setSelectedManager(event.target.value);
  };
  // console.log("usersSelected", selectedUser);
  const handleClickOpen = () => {
    setPopperOpen(true);
  };

  const handleClose = () => {
    setPopperOpen(false);
  };
  const handleChange = (value) => {
    setDescription(value);
  };

  const handleProjectChange = (event) => {
    const { id, value } = event.target;
    setProject({ ...project, [id]: value });
    // if (id === "scope") {
    //   setEditorState(value);
    //   setProject({
    //     ...project,
    //     scope: convertToRaw(editorState.getCurrentContent()),
    //   });
    // } else {
    //   setProject({ ...project, [id]: value });
    // }
  };
  // const handleEditorStateChange = (newEditorState) => {
  //   setEditorState(newEditorState);
  // };

  // console.log("Projects", projects);
  const columns = [
    {
      field: "id",
      description: "",
      flex: 0.01,
      headerName: "ID",
      sortDirection: "desc",
    },
    {
      field: "name",
      headerName: "Name",
      description: "Project Name",
      flex: 0.1,
    },
    {
      field: "location",
      headerName: "Location",
      description: "Site Location",
      flex: 0.1,
    },
    // {
    //   field: "description",
    //   headerName: "Description",
    //   description: "",
    //   flex: 0.3,
    // },

    // {
    //   field: "created_at",
    //   headerName: "Date Started",
    //   description: "",
    //   flex: 0.2,
    //   renderCell: (params) => {
    //     console.log("checkout", params);
    //     return (
    //       <>
    //         <Typography variant="body2" component="body2">
    //           {moment(params.value).format("MMMM Do YYYY")}
    //         </Typography>
    //       </>
    //     );
    //   },
    // },
    {
      field: "estimated_budget",
      headerName: "Budget",
      description: "",
      flex: 0.1,
    },
    // {
    //   field: "current_budget",
    //   headerName: "Expense",
    //   description: "",
    //   flex: 0.1,
    // },

    {
      field: "status",
      headerName: "Status",
      description: "",
      flex: 0.125,
      renderCell: (params) => {
        if (params.row.status === "planning") {
          return <StatusBox status="Planning" color="danger" />;
        }
        if (params.row.status === "foundation") {
          return <StatusBox status="Foundation" color="primaryLight" />;
        }
        if (params.row.status === "framing") {
          return <StatusBox status="Framing" color="warning" />;
        }
        if (params.row.status === "rough-in") {
          return <StatusBox status="Rough-In" color="info" />;
        }
        if (params.row.status === "finishing") {
          return <StatusBox status="Finishing" color="secondary" />;
        }
        if (params.row.status === "completed") {
          return <StatusBox status="Completed" color="success" />;
        }
        if (params.row.status === "cancelled") {
          return <StatusBox status="Cancelled" color="error" />;
        }
        if (params.row.status === "on-hold") {
          return <StatusBox status="On Hold" color="warning" />;
        }
      },
      
    },
    {
      field: "end_date",
      headerName: "Due Date",
      description: "",
      flex: 0.13,
      renderCell: (params) => {
        const endDate = moment(params.value).format("MMMM Do YYYY");
        // const daysRemaining = endDate.diff(moment(), 'days');
        // const remainingText = daysRemaining === 1 ? '1 day remaining' : `${daysRemaining} days remaining`;

        return (
          <>
            <Typography variant="body2" component="p">
              {/* {moment(params.value).format("MMMM Do YYYY")} */}
             { moment(params.value).format("MMMM Do YYYY")}
            </Typography>
          </>
        );
      },
    },
    {
      field: "View Details",
      headerName: "View ",
      description: "",
      flex: 0.05,
      renderCell: (params) => {
        return (
          <Tooltip title="View">
            <IconButton
              color="primary"
              aria-label="view"
              onClick={handleShowProject(params.row)}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      
      <Container maxWidth="xl">
        
      <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
        <Box sx={{ backgroundColor: "#ffffff", pt: 0 }}>
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
          <Grid container justifyContent="end" sx={{ mb: 2, mr: 3 }}>
            {/* <TextField
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
          /> */}

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleClickOpen}
            >
              Add
            </Button>
            <Grid container direction="row" spacing={4}>
              {/* <Grid item md={3}>
              <TaskBox
                color="success"
                primaryText={3}
                secondaryText="No of projects"
                testId="total-feedbacks-stat"
                bgColor="primary"
              />
            </Grid>
            <Grid item md={3}>
              <StatisticBox
                color="primaryLight"
                primaryText={455}
                secondaryText="Pending Projects"
                testId="pending-feedbacks-stat"
              />
            </Grid>
            <Grid item md={3}>
              <StatisticBox
                color="primaryLightd"
                primaryText={33}
                secondaryText="Ongoing Projects"
                testId="reassignment-feedbacks-stat"
              />
            </Grid>
            <Grid item md={3}>
              <StatisticBox
                color="danger"
                primaryText={233}
                secondaryText="Completed Projects"
                testId="closed-feedbacks-stat"
              />
            </Grid> */}
            </Grid>
            <Dialog
              open={poperOpen}
              onClose={handleClose}
              fullWidth={true}
              maxWidth={"xl"}
            >
              <Grid container>
                <Grid item xs={12} md={12}>
                  <form encType="multipart/form-data" onSubmit={handleCreateProject}>
                    <DialogTitle>Add Project</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Fill in the details to create a new project
                      </DialogContentText>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                        <InputLabel id="team-select-label">
                            Name
                          </InputLabel>
                          <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            // label="Project Name"
                            type="text"
                            value={project.name}
                            fullWidth
                            variant="outlined"
                            onChange={handleProjectChange}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <InputLabel id="team-select-label">
                            Location
                          </InputLabel>
                          <TextField
                            autoFocus
                            margin="dense"
                            id="location"
                            // label="Location"
                            type="text"
                            value={project.location}
                            fullWidth
                            variant="outlined"
                            onChange={handleProjectChange}
                          />
                        </Grid>
                        {/* <Grid item xs={12} md={6}>
                          <InputLabel id="team-select-label">
                            Select Architect
                          </InputLabel>
                          <Select
                            labelId="team-select-label"
                            value={selectedArchitect}
                            onChange={handleSelectArch}
                            style={{ width: "100%" }}
                          >
                            {architects.map((item) => (
                              <MenuItem key={item.id} value={item.id}>
                                {item.username}
                              </MenuItem>
                            ))}
                          </Select>
                        </Grid> */}
                        <Grid item xs={12} md={6}>
                          <InputLabel id="team-select-label">
                            Select Foreman
                          </InputLabel>
                          <Select
                            labelId="team-select-label"
                            value={selectedForeman}
                            onChange={handleSelectFore}
                            style={{ width: "100%" }}
                          >
                            {foreman.map((item) => (
                              <MenuItem key={item.id} value={item.id}>
                                {item.username}
                              </MenuItem>
                            ))}
                          </Select>
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <InputLabel id="team-select-label">
                            Input Completion Date
                          </InputLabel>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            {/* <Stack spacing={3}> */}
                            <DatePicker
                              // label="Completion date"
                              value={project.endDate} // update this line to use startDate
                              onChange={(newValue) => {
                                setProject({ ...project, endDate: newValue }); // update startDate in project state
                              }}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                            />
                            {/* </Stack> */}
                          </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <InputLabel id="team-select-label">
                            Project Budget
                          </InputLabel>
                          <TextField
                            autoFocus
                            margin="dense"
                            id="budget"
                            // label="Budget"
                            type="number"
                            value={project.budget}
                            fullWidth
                            variant="outlined"
                            onChange={handleProjectChange}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <InputLabel id="team-select-label">
                            Project Budget
                          </InputLabel>
                          <TextField
                      autoFocus
                      margin="dense"
                      id="description"
                      label="Description"
                      type="text"
                      value={project.description}
                      fullWidth
                      variant="outlined"
                      onChange={handleProjectChange}
                      // multiline
                      // rows={5}
                    />
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <InputLabel id="team-select-label">
                            Upload Blueprints
                          </InputLabel>
                          <input
                            type="file"
                            multiple
                            onChange={handleFileInputChange}
                          />
                        </Grid>
                      </Grid>
                    </DialogContent>
                  </form>
                </Grid>
               
                  {/* <DialogContent> */}
                    
                    {/* <Grid item xs={12} md={12}>
                      <InputLabel id="description">
                        Kindly fill in the description of the project in detail.
                      </InputLabel>
                      <ReactQuill
                        value={description}
                        onChange={handleChange}
                        style={{ height: "250px" }}
                        modules={{
                          toolbar: [
                            ["bold", "italic", "underline", "strike"], // toggled buttons
                            ["blockquote", "code-block"],

                            [{ header: 1 }, { header: 2 }], // custom button values
                            [{ list: "ordered" }, { list: "bullet" }],
                            [{ script: "sub" }, { script: "super" }], // superscript/subscript
                            [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
                            [{ direction: "rtl" }], // text direction

                            [{ size: ["small", false, "large", "huge"] }], // custom dropdown
                            [{ header: [1, 2, 3, 4, 5, 6, false] }],

                            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                            [{ font: [] }],
                            [{ align: [] }],

                            ["clean"], // remove formatting button
                          ],
                        }}
                        rows={20}
                      />
                    </Grid> */}
                  {/* </DialogContent> */}
              
              </Grid>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleCreateProject}>Add</Button>
              </DialogActions>
            </Dialog>
          </Grid>

          <DataGridLayout>
            <DataGrid
              rowHeight={50}
              rows={projects}
              //  if tabValue is 0 show all data

              columns={columns}
              getRowId={(row) => row?.id ?? -1}

              pageSize={20}
            />
          </DataGridLayout>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Projects;
