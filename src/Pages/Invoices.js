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
  Checkbox,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  FormControl
} from "@mui/material";
import _ from 'lodash';
import { StatusBox } from "../Components/StatusBox";
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
import { useAuth } from "../Auth/AuthProvider";
import CardMedia from "@mui/material/CardMedia";
import DeleteIcon from "@mui/icons-material/Delete";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import '../Components/Invoice.scss';
import LineItem from "../Components/LineItem";
import LineItems from "../Components/LineItems";

import { v4 as uuidv4 } from 'uuid';
const URL = "http://127.0.0.1:8000/invoices/";
// const URL = "https://posthere.io/a8f2-462f-ba98"

const Invoices = () => {

  const [invoices, setInvoices] = useState({
    amount: "",
    isPaid: false,
    created_by: "",
 
  });
  const now=(moment().format('MMMM Do YYYY'))
  const [open, setOpen] = useState(false);
  const [poperOpen, setPopperOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [materials, setMaterials] = useState([]);
  const [username,setUsername]=useState("")
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  console.log("location", location.state);
  const [allInvoices, setAllInvoices] = useState([]);
  const { currentUser } = useAuth();
  const userId = currentUser?.user_id
  console.log("USN",currentUser);
  

  const [materialUsages, setMaterialUsages] = useState([
    { material: "", quantity_used: ""},
  ]);
  const [taxRate, setTaxRate] = useState(0.00);
  const [lineItems, setLineItems] = useState([
    {
      id: 'initial',
      name: '',
      quantity: 0,
      unitCost: 0,
    },
  ]);

  const handleInvoiceChange = (event) => {
    setTaxRate(event.target.value);
  };

  const handleLineItemChange = (elementIndex) => (event) => {
    const newLineItems = lineItems.map((item, i) => {
      if (elementIndex !== i) return item;
      return { ...item, [event.target.name]: event.target.value };
    });
    setLineItems(newLineItems);
  };

  const handleAddLineItem = () => {
    setLineItems((prevLineItems) => [
      ...prevLineItems,
      { id: uuidv4(), name: '', description: '', quantity: 0, unitCost: 0.00 },
    ]);
  };

  const handleRemoveLineItem = (elementIndex) => () => {
    const newLineItems = lineItems.filter((item, i) => elementIndex !== i);
    setLineItems(newLineItems);
  };

  const handleReorderLineItems = (newLineItems) => {
    setLineItems(newLineItems);
  };

  const handleFocusSelect = (event) => {
    event.target.select();
  };

  const handlePayButtonClick = () => {
    alert('Not implemented');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const calcTaxAmount = (c) => {
    return c * (taxRate / 100);
  };

  const calcLineItemsTotal = () => {
    return lineItems.reduce((prev, cur) => prev + cur.quantity * cur.unitCost, 0);
  };

  const calcTaxTotal = () => {
    return calcLineItemsTotal() * (taxRate / 100);
  };

  const calcGrandTotal = () => {
    return calcLineItemsTotal() + calcTaxTotal();
  };

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
  const createInvoices = async (e) => {
    e.preventDefault();
  
    const materialUsagesData = materialUsages.map((materialUsage, index) => {
      return {
        material: { id: materialUsage.material.id }, // <-- add id property
        quantity_used: materialUsage.quantity_used,      
      };
    });
    
    
  
    const data={
      amount: invoices.amount,
      isPaid: invoices.isPaid,
      materials: materialUsagesData, // update invoices.materials with materialUsagesData
      created_by:currentUser?.user_id,
      project:selectedProject
    };
  
    try {
      const response = await axios.post(URL, data, {
        // add any additional options if needed
      });
      console.log(response.data);
      setSnackBarMessage("Invoice created successfully.");
      setSnackbarSeverity("success");
      setSnackBarOpen(true);
      setPopperOpen(false);
    } catch (error) {
      console.error(error);
      setSnackBarMessage("Failed to create material.");
      setSnackbarSeverity("error");
      setSnackBarOpen(true);
    }
  };
  
  const fetchInvoices = () => {
    axios.get(URL).then((response) => {
      const orderedInvoices = _.orderBy(response.data, ["created_at"], ["desc"]);
  
      // Process the data as needed
      const rows = orderedInvoices.map((invoice, index) => ({
        id: index +1,
        created_by: invoice?.created_by?.username,
        project: invoice?.project?.name,
        amount: invoice.amount,
        date_created: invoice.date_created,
        invoiceNumber: invoice.invoice_number,
        customerName: invoice.customer_name,
        totalAmount: invoice.total_amount,
        materials: invoice?.materials ,
        isPaid:invoice?.isPaid
      }));
  
      setAllInvoices(rows);
      console.log(rows,"ROWS")
    }).catch((error) => {
      console.log("This is the error", error)
    });
  };
  axios
  .get(`http://127.0.0.1:8000/auth/register/`)
  .then((response) => {
    const user = response.data.find((u) => u.id === userId); // Filter user with matching user_id
    console.log(user); // user object
    setUsername(user?.username)
    console.log(user.roles);
   
  })
  .catch((error) => {
    console.log(error);
  });
  useEffect(() => {
    fetchInvoices();
  }, []);
  
  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  const handleClickOpen = () => {
    setPopperOpen(true);
  };

  const handleClose = () => {
    setPopperOpen(false);
  };

  const handleInvoicesChange = (event) => {
    const { id, value } = event.target;
    setInvoices({ ...invoices, [id]: value });
  };
  

  const handleShowInvoice = useCallback(
    (row) => () => {
      navigate("/invoices/item", { state: { row: row } });

      console.log("row", row);
    },
    []
  );
  console.log("Invoices", invoices);
  useEffect(() => {
    const fetchProjects = async () => {
      const response = await axios.get("http://127.0.0.1:8000/projects/");
      setProjects(response.data);
    };

    fetchProjects();
  }, []);
  const handleSelectProject = (event) => {
    setSelectedProject(event.target.value);
  };
  useEffect(() => {
    const fetchMaterials = async () => {
      const response = await axios.get("http://127.0.0.1:8000/materials/");
      setMaterials(response.data);

      console.log(":::", response.data);
    };

    fetchMaterials();
  }, []);
 
  const columns = [
    { field: "id", headerName: "id", description: "", flex: 0.01 },
    {
      field: "created_by",
      headerName: "Created By",
      description: "",
      flex: 0.1,
      renderCell: (params) => {
        return (
          <Typography variant="body2" component="body2">
            {params.value}
          </Typography>
        );
      },
    },
    {
      field: "project",
      headerName: "Project",
      description: "",
      flex: 0.1,
      renderCell: (params) => {
        return (
          <Typography variant="body2" component="body2">
            {params.value}
          </Typography>
        );
      },
    },
    { field: "amount", headerName: "Amount", description: "", flex: 0.1 },
    
    {
      field: "materials",
      headerName: "Materials",
      description: "",
      flex: 0.2,
      renderCell: (params) => {
        return (
          <Typography variant="body2" component="body2">
            {params.value && params.value.length > 0 ?
              params.value.map((material) => material.name).join(", ") : ""
            }
          </Typography>
        );
      },
    },
    {
      field: "date_created",
      headerName: "Date Created",
      description: "",
      flex: 0.2,
      renderCell: (params) => {
        return (
          <Typography variant="body2" component="body2">
            {moment(params.value).format("MMMM Do YYYY")}
          </Typography>
        );
      },
    },
    // {
    //   field: "isPaid",
    //   headerName: "Paid",
    //   description: "",
    //   flex: 0.125,
    //   renderCell: (params) => {
    //     console.log(params,"ispaid")
    //     if (params.value === 'true') {
    //       return <StatusBox status="Paid" color="success" />;
    //     }
    //     if (params.value === "false") {
    //       return <StatusBox status="Pending" color="danger" />;
    //     }
    //     <Typography variant="body2" component="body2">
    //     {params.value}
    //   </Typography>
       
    //   },
      
    // },
    
    {
      field: "View Details",
      headerName: "View",
      description: "",
      flex: 0.02,
      renderCell: (params) => {
        return (
          <Tooltip title="View">
            <IconButton
              color="primary"
              aria-label="view"
              onClick={handleShowInvoice(params.row)}
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
            fullWidth={true}
            maxWidth={'xl'}
          >
            <Grid container>
             
                
                <DialogContent>
                  {/* <DialogContentText>
                    Fill in the details to create a new invoice
                  </DialogContentText> */}
                  {/* <Grid container spacing={2}>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="amount"
                        label="Amount"
                        type="number"
                        value={invoices.amount}
                        fullWidth
                        // multiline
                        // rows={5}
                        variant="outlined"
                        onChange={handleInvoicesChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <InputLabel id="team-select-label">
                        Select Project
                      </InputLabel>
                      <Select
                        labelId="team-select-label"
                        value={selectedProject}
                        onChange={handleSelectProject}
                        style={{ width: "100%" }}
                      >
                        {projects.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                                               
<Grid item xs={12} md={6} sx={{ my: 2 }}>
  {materialUsages.map((materialUsage, index) => (
    <div key={index} sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
      <FormControl fsx={{ width: '50%', mr: 2 }}>
        <InputLabel id={`material-select-label-${index}`}>Material</InputLabel>
        <Select
          labelId={`material-select-label-${index}`}
          value={materialUsage.material}
          onChange={(event) => handleMaterialChange(index, event)}
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
        onChange={(event) => handleUsageChange(index, event)}
        sx={{ flex: 1, marginLeft: 2 }}
      />

      {index > 0 && (
        <IconButton onClick={() => handleRemoveField(index)} sx={{ marginLeft: 2 }}>
          <DeleteIcon />
        </IconButton>
      )}

      {index === materialUsages.length - 1 && (
        <IconButton onClick={handleAddField} sx={{ marginLeft: 2 }}>
          <AddIcon />
        </IconButton>
      )}
    </div>
  ))}
</Grid>
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            id="isPaid"
                            checked={invoices.isPaid}
                            onChange={handleInvoicesChange}
                            color="primary"
                          />
                        }
                        label="Is Paid"
                      />
                    </Grid>
                  </Grid> */}
                  <div className={'invoice'}>
        <div className={'brand'}>
          <img src="https://via.placeholder.com/150x50.png?text=logo" alt="Logo" className={'logo'} />
        </div>
        <div className={'addresses'}>
          <div className={'from'}>
            <strong>Jenga Company</strong><br />
              123 Westlands <br />
              Nairobi, KE, Kenya &nbsp;<br />
              0727727970
          </div>
          <div>
            <div className={`${'valueTable'} ${'to'}`}>
              <div className={'row'}>
                <div className={'label'}>Customer #</div>
                <div className={'value'}>{username}</div>
              </div>
              <div className={'row'}>
                <div className={'label'}>Invoice #</div>
                <div className={'value'}>123456</div>
              </div>
              <div className={'row'}>
                <div className={'label'}>Date</div>
                <div className={`${'value'} ${'date'}`}>{now}</div>
              </div>
            </div>
          </div>
        </div>
        <h2>Invoice</h2>

          <LineItems
            items={lineItems}
            currencyFormatter={formatCurrency}
            addHandler={handleAddLineItem}
            changeHandler={handleLineItemChange}
            focusHandler={handleFocusSelect}
            deleteHandler={handleRemoveLineItem}
            reorderHandler={handleReorderLineItems}
          />

        <div className={'totalContainer'}>
          <form>
            <div className={'valueTable'}>
              <div className={'row'}>
                <div className={'label'}>Tax Rate (%)</div>
                <div className={'value'}><input name="taxRate" type="number" step="0.01" value={taxRate} onChange={handleInvoiceChange} onFocus={handleFocusSelect} /></div>
              </div>
            </div>
          </form>
          <form>
            <div className={'valueTable'}>
              <div className={'row'}>
                <div className={'label'}>Subtotal</div>
                <div className={`${'value'} ${'currency'}`}>{formatCurrency(calcLineItemsTotal())}</div>
              </div>
              <div className={'row'}>
                <div className={'label'}>Tax ({taxRate}%)</div>
                <div className={`${'value'} ${'currency'}`}>{formatCurrency(calcTaxTotal())}</div>
              </div>
              <div className={'row'}>
                <div className={'label'}>Total Due</div>
                <div className={`${'value'} ${'currency'}`}>{formatCurrency(calcGrandTotal())}</div>
              </div>
            </div>
          </form>
        </div>

        <div className={'pay'}>
          <button className={'payNow'} onClick={handlePayButtonClick}>Pay Now</button>
        </div>

        

      </div>

                  <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={createInvoices}>Add</Button>
                  </DialogActions>
                </DialogContent>
            
            </Grid>
          </Dialog>
        </Grid>
        {/* <Grid container direction="row" spacing={4}>
                <Grid item md={3}>
                  <TaskBox color="success" primaryText={3} secondaryText="No of invoices" testId="total-feedbacks-stat" bgColor="primary"/>
                </Grid>
                <Grid item md={3}>
                  <StatisticBox color="primaryLight" primaryText={455} secondaryText="Pending Invoices" testId="pending-feedbacks-stat" />
                </Grid>
                <Grid item md={3}>
                  <StatisticBox color="primaryLightd" primaryText={33} secondaryText="Ongoing Invoices" testId="reassignment-feedbacks-stat" />
                </Grid>
                <Grid item md={3}>
                  <StatisticBox color="danger" primaryText={233} secondaryText="Completed Invoices" testId="closed-feedbacks-stat" />
                </Grid>
              </Grid> */}
        <DataGridLayout>
          <DataGrid
            rowHeight={50}
            rows={allInvoices}
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

export default Invoices;
