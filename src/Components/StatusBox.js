
import { Typography, Grid, Avatar } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

import { Paper } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';


const renderStatusTextColor = (color) => {
    switch (color) {
      case "success":
        return "#00c853";
      case "danger":
        return "#d84315"
      case "warning":
        return "#FFC107"
      case "primaryLight":
        return "#3f51b5"
      default:
        return "#3f51b5"
    }
  }
  
  const renderStatusBgColor = (color) => {
    switch (color) {
      case "success":
        return "#b9f6ca60";
      case "danger":
        return "#ffcdd2";
      case "warning":
        return "#FFF8E1";
      case "primaryLight":
        return "#e8eaf6";
      case "info":
        return "#bbdefb";
      case "secondary":
        return "#f5f5f5";
      case "error":
        return "#ffcdd2";
      default:
        return "#e8eaf6";
    }
  };
  

export const StatusBox = ({    status,
  color,
  variant = "rounded",
  textTransform: t = "uppercase",
  size: s = "medium" }) => {
    return (
      <Box sx={{
        textTransform: t === "uppercase" ? "uppercase" : t === "capitalize" ? "capitalize" : "lowercase",
        backgroundColor: renderStatusBgColor(color),
        lineHeight: s === "medium" ? 1.43 : s === "small" ? 1.2 : 1.67,
        px: s === "medium" ? 2 : s === "small" ? 1.8 : 3,
        py: s === "medium" ? 1 : s === "small" ? 1 : 1.5,
        fontSize: s === "medium" ? "13px" : s === "small" ? "12px" : "15px",
        color: renderStatusTextColor(color),
        borderRadius: variant === "rounded" ? 7 : 1.5,
        textAlign: 'center'
    }}
    >
        {status}
    </Box>
    )
}

