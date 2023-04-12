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
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import moment from "moment";
import { StatisticBox } from "../Components/Statistics";
import { TaskBox } from "../Components/Statistics";
import Snackbar from "@mui/material/Snackbar";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

import CardMedia from "@mui/material/CardMedia";

import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { URL } from "../Constants/constants";


const Materials = () => {
  const [materials, setMaterials] = useState({
    name: "",
    description: "",
    cost: "",
    unit:''
  });
  const [open, setOpen] = useState(false);
  const [poperOpen, setPopperOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  console.log("location", location.state);
  const [allMaterials, setAllMaterials] = useState([]);
  const createMaterials = async (e) => {
    e.preventDefault();  

    const formData = new FormData();
    formData.append("name", materials.name);
    formData.append("description", materials.description);
    formData.append("unit_cost", materials.cost);
    formData.append("unit", materials.unit);

    // formData.append("created_by", currentUser?.user_id);

    try {
      const response = await axios.post(`${URL}materials/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      setSnackBarMessage("Material created successfully.");
      setSnackbarSeverity("success");
      setSnackBarOpen(true);
      setPopperOpen(false);
      setMaterials({});
    } catch (error) {
      console.error(error);
      setSnackBarMessage("Failed to create material.");
      setSnackbarSeverity("error");
      setSnackBarOpen(true);
    }
  };
  const fetchMaterials = () => {
    axios.get(`${URL}materials/`).then((response) => {
      setAllMaterials(response.data).catch((error) =>
        console.log("This is the error", error)
      );
    });
  };
  useEffect(() => fetchMaterials(), [allMaterials]);
  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };
  useEffect(() => {
    fetchMaterials();
  }, []);
  const handleClickOpen = () => {
    setPopperOpen(true);
  };

  const handleClose = () => {
    setPopperOpen(false);
  };

  const handleMaterialsChange = (event) => {
    const { id, value } = event.target;
    setMaterials({ ...materials, [id]: value });
    // if (id === "scope") {
    //   setEditorState(value);
    //   setMaterial({
    //     ...material,
    //     scope: convertToRaw(editorState.getCurrentContent()),
    //   });
    // } else {
    //   setMaterial({ ...material, [id]: value });
    // }
  };

  const handleShowMaterial = useCallback(
    (row) => () => {
      navigate("/materials/item", { state: { row: row } });

      console.log("row", row);
    },
    []
  );
  console.log("Materials", materials);
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
      field: "unit_cost",
      headerName: "Price",
      description: "",
      flex: 0.1,
    },

    // {
    //   field: "View Details",
    //   headerName: "View ",
    //   description: "",
    //   flex: 0.02,
    //   renderCell: (params) => {
    //     return (
    //       <Tooltip title="View">
    //         <IconButton
    //           color="primary"
    //           aria-label="view"
    //           onClick={handleShowMaterial(params.row)}
    //         >
    //           <Visibility />
    //         </IconButton>
    //       </Tooltip>
    //     );
    //   },
    // },
  ];

  return (
    <Container maxWidth="xl">
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
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            Add
          </Button>

          <Dialog
            open={poperOpen}
            onClose={handleClose}
            fullWidth={false}
            maxWidth={"md"}
          >
            <Grid container>
              <form encType="multipart/form-data" onSubmit={createMaterials}>
                <DialogTitle>Add Material</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Fill in the details to create a new material
                  </DialogContentText>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        value={materials.name}
                        fullWidth
                        variant="outlined"
                        onChange={handleMaterialsChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="description"
                        label="Description"
                        type="text"
                        value={materials.description}
                        fullWidth
                        // multiline
                        // rows={5}
                        variant="outlined"
                        onChange={handleMaterialsChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="unit"
                        label="Unit"
                        type="text"
                        value={materials.unit}
                        fullWidth
                        // multiline
                        // rows={5}
                        variant="outlined"
                        onChange={handleMaterialsChange}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="cost"
                        label="Cost"
                        type="number"
                        value={materials.cost}
                        fullWidth
                        variant="outlined"
                        onChange={handleMaterialsChange}
                      />
                    </Grid>
                  </Grid>
                  <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={createMaterials}>Add</Button>
                  </DialogActions>
                </DialogContent>
              </form>
            </Grid>
          </Dialog>
        </Grid>
        {/* <Grid container direction="row" spacing={4}>
                <Grid item md={3}>
                  <TaskBox color="success" primaryText={3} secondaryText="No of materials" testId="total-feedbacks-stat" bgColor="primary"/>
                </Grid>
                <Grid item md={3}>
                  <StatisticBox color="primaryLight" primaryText={455} secondaryText="Pending Materials" testId="pending-feedbacks-stat" />
                </Grid>
                <Grid item md={3}>
                  <StatisticBox color="primaryLightd" primaryText={33} secondaryText="Ongoing Materials" testId="reassignment-feedbacks-stat" />
                </Grid>
                <Grid item md={3}>
                  <StatisticBox color="danger" primaryText={233} secondaryText="Completed Materials" testId="closed-feedbacks-stat" />
                </Grid>
              </Grid> */}
        <DataGridLayout>
          <DataGrid
            rowHeight={50}
            rows={allMaterials}
            //  if tabValue is 0 show all data

            columns={columns}
            getRowId={(row) => row?.id ?? -1}
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

export default Materials;
