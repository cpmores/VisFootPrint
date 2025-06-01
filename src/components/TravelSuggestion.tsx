import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Grid,
  Chip
} from '@mui/material';
import {
  TravelExplore as TravelIcon,
} from '@mui/icons-material';
import type { TraceItem ,Time } from '../Analysis/types';

import Loading from './Loading';

interface TravelSuggestionProps {
  data: TraceItem[];
  onGetSuggestions: (traces: TraceItem[]) => Promise<string>;
}

interface SuggestionState {
  content: string;
  loading: boolean;
  error: string | null;
}

const TravelSuggestion = ({ data, onGetSuggestions }: TravelSuggestionProps) => {
  const [suggestion, setSuggestion] = useState<SuggestionState>({
    content: '',
    loading: true,
    error: null
  });

  let [loading,setLoading] = useState(true);

  const fetchSuggestions = async () => {
    try {
      setSuggestion({ content: '', loading: true, error: null });
      
      const content = await onGetSuggestions(data);
      
      setSuggestion({ content, loading: false, error: null });
      setLoading(false);
    } catch (error) {
      console.error('获取旅游建议失败:', error);
      setSuggestion({ 
        content: '', 
        loading: false, 
        error: '获取旅游建议失败，请稍后重试' 
      });
    }
  };

  useEffect(() => {
    if (data.length > 0) {
      fetchSuggestions();
    } else {
      setSuggestion({
        content: '',
        loading: false,
        error: '无行程数据，无法获取建议'
      });
    }
  }, [data]);

  return (
    <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        p:2 ,
        background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)'
      }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid container alignItems="center">
            <TravelIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              旅行建议
            </Typography>
          </Grid>
        </Grid>
      </Box>
      
      {
        loading ? 
          <Loading /> : 
          <div>
            <p style={
              { textIndent: '2em' }
            }>
              {suggestion.content}
            </p>    
          </div>
      }

    </Paper>
  );
};

export default TravelSuggestion;
