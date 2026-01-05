import { Icon, Stack, Typography } from '@mui/material';
import type { ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';

export type BreadcrumbItem = {
  label: string;
  to?: string;
  icon?: ComponentType;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  const navigate = useNavigate();

  const handleNavigate = (to: string) => {
    navigate(to);
  };

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <Stack key={index} direction="row" alignItems="center" spacing={1}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              onClick={item.to ? () => handleNavigate(item.to!) : undefined}
              sx={{
                cursor: item.to ? 'pointer' : 'default',
                '& > *': {
                  transition: 'color 0.2s',
                },
                ...(!isLast &&
                  item.to && {
                    '&:hover': {
                      '& .MuiIcon-root, & .MuiTypography-root': {
                        color: 'text.primary',
                      },
                    },
                  }),
              }}
            >
              {item.icon && (
                <Icon
                  component={item.icon}
                  fontSize="small"
                  sx={{
                    color: isLast ? 'text.primary' : 'text.secondary',
                    transition: 'color 0.2s',
                  }}
                />
              )}
              <Typography
                variant="body2"
                sx={{
                  fontSize: 'body2.fontSize',
                  color: isLast ? 'text.primary' : 'text.secondary',
                  fontWeight: isLast ? 'medium' : 'normal',

                  ...(isLast && {
                    bgcolor: 'primary.alpha',
                    borderRadius: 2,
                    px: 1,
                    py: 0.5,
                  }),
                }}
              >
                {item.label}
              </Typography>
            </Stack>

            {!isLast && (
              <Typography variant="body2" color="text.secondary">
                /
              </Typography>
            )}
          </Stack>
        );
      })}
    </Stack>
  );
};
