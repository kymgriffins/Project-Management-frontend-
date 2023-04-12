import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Tab,
  Tabs,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Grid,
} from '@mui/material';

const ReportItem = () => {
  const location = useLocation();
  const reportItem = location.state.row;
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ my: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Daily Report" />
          <Tab label="Materials Used" />
          <Tab label="Documents" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
  <Box sx={{ p: 3 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>Daily Report</Typography>
    <List sx={{ mb: 4 }}>
      <ListItem sx={{ mb: 2 }}>
        <ListItemText primary="Date" secondary={reportItem.date} />
      </ListItem>
      <ListItem sx={{ mb: 2 }}>
        <ListItemText primary="Work Completed" secondary={reportItem.work_completed} />
      </ListItem>
      <ListItem sx={{ mb: 2 }}>
        <ListItemText primary="Work Planned" secondary={reportItem.work_planned} />
      </ListItem>
      <ListItem sx={{ mb: 2 }}>
        <ListItemText primary="Issues" secondary={reportItem.issues} />
      </ListItem>
      <ListItem sx={{ mb: 2 }}>
        <ListItemText primary="Total Spendings" secondary={reportItem.total_spendings} />
      </ListItem>
      <ListItem sx={{ mb: 2 }}>
        <ListItemText primary="Workers Pay" secondary={reportItem.workers_pay} />
      </ListItem>
    </List>
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      {/* <Button variant="contained" color="primary">Edit Report</Button> */}
    </Box>
  </Box>
)}


      {activeTab === 1 && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6">Materials Used</Typography>
          <List>
            {reportItem.materials.map((material) => (
              <ListItem key={material.id} sx={{ mb: 2 }}>
                <ListItemAvatar>
                  <Avatar>{material.id}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={`Material #${material.material}`} secondary={`Quantity Used: ${material.quantity_used}`} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
{activeTab === 2 && (
  <Box sx={{ p: 3 }}>
    <Typography variant="h6">Documents</Typography>
    <Grid container spacing={2}>
      {reportItem.documents.map((document, index) => (
        <React.Fragment key={document.id}>
          <Grid item xs={6}>
           
              <img
  alt={""}
  src={`https://res.cloudinary.com/dj9cp8xcv/${document.image}`}
  style={{ maxWidth: "100%", height: "auto" }}
/>
              
          </Grid>
          {(index + 1) % 2 === 0 && <Grid item xs={12} />}
        </React.Fragment>
      ))}
    </Grid>
  </Box>
)}

    </Box>
  );
};

export default ReportItem;
