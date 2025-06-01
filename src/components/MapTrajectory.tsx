import React from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  Chip,
  Paper,
  Grid
} from '@mui/material';

import {
  type TraceItem
} from '../Analysis/types';

import { 
  DateRange as DateIcon, 
  LocationCity as CityIcon, 
  Place as LocationIcon,
  Flight as FlightIcon
} from '@mui/icons-material';
import type { Time } from '../Analysis/types';

interface MapTrajectoryProps {
  data: TraceItem[];
}

export default function MapTrajectory({ data }: MapTrajectoryProps) {
  const dateFormatter = (item: Time|undefined) => {
    if (!item) return '';
    return `${item.year}/${item.month.toString().padStart(2, '0')}/${item.day.toString().padStart(2, '0')}`;
  };

  if (!data || data.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
        <Typography variant="body1" color="textSecondary">
          暂无轨迹数据
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2, background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)' }}>
        <Grid container alignItems="center">
          <FlightIcon sx={{ mr: 1 }} />
          <Typography variant="h6">行程轨迹</Typography>
          <Chip 
            label={`${data.length}个地点`} 
            size="small" 
            sx={{ ml: 2, bgcolor: 'primary.light', color: 'white' }} 
          />
        </Grid>
      </Box>
      
      <List sx={{ maxHeight: 500, overflow: 'auto' }}>
        {data.map((item, index) => {
          const startDate = dateFormatter(item.startTime);
          const endDate = dateFormatter(item.endTime);
          const dateText = startDate === endDate 
            ? startDate 
            : `${startDate} - ${endDate}`;
            
          const location = `${item.province}${item.city}` 
          
          return (
            <React.Fragment key={index}>
              <ListItem>
                <Box sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white', 
                  borderRadius: '50%', 
                  width: 28, 
                  height: 28, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <Typography variant="body2">{index + 1}</Typography>
                </Box>
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CityIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        {location}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <DateIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {dateText}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {item.longitude.toFixed(6)}, {item.latitude.toFixed(6)}
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
              
              {index < data.length - 1 && (
                <Divider variant="inset" component="li" sx={{ ml: 7 }} />
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Paper>
  );
}
