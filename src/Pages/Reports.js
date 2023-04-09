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
  FormControl,
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

import _ from "lodash";
import Stack from "@mui/material/Stack";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
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

const URL = "http://127.0.0.1:8000/dailyrecords/";
const URL2 = "http://127.0.0.1:8000/material/used/";
const URL3 = "http://127.0.0.1:8000/record_pic/";

// const URL = "https://posthere.io/a8f2-462f-ba98";
// const URL2 = "https://posthere.io/a8f2-462f-ba98";

const Reports = () => {
  const [report, setReport] = useState({
    project: null,
    work_completed: "",
    work_planned: "",
    issues: "",
    workers_pay: null,
    total_spendings: "",
    documents: null,
    name: "",
  });
  const [loading, setLoading] = useState(false);
  // const [editorState, setEditorState] = useState(
  //   EditorState.createWithContent(ContentState.createFromText(report.scope))
  // );

  const navigate = useNavigate();
  // const location = useLocation();

  const [poperOpen, setPopperOpen] = useState(false);
  // console.log("location", location.state);
  const [reports, setReports] = useState([]);
  // console.log("REPORTS",reports)
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [count, setCount] = useState({});
  const [allReports, setAllReports] = useState("");
  const [materials, setMaterials] = useState([]);

  const [selectedFiles, setSelectedFiles] = useState("");
  const [workCompleted, setWorkCompleted] = useState("");
  const [materialUsages, setMaterialUsages] = useState([
    { material: "", quantity_used: "" },
  ]);

  const handleAddField = () => {
    setMaterialUsages([...materialUsages, { material: "", quantity_used: "" }]);
  };

  const handleRemoveField = (index) => {
    const newMaterialUsages = [...materialUsages];
    newMaterialUsages.splice(index, 1);
    setMaterialUsages(newMaterialUsages);
  };

  const handleMaterialChange = (index, event) => {
    const newMaterialUsages = [...materialUsages];
    newMaterialUsages[index].material = event.target.value;
    setMaterialUsages(newMaterialUsages);
  };

  const handleUsageChange = (index, event) => {
    const newMaterialUsages = [...materialUsages];
    newMaterialUsages[index].quantity_used = event.target.value;
    setMaterialUsages(newMaterialUsages);
  };

  const { currentUser } = useAuth();
  // console.log("Current User", currentUser);

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  const createReport = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("project", 1);
      formData.append("work_completed", report.work_completed);
      formData.append("work_planned", report.workPlanned);
      formData.append("issues", report.issues);
      formData.append("workers_pay", report.workers_pay);
      formData.append("total_spendings", 100);
  
      const response1 = await axios.post(URL, formData);
      const dailyRecordId = response1.data.id;
  
      const materialUsagesData = materialUsages.map((materialUsage, index) => {
        return {
          material: materialUsage.material.id,
          daily_record: dailyRecordId,
          quantity_used: materialUsage.quantity_used,
        };
      });
  
      const response2 = await Promise.all(
        materialUsagesData.map((data) => axios.post(URL2, data))
      );
  
      const recordpicFormDataList = [];
      selectedFiles.forEach((file) => {
        const recordpicFormData = new FormData();
        recordpicFormData.append("daily_record", dailyRecordId);
        recordpicFormData.append("image", file);
        recordpicFormDataList.push(recordpicFormData);
      });
      const uploadrecordpicResponses = await Promise.all(
        recordpicFormDataList.map((formData) => axios.post(URL3, formData))
      );
  
      // Set success message
      setSnackBarMessage("Report created successfully.");
      setSnackbarSeverity("success");
      setSnackBarOpen(true);
      setPopperOpen(false);
      setLoading(false);
    } catch (error) {
      // Check for specific error message
      if (error.response && error.response.status === 400) {
        setSnackBarMessage("Please fill out all required fields.");
      } else {
        setSnackBarMessage("Failed to create report.");
      }
  
      // Set error severity and open snackbar
      setSnackbarSeverity("error");
      setSnackBarOpen(true);
    }
  };
  
  const fetchReports = () => {
    axios.get(URL).then((response) => {
      const orderedReports = _.orderBy(response.data, ["created_at"], ["desc"]);

      // Process the data as needed
      const rows = orderedReports.map((report, index) => ({
        id: index + 1,
        // name: report.name,
        project: report.project.name,
        workers_pay: report.workers_pay,
        total_spendings: report.total_spendings,
        date: report.date,
        materials: report?.materials,
        documents: report?.documents,
        isAchieved: report.isAchieved,
        issues:report?.issues,
        work_completed:report?.work_completed,
      }));
      console.log(orderedReports);

      setReports(rows);

      // Count the number of reports in each status
      const statusCounts = orderedReports.reduce((acc, report) => {
        acc[report.status] = (acc[report.status] || 0) + 1;
        return acc;
      }, {});
      setCount(statusCounts);

      const totalCount = orderedReports?.length;
      setAllReports(totalCount);
    });
  };

  useEffect(() => {
    fetchReports();
  }, [reports]);
  const handleShowReport = useCallback(
    (row) => () => {
      navigate("/reports/item", { state: { row: row } });

      // console.log("row", row);
    },
    []
  );
  const handleFileInputChange = (event) => {
    setSelectedFiles([...selectedFiles, ...event.target.files]);
  };
  useEffect(() => {
    const fetchMaterials = async () => {
      const response = await axios.get("http://127.0.0.1:8000/materials/");
      setMaterials(response.data);

      // console.log(":::", response.data);
    };

    fetchMaterials();
  }, []);

  // console.log("usersSelected", selectedUser);
  const handleClickOpen = () => {
    setPopperOpen(true);
  };

  const handleClose = () => {
    setPopperOpen(false);
  };

  const handleReportChange = (event) => {
    const { id, value } = event.target;
    setReport({ ...report, [id]: value });
    // if (id === "scope") {
    //   setEditorState(value);
    //   setReport({
    //     ...report,
    //     scope: convertToRaw(editorState.getCurrentContent()),
    //   });
    // } else {
    //   setReport({ ...report, [id]: value });
    // }
  };
  // const handleEditorStateChange = (newEditorState) => {
  //   setEditorState(newEditorState);
  // };

  // console.log("Reports", reports);
  const columns = [
    {
      field: "id",
      description: "",
      flex: 0.01,
      headerName: "ID",
      sortDirection: "desc",
    },
    // {
    //   field: "name",
    //   headerName: "Name",
    //   description: "Project Name",
    //   flex: 0.1,
    // },
    {
      field: "project.name",
      headerName: "Project Name ",
      description: "",
      flex: 0.2,
      renderCell: (params) => {
        // console.log("NAME PR", params);
        return (
          <>
            <Typography variant="body2" component="body2">
              {params.row?.project}
            </Typography>
          </>
        );
      },
    },
    {
      field: "workers_pay",
      headerName: "Labor Cost",
      description: "Site Location",
      flex: 0.1,
    },
    {
      field: "total_spendings",
      headerName: " Spendings",
      description: "Site Location",
      flex: 0.1,
    },
    // {
    //   field: "description",
    //   headerName: "Description",
    //   description: "",
    //   flex: 0.3,
    // },

    {
      field: "date",
      headerName: "Date Created",
      description: "",
      flex: 0.1,
      renderCell: (params) => {
        // console.log("PD",params)
        return (
          <Typography variant="body2" component="body2">
            {moment(params?.row?.date).format("MMMM Do YYYY")}
          </Typography>
        );
      },
    },
    // {
    //   field: "budget",
    //   headerName: "Budget",
    //   description: "",
    //   flex: 0.1,
    // },
    // {
    //   field: "current_budget",
    //   headerName: "Expense",
    //   description: "",
    //   flex: 0.1,
    // },
    // {
    //   field: "project.status",
    //   headerName: "Status",
    //   description: "",
    //   flex: 0.125,
    //   renderCell: (params) => {
    //     if (params.row.project.status === "planning") {
    //       return <StatusBox status="Planning" color="danger" />;
    //     }
    //     if (params.row.project.status === "inprogress") {
    //       return <StatusBox status="In Progress" color="primaryLight" />;
    //     }
    //     if (params.row.project.status === "completed") {
    //       return <StatusBox status="Completed" color="success" />;
    //     }
    //   },
    // },

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
              onClick={handleShowReport(params.row)}
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
       {loading && <CircularProgress />}
      <Container maxWidth="xl" sx={{ marginTop: "2rem" }}>
        <Box sx={{ backgroundColor: "#ffffff", pt: 0, pb: "2rem" }}>
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
            <Grid container direction="row" spacing={4}></Grid>
            <Dialog
              open={poperOpen}
              onClose={handleClose}
              fullWidth={true}
              maxWidth={"xl"}
            >
              <Grid container>
                <Grid item xs={12} md={12}>
                  {/* <form encType="multipart/form-data" onSubmit={createReport}> */}
                  <DialogTitle>Add Report</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Fill in the details to create a new report
                    </DialogContentText>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={6}>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="work_completed"
                          label="Work Completed"
                          type="text"
                          value={report.work_completed}
                          fullWidth
                          variant="outlined"
                          onChange={handleReportChange}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="work_planned"
                          label="Work Planned"
                          type="text"
                          value={report.work_planned}
                          fullWidth
                          variant="outlined"
                          onChange={handleReportChange}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="workers_pay"
                          label="Contractors Pay"
                          type="number"
                          value={report.workers_pay}
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ style: { padding: "12px 16px" } }}
                          onChange={handleReportChange}
                          helperText="Enter the amount paid to contractors"
                        />
                      </Grid>

                      <Grid item xs={12} md={6} sx={{ my: 2 }}>
                        {materialUsages.map((materialUsage, index) => (
                          <div
                            key={index}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              my: 1,
                            }}
                          >
                            <FormControl
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                width: "50%",
                                mr: 2,
                              }}
                            >
                              <InputLabel id={`material-select-label-${index}`}>
                                Material
                              </InputLabel>
                              <Select
                                labelId={`material-select-label-${index}`}
                                value={materialUsage.material}
                                onChange={(event) =>
                                  handleMaterialChange(index, event)
                                }
                                sx={{ width: "25%" }}
                              >
                                {materials.map((material) => (
                                  <MenuItem key={material.id} value={material}>
                                    {material.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <TextField
                              label="Usage"
                              value={materialUsage.quantity_used}
                              onChange={(event) =>
                                handleUsageChange(index, event)
                              }
                              sx={{ flex: 1, marginLeft: 2 }}
                              inputProps={{ style: { padding: "12px 16px" } }}
                              InputLabelProps={{ shrink: true }}
                              helperText="Enter the quantity of material used"
                            />

                            {index > 0 && (
                              <IconButton
                                onClick={() => handleRemoveField(index)}
                                sx={{ marginLeft: 2 }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}

                            {index === materialUsages.length - 1 && (
                              <IconButton
                                onClick={handleAddField}
                                sx={{ marginLeft: 2 }}
                              >
                                <AddIcon />
                              </IconButton>
                            )}
                          </div>
                        ))}
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="description"
                          label="Description"
                          type="text"
                          value={report.description}
                          fullWidth
                          variant="outlined"
                          multiline
                          rows={5}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ style: { padding: "12px 16px" } }}
                          onChange={handleReportChange}
                          helperText="Provide a detailed description of the work completed"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <InputLabel id="blueprint-select-label">
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
                  {/* </form> */}
                </Grid>
              </Grid>
              <DialogActions sx={{ marginTop: "2rem", marginBottom: "1rem" }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={createReport}>Add</Button>
              </DialogActions>
            </Dialog>
          </Grid>

          <DataGridLayout>
            <DataGrid
              rowHeight={50}
              rows={reports}
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

export default Reports;
