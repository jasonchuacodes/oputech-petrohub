import { Container, Typography } from '@mui/material';

export const HomePage = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Home Page
      </Typography>
      <Typography variant="h6" component="p">
        Your hub for all things buzzworthy!
      </Typography>
    </Container>
  );
}