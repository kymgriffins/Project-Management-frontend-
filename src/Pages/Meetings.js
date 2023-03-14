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
import { useNavigate } from "react-router-dom";
import { Visibility } from "@mui/icons-material";
import { useAuth } from "../Auth/AuthProvider";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from "@mui/icons-material/Search";
import { StatusBox } from "../Components/StatusBox";
const Meetings = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  console.log("authState", authState?.user?.user_id);
  const userId = authState.user.user_id;
  const [meetings, setMeetings] = useState([]);
  const URL = `http://127.0.0.1:8000/meetings/`;

  const fetchMeetings = () => {
    axios.get(URL).then((response) => {
      setMeetings(response.data).catch((error) =>
        console.log("This is the error", error)
      );
    });
  };
  const handleAttend = useCallback(
    (id, row) => () => {
      // navigate("/meetings/item", { state: { id: id, row: row } });
      window.open(row.link, '_blank');
      // console.log("id", id);
      // console.log("row", row);
    },
    []
  );
  useEffect(() => {
    fetchMeetings();
  }, [meetings]);
  // console.log("Meetings", meetings);
  const columns = [
    { field: "id", headerName: "id", description: "", flex: 0.01 },
    { field: "title", headerName: "Title", description: "", flex: 0.1 },
    { field: "description", headerName: "Description", description: "", flex: 0.1 },
   
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
    {
      field: "duration",
      headerName: "Duration",
      description: "",
      flex: 0.1,
    },

    // {
    //   field: "status",
    //   headerName: "Status",
    //   description: "",
    //   flex: 0.1,
    //   renderCell: (params) => {
    //     if (params.row.status === "pending") {
    //       return <StatusBox status="Pending" color="danger" />;
    //       // return(

    //       //   <Chip label="Facebook" color="primary" icon={<FacebookIcon />} />
    //       // )
    //     }
    //     if (params.row.status === "inprogress") {
    //       return <StatusBox status="inprogress" color="primaryLight" />;
    //     }
    //     if (params.row.status === "completed") {
    //       return <StatusBox status="completed" color="success" />;
    //     }
    //   },
    // },
    // { field: "priority", headerName: "Priority", description: "", flex: 0.1 },
    // {
    //   field: "link",
    //   headerName: "Link",
    //   description: "",
    //   flex: 0.1,
    // },
    {
      field: "View Details",
      headerName: "Attend Meeting ",
      description: "",
      flex: 0.1,
      renderCell: (params) => {
        return (
          <Tooltip title="Attend">
            <IconButton
              color="primary"
              aria-label="view"
              onClick={handleAttend(params.row.Caseid, params.row)}
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
      <Box sx={{ backgroundColor: "#ffffff", pt: 2}}>
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
            rows={meetings}
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

export default Meetings;
