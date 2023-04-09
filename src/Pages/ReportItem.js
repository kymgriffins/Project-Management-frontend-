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
          <Typography variant="h6">Daily Report</Typography>
          <List>
            <ListItem>
              <ListItemText primary="Date" secondary={reportItem.date} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Work Completed" secondary={reportItem.work_completed} />
            </ListItem>
             <ListItem>
              <ListItemText primary="Work Planned" secondary={reportItem.work_planned} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Issues" secondary={reportItem.issues} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Total Spendings" secondary={reportItem.total_spendings} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Workers Pay" secondary={reportItem.workers_pay} />
            </ListItem>
          </List>
        </Box>
      )}

      {activeTab === 1 && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6">Materials Used</Typography>
          <List>
            {reportItem.materials.map((material) => (
              <ListItem key={material.id}>
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
