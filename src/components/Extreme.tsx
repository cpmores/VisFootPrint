import { 
  Card, 
  CardContent, 
  Grid, 
  Typography, 
  useTheme,
  Box
} from '@mui/material';
import {
  East as EastIcon,
  West as WestIcon,
  North as NorthIcon,
  South as SouthIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { type Basedata } from '../Analysis/types';

interface ExtremePointProps {
  date: string;
  longitude: number;
  latitude: number;
}

interface ExtremeLocationsProps {
  data: Basedata[];
}

export default function ExtremeLocations({ data }: ExtremeLocationsProps) {
  const theme = useTheme();

  const dateFormatter = (item: Basedata) => {
    return `${item.year}/${item.month.toString().padStart(2, '0')}/${item.day.toString().padStart(2, '0')}`;
  };

  const getExtremePoint = (
    data: Basedata[],
    selector: (d: Basedata) => number,
    compare: 'max' | 'min'
  ): ExtremePointProps | null => {
    if (data.length === 0) return null;
    const values = data.map(selector);
    const extremeValue = compare === 'max' ? Math.max(...values) : Math.min(...values);
    const candidates = data.filter((d) => selector(d) === extremeValue);
    const res = candidates.sort((a, b) => {
      const aDate = new Date(a.year, a.month - 1, a.day);
      const bDate = new Date(b.year, b.month - 1, b.day);
      return bDate.getTime() - aDate.getTime();
    })[0];
    return {
      date: dateFormatter(res),
      longitude: res.longitude,
      latitude: res.latitude,
    }
  };

  const extremes = {
    east: getExtremePoint(data, (d) => d.longitude, 'max'),
    west: getExtremePoint(data, (d) => d.longitude, 'min'),
    north: getExtremePoint(data, (d) => d.latitude, 'max'),
    south: getExtremePoint(data, (d) => d.latitude, 'min'),
  };

  const locationCards = [
    {
      direction: '最东',
      point: extremes.east,
      Icon: EastIcon,
      color: theme.palette.error.main,
      bgColor: 'linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)',
      description: '经度值最大的位置'
    },
    {
      direction: '最南',
      point: extremes.south,
      Icon: SouthIcon,
      color: theme.palette.success.main,
      bgColor: 'linear-gradient(135deg, #A1C4FD 0%, #C2E9FB 100%)',
      description: '纬度值最小的位置'
    },
    {
      direction: '最西',
      point: extremes.west,
      Icon: WestIcon,
      color: theme.palette.info.main,
      bgColor: 'linear-gradient(135deg, #FFECD2 0%, #FCB69F 100%)',
      description: '经度值最小的位置'
    },
    {
      direction: '最北',
      point: extremes.north,
      Icon: NorthIcon,
      color: theme.palette.primary.main,
      bgColor: 'linear-gradient(135deg, #84FAB0 0%, #8FD3F4 100%)',
      description: '纬度值最大的位置'
    }
  ];

  return (
    <Box sx={{ mt: 4 }}>
      {/* // 这个组件要居中 */}
      <Typography style={{textAlign: 'center'}} variant="h6" component="h2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
        位置极限探索
      </Typography>
      
      <Grid container spacing={2}>
        {locationCards.map((card, index) => (
          <Grid key={index}>
            <Card 
              sx={{ 
                height: '100%',
                background: card.bgColor,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: 48, 
                      height: 48, 
                      borderRadius: '50%', 
                      bgcolor: 'rgba(255,255,255,0.3)',
                      mr: 2
                    }}
                  >
                    <card.Icon sx={{ fontSize: 28, color: card.color }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: card.color }}>
                    {card.direction}
                  </Typography>
                </Box>
                
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                  {card.description}
                </Typography>
                
                {card.point ? (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon sx={{ fontSize: 16, mr: 1, color: card.color }} />
                      <Typography variant="body2">
                        {card.point.latitude.toFixed(6)}°N, {card.point.longitude.toFixed(6)}°E
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarIcon sx={{ fontSize: 16, mr: 1, color: card.color }} />
                      <Typography variant="body2">
                        {card.point.date}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    无位置数据
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
