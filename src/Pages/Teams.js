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
import { Visibility } from "@mui/icons-material";
import { DataGridLayout } from "../Components/DataGridLayout";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from "@mui/icons-material/Search";
import moment from "moment";
import { StatisticBox } from "../Components/Statistics";
import { TaskBox } from "../Components/Statistics";

import { useTheme } from '@mui/material/styles';


import CardMedia from '@mui/material/CardMedia';

import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';

const URL = "http://127.0.0.1:8000/teams/";

const Teams = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  console.log("location", location.state);
  const [teams, setProjects] = useState([]);
  const fetchProjects = () => {
    axios.get(URL).then((response) => {
      setProjects(response.data).catch((error) =>
        console.log("This is the error", error)
      );
    });
  };
  useEffect(() => {
    fetchProjects();
  }, []);
  const handleShowProject = useCallback(
    (row) => () => {
      navigate("/teams/item", { state: { row: row } });

      console.log("row", row);
    },
    []
  );
  console.log("Teams", teams);
  const columns = [
    { field: "id", headerName: "id", description: "", flex: 0.01 },
    { field: "name", headerName: "Name", description: "", flex: 0.1 },

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
      field: "description",
      headerName: "Description",
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
 
    <Container maxWidth="xl">
    <Box sx={{ backgroundColor: "#ffffff", pt: 0}}>
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

          <Button variant="contained" startIcon={<AddIcon />} >Add</Button>
{/* onClick={handleCreateDialogOpen} */}

        </Grid>
        {/* <Grid container direction="row" spacing={4}>
                <Grid item md={3}>
                  <TaskBox color="success" primaryText={3} secondaryText="No of teams" testId="total-feedbacks-stat" bgColor="primary"/>
                </Grid>
                <Grid item md={3}>
                  <StatisticBox color="primaryLight" primaryText={455} secondaryText="Pending Teams" testId="pending-feedbacks-stat" />
                </Grid>
                <Grid item md={3}>
                  <StatisticBox color="primaryLightd" primaryText={33} secondaryText="Ongoing Teams" testId="reassignment-feedbacks-stat" />
                </Grid>
                <Grid item md={3}>
                  <StatisticBox color="danger" primaryText={233} secondaryText="Completed Teams" testId="closed-feedbacks-stat" />
                </Grid>
              </Grid> */}
        <DataGridLayout>
        <DataGrid
          rowHeight={50}
          rows={teams}
          //  if tabValue is 0 show all data

          columns={columns}
          getRowId={(row) => row.id}
          pageSize={20}
        />
        
      </DataGridLayout>
      {/* <Grid container direction="row" spacing={4}>
        <Grid item md={3}>
        <Card sx={{ display: 'flex' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 1' }}>
          <Typography component="div" variant="h5">
            Live From Space
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            Mac Miller
          </Typography>
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
          <IconButton aria-label="previous">
            {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
          </IconButton>
          <IconButton aria-label="play/pause">
            <PlayArrowIcon sx={{ height: 38, width: 38 }} />
          </IconButton>
          <IconButton aria-label="next">
            {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
          </IconButton>
        </Box>
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 151 }}
        image="/static/images/cards/live-from-space.jpg"
        alt="Live from space album cover"
      />
    </Card>
        </Grid>
    
    </Grid> */}
        </Box>
     
    </Container>

  );
};

export default Teams;
