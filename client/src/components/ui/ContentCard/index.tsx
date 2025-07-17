import { Paper, type PaperProps } from '@mui/material';

export const ContentCard = ({ children, sx, ...props }: PaperProps) => {
  return (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        width: '100%',
        maxWidth: 400,
        textAlign: 'center',
        ...sx
      }}
      {...props}
    >
      {children}
    </Paper>
  );
};
