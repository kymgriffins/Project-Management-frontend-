import React, { useState, useEffect } from "react";
import { useAuth } from "../Auth/AuthProvider";
import axios from "axios";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Select, { SelectChangeEvent } from '@mui/material/Select';

import {
  FormControlLabel,
  Snackbar,
  Checkbox,
  Grid,
  Box,
  Collapse,
  FormGroup,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useNavigate,Link, useHistory } from "react-router-dom";

const Signup = () => {
    // const history = useHistory()
  const [role, setRole]=useState("")
    const { authState ,login} = useAuth();
    const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
//   const { signup } = useAuth();
  // const URL = `http://127.0.0.1:8000/auth/register/`;
  const URL = "https://web-production-f86e.up.railway.app/auth/register/"
  const [formData, setFormData] = useState({
    username:"",
    email: "",
    password: "",
    roles:""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleRoleChange = (event) => {
    setRole(event.target.value );
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
        !formData.username || !formData.email
         
      ) {
        setSnackbarSeverity("info");
        setSnackBarMessage(
          "Please fill out all required fields before creating a task."
        );
        setSnackBarOpen(true);
  
        return;
      }
    const data = {
        username:formData.username,
        email:formData.email,
        password:formData.password,
        roles:role,
    }
    try {
      // Send a signup request to the server
      // with email and password
      const res = await axios.post(URL, data);
      // Extract the token from the response
      const token = res.data.access;
      console.log(token, "TOKEN");
      console.log(res);
      setSnackBarMessage("Signup successful!");
      setSnackBarOpen(true);
      setSnackbarSeverity("success")
      // Signup the user by setting the token
      
      // Redirect to the homepage
    //   if (res.status === 201) {
    //     login(token);
    //     // history.push("/");
    //   }
    } catch (err) {
      setError("Invalid email or password");
      setSnackBarMessage("Invalid email or password");
      setSnackBarOpen(true);
      setSnackbarSeverity("danger")
    }
  };
  
  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };
  useEffect(() => {
    if (authState.authenticated) {
      navigate("/");
    }
  }, [authState.authenticated, navigate]);

  return (
    <>
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

      <Grid container direction="row">
      <Grid item md={7} xs={12} sx={{ height: "100vh", width: "50%" }}>
          <Grid
            container
            justifyContent="center"
            sx={{ height: "100%" }}
            alignItems="center"
          >
            <img
              style={{ width: "100%", height: "100%" }}
              src="https://images.unsplash.com/photo-1527219525722-f9767a7f2884?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=873&q=80"
              alt="Logo"
            />
          </Grid>
          {/* Logo or image goes here */}
        </Grid>

        <Grid md={5} xs={12} item>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            direction="column"
            sx={{ height: "100%", width: "100%", px: 10 }}
          >
           <Typography
              variant="h4"
              sx={{ letterSpacing: 4, mb: 6 }}
              color="primary"
            >
              {" "}
              JENGA
            </Typography>
            {/* <Typography variant="body1" sx={{ mb: 2 }} color="#aaaaaa">
              Fill in the following details to signup
            </Typography> */}
            <TextField
              type="text"
              required
              variant="outlined"
              id="username"
              name="username"
              autoFocus
              onChange={handleChange}
              fullWidth={true}
              sx={{ mb: 4, mt: 2 }}
              label="Username"
              inputProps={{ autoComplete: "off" }}
              value={formData.username}
            />
            
            <TextField
              type="text"
              required
              variant="outlined"
              id="email"
              name="email"
              autoComplete="new-password"
              autoFocus
              onChange={handleChange}
              fullWidth={true}
              sx={{ mb: 4, mt: 2 }}
              label="Email"
              inputProps={{ "data-testid": "emailInput", autoComplete: "off" }}
              value={formData.email}
            />

            <TextField
              onChange={handleChange}
              label="Password"
              required
              variant="outlined"
              name="password"
              type="password"
              value={formData.password}
              autoFocus={false}
              fullWidth={true}
            />
             <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Select Role</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={role}
          autoWidth
          label="Role"
          onChange={handleRoleChange}
          sx={{mt:2}}
        >
           <MenuItem value={"manager"}>Manager</MenuItem>
          <MenuItem value={"architect"}>Architect</MenuItem>
          <MenuItem value={"foreman"}>Foreman</MenuItem>
          <MenuItem value={"owner"}>Home owner</MenuItem>
         
        </Select>
      </FormControl>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              sx={{ mt: 4 }}
            >
              {/* <FormGroup>
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Remember me"
                  sx={{ color: "#5c61c5" }}
                />
              </FormGroup> */}
              <Link variant="body2" to='/login' className="link" sx={{ textDecoration: 'none', color: "primary", mt: 1.5 }}> 
             Already have an account? Login
              </Link>
              <Link variant="body2" to='/forgot-password' className="link" sx={{ textDecoration: 'none', color: "primary", mt: 1.5 }}> 
              Forgot password?
              </Link>
            </Grid>
            <Button
              sx={{ mt: 5 }}
              type="submit"
              onClick={handleSubmit}
              variant="contained"
            >
              Signup
            </Button>
            {/* <Button type='submit' primaryText="Signup" onClick={signup} /> */}
          </Grid>
        </Grid>
      </Grid>

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ mt: 1, px: 15 }}
      >
        {/* <Collapse in={showAlert} sx={{ marginBottom: 1, marginTop: 1 }}>
				<AlertMessage type={alertDetails.type} title={alertDetails.title} message={alertDetails.message} />
			</Collapse> */}

        {/* <LoadingButton sx={{ mt: 5 }} type="submit" loading={logUserIn.isLoading} primaryText="Signup" loadingText="Logging in"></LoadingButton> */}
      </Box>
    </>
  );
};

export default Signup;