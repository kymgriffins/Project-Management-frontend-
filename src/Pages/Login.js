import React, { useState, useEffect } from "react";
import { useAuth } from "../Auth/AuthProvider";
import axios from "axios";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import { useNavigate, Link } from "react-router-dom";
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
import { URL } from "../Constants/constants";
const Login = () => {
  const { authState } = useAuth();

  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const { email, password } = formData;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a login request to the server
      // with email and password
      const res = await axios.post(`${URL}auth/token/`, { email, password });
      // Extract the token from the response
      const token = res.data.access;
      console.log(token, "TOKEN");
      console.log(res);

      login(token);

      // Login the user by setting the token
      setSnackBarMessage("Login successful!");
      setSnackBarOpen(true);
      setSnackbarSeverity("success");
    } catch (err) {
      setError("Invalid email or password");
      setSnackBarMessage("Invalid email or password");
      setSnackBarOpen(true);
      setSnackbarSeverity("danger");
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
             
              src="https://images.unsplash.com/photo-1429497419816-9ca5cfb4571a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80"
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
              variant="h5"
              sx={{ letterSpacing: 4, mb: 6 }}
              
              color="#FBF5FF"
            >
              {" "}
              JENGA
            </Typography>
            {/* <Typography variant="h5" color="#FBF5FF"> JENGA</Typography> */}
            <Typography variant="body1" sx={{ mb: 2 }} color="#aaaaaa">
              Fill in the following details to login
            </Typography>
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
            />

            <TextField
              onChange={handleChange}
              label="Password"
              variant="outlined"
              name="password"
              type="password"
              value={formData.password}
              autoFocus={false}
              fullWidth={true}
            />

            <Grid
              container
              direction="row"
              justifyContent="space-between"
              sx={{ mt: 4 }}
            >
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Remember me"
                  sx={{ color: "#5c61c5" }}
                />
              </FormGroup>
              <Link
                variant="body2"
                to="/signup"
                className="link"
                sx={{ textDecoration: "none", color: "primary", mt: 1.5 }}
              >
                Don't have an account? Signup
              </Link>
              <Link
                variant="body2"
                to="/forgot-password"
                className="link"
                sx={{ textDecoration: "none", color: "primary", mt: 1.5 }}
              >
                Forgot password?
              </Link>
            </Grid>
            <Button
              sx={{ mt: 5 }}
              type="submit"
              onClick={handleSubmit}
              variant="contained"
            >
              Login
            </Button>
            {/* <Button type='submit' primaryText="Login" onClick={login} /> */}
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

        {/* <LoadingButton sx={{ mt: 5 }} type="submit" loading={logUserIn.isLoading} primaryText="Login" loadingText="Logging in"></LoadingButton> */}
      </Box>
    </>
  );
};

export default Login;
