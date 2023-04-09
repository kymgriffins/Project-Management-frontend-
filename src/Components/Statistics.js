import { Typography, Grid, Avatar, Paper } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';

export const StatisticBox = ({
  icon: Icon = WorkIcon,
  color,
  bgColor,
  testId,
  primaryText,
  secondaryText,
}) => {
  return (
    <Box
      sx={{
        my: "48px",
        boxShadow: "0px 15px 50px rgba(160, 163, 189, 0.1)",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        bgcolor: "#ffffff",
        py: 2,
        px: 2,
      }}
    >
      <Grid container direction="row" alignItems={"center"} spacing={2}>
        <Grid item>
          <Icon
            sx={{
              width: "4.5rem",
              height: "4.5rem",
              bgcolor: bgColor,
              color: color,
            }}
          />
        </Grid>
        <Grid item>
          <Typography
            color="textPrimary"
            variant="subtitle1"
            fontWeight="900"
            data-testid={testId}
          >
            {primaryText}
          </Typography>
          <Typography
            color="textSecondary"
            variant="caption"
            fontWeight="700"
          >
            {secondaryText}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export const TaskBox = ({ icon: Icon = AssignmentIcon, color, bgColor, testId, primaryText, secondaryText }) => {
    return (
        <Box sx={{ mb: "48px", boxShadow: "0px 15px 50px rgba(160, 163, 189, 0.1)", borderRadius: "10px", display: "flex", alignItems: "center", bgcolor: "#ffffff", py: 3, px: 2 }}>
            <Grid container direction="row" alignItems={"center"} columnSpacing={2}>
                <Grid item>
                    <Icon sx={{ width: "2.7rem", height: "2.7rem", bgcolor: bgColor, color: color}} />
                </Grid> 
                <Grid item>
                    <Typography color="#171717" fontSize="1rem" lineHeight="29px" fontWeight="500" data-testid={testId}>{primaryText}</Typography>
                    <Typography color="#B9B9B9" fontSize="0.875rem" lineHeight="17px" fontWeight="500">{secondaryText}</Typography>
                </Grid>
            </Grid>
        </Box>
    )
}