import { Box, Skeleton, useTheme } from '@mui/material';

function LoadingScreen() {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header Skeleton */}
      <Box sx={{ display: 'flex', mb: 2 }}>
        <Skeleton variant="text" width="20%" height={30} />
        <Skeleton variant="text" width="15%" height={30} sx={{ ml: 2 }} />
        <Skeleton variant="text" width="15%" height={30} sx={{ ml: 2 }} />
        <Skeleton variant="text" width="15%" height={30} sx={{ ml: 2 }} />
        <Skeleton variant="text" width="15%" height={30} sx={{ ml: 2 }} />
        <Skeleton variant="text" width="15%" height={30} sx={{ ml: 2 }} />
      </Box>

      {/* Table Rows Skeleton */}
      {[...Array(5)].map((_, index) => (
        <Box key={index} sx={{ display: 'flex', mb: 2 }}>
          <Skeleton variant="text" width="20%" height={40} />
          <Skeleton variant="text" width="15%" height={40} sx={{ ml: 2 }} />
          <Skeleton variant="text" width="15%" height={40} sx={{ ml: 2 }} />
          <Skeleton variant="text" width="15%" height={40} sx={{ ml: 2 }} />
          <Skeleton variant="text" width="15%" height={40} sx={{ ml: 2 }} />
          <Skeleton variant="text" width="15%" height={40} sx={{ ml: 2 }} />
        </Box>
      ))}
    </Box>
  );
}

export default LoadingScreen; 