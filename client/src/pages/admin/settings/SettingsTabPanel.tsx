import { Box } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const SettingsTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      height="100%"
      {...other}
    >
      {value === index && (
        <Box height="100%" display="flex">
          {children}
        </Box>
      )}
    </Box>
  );
};
