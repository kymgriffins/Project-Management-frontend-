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
  InputAdornment,
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
const theme = createTheme({
  typography: {
    fontFamily: "Inter",
  },
});

const URL = "http://127.0.0.1:8000/projects/";

const Projects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // console.log("location", location.state);
  const [projects, setProjects] = useState([]);
  const fetchProjects = () => {
    axios.get(URL).then((response) => {
      setProjects(response.data);
      console.log(response.data);
    });
  };
  useEffect(() => {
    fetchProjects();
  }, []);
  const handleShowProject = useCallback(
    (row) => () => {
      navigate("/projects/item", { state: { row: row } });

      // console.log("row", row);
    },
    []
  );
  // console.log("Projects", projects);
  const columns = [
    { field: "id", headerName: "id", description: "", flex: 0.01 },
    { field: "name", headerName: "Name", description: "", flex: 0.1 },
    {
      field: "description",
      headerName: "Description",
      description: "",
      flex: 0.3,
    },

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
    //           {moment(params.value).format("llll")}
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
    {
      field: "current_budget",
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
      field: "end_date",
      headerName: "Due Date",
      description: "",
      flex: 0.1,
      renderCell: (params) => {
        // console.log("checkout", params);
        return (
          <>
            <Typography variant="body2" component="body2">
              {moment(params.value).format("llll")}
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
        <Box sx={{ backgroundColor: "#ffffff", pt: 0 }}>
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

            <Button variant="contained" startIcon={<AddIcon />}>
              Add
            </Button>
            {/* onClick={handleCreateDialogOpen} */}
          </Grid>
          <Grid container direction="row" spacing={4}>
            <Grid item md={3}>
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
            </Grid>
          </Grid>
          <DataGridLayout>
            <DataGrid
              rowHeight={50}
              rows={projects}
              //  if tabValue is 0 show all data

              columns={columns}
              getRowId={(row) => row.id}
              pageSize={20}
            />
          </DataGridLayout>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Projects;
