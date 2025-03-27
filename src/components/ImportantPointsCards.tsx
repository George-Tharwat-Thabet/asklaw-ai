import React from 'react';
import { Box, Card, CardContent, Typography, Stack } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

interface ImportantPointsCardsProps {
  points: string[];
}

/**
 * Component to display important points from AI responses as cards
 */
const ImportantPointsCards: React.FC<ImportantPointsCardsProps> = ({ points }) => {
  if (!points || points.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 3, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
        <InfoIcon sx={{ mr: 1 }} color="primary" />
        Important Points
      </Typography>
      <Stack spacing={2}>
        {points.map((point, index) => (
          <Card key={index} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
            <CardContent sx={{ maxHeight: '300px', overflow: 'auto' }}>
              <Typography variant="body1">{point}</Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default ImportantPointsCards;