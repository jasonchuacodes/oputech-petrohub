import { Typography, type SxProps, type TypographyProps } from '@mui/material';
import type React from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  to: string;
  children: React.ReactNode;
  sx?: SxProps;
} & TypographyProps;

export const Link = ({ to, children, sx, ...props }: Props) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate(to);
  };
  return (
    <Typography
      onClick={handleRedirect}
      component="button"
      type="button"
      variant="body2"
      sx={{
        color: 'info.main',
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};
