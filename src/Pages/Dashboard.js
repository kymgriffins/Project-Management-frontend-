import React,{useState, useEffect} from 'react';
import axios from "axios"
import _ from "lodash"
import {

  Grid,

} from "@mui/material";
import { StatisticBox, TaskBox} from "../Components/Statistics";
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import FeedIcon from '@mui/icons-material/Feed';
import { URL } from '../Constants/constants';
// const URL = "https://web-production-f86e.up.railway.app/projects/";
const Dashboard = () => {
  const [projects,setProjects]=useState([])
  const [allProjects,setAllProjects] = useState("")
  const [count,setCount]=useState({})
  const [users, setUsers] = useState([]);
  const [reportsCount,setReportsCount] = useState('');
  const [usersCount,setUsersCount] = useState('')
  const [invoiceCount,setInvoiceCount] = useState('')

  
  const [teams, setTeams] = useState([]);
  const fetchProjects = () => {
    axios.get(`${URL}projects/`).then((response) => {
      setProjects(response.data);
      setAllProjects(response.data.length);
      
      // console.log(statusCounts);
      // Output: { pending: 2, ongoing: 1, completed: 3 }
    });
  };
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(`${URL}auth/register/`);
      setUsersCount(response.data.length);
    
    };
    const fetchReports = async () => {
      const response = await axios.get(`${URL}dailyrecords/`, {
        params: {
          roles: "member",
        },
      });
      setReportsCount(response.data.length);
   
    };
    const fetchInvoices = async () => {
      const response = await axios.get(`${URL}invoices/`, {
        params: {
          roles: "member",
        },
      });
      setInvoiceCount(response.data.length);
     
    };
    
    
   
    fetchUsers();
   
    fetchProjects()
    fetchReports()
    fetchInvoices()
  }, []);
  return (
    <div>
       <Grid container direction="row" spacing={4}>
  <Grid item md={3}>
    <StatisticBox
      color="teal"
      icon={EngineeringIcon}
      primaryText={allProjects}
      secondaryText="No of projects"
      testId="total-feedbacks-stat"
      bgColor="primary"
    />
  </Grid>
  <Grid item md={3}>
    <StatisticBox
    icon={FeedIcon}
      color="red"
      primaryText={reportsCount}
      secondaryText="Total Reports"
      testId="pending-feedbacks-stat"
    />
  </Grid>
  <Grid item md={3}>
    <StatisticBox
    icon={ReceiptLongIcon}
      
      primaryText={invoiceCount}
      secondaryText="Invoices generated"
      testId="reassignment-feedbacks-stat"
      color={"green"}
    />
  </Grid>
  <Grid item md={3}>
    <StatisticBox
    icon={PeopleIcon}
      color="blue"
      primaryText={usersCount}
      secondaryText=" System Users"
      testId="reassignment-feedbacks-stat"
    />
  </Grid>
  </Grid>
    </div>
  )
}

export default Dashboard