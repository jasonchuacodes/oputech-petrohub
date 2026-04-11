import { LocalGasStation, EditOutlined } from '@mui/icons-material';
import { alpha, IconButton, Stack, Tooltip, Typography, type Theme } from '@mui/material';

import { Show } from '~/components/ui';
import { type Product, type ProductColor } from '~/services/product/product.types';
import theme from '~/theme';
import { formatCurrency } from '~/utils/number';
import { formatDate } from '~/utils/date';

import { getProductTypeDisplayName } from '../../../products/utils';

type ProductPriceProps = {
  product: Product;
  onEdit?: (product: Product) => void;
};

const productColorMap = (theme: Theme): Record<ProductColor, string> => ({
  grey: theme.palette.grey[500],
  primary: theme.palette.primary.main,
  error: theme.palette.error.main,
  warning: theme.palette.warning.main,
  success: theme.palette.success.main,
  info: theme.palette.info.main,
});

export const ProductPrice = ({ product, onEdit }: ProductPriceProps) => {
  const baseColor = productColorMap(theme)[product.color];
  const bgColor = alpha(baseColor, 0.05);

  return (
    <Stack
      p={2}
      spacing={1}
      bgcolor="background.paper"
      borderRadius={2}
      height="100%"
      width="100%"
      flex={1}
    >
      <Stack alignItems="center" direction="row" spacing={1}>
        <Stack borderRadius={8} p={1.5} bgcolor={bgColor}>
          <LocalGasStation color={product.color === 'grey' ? undefined : product.color} />
        </Stack>
        <Typography variant="body1" fontWeight={600} flex={1}>
          {getProductTypeDisplayName(product.type)}
        </Typography>
        {onEdit && (
          <Tooltip title="Edit price">
            <IconButton size="small" onClick={() => onEdit(product)}>
              <EditOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Show
        when={!!product.scheduledPrice}
        fallback={
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight={600} color="text.primary">
              {formatCurrency(product.productPrice?.price)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last updated on {formatDate(product.productPrice?.effectiveFrom, 'MMM DD, YYYY')}
            </Typography>
          </Stack>
        }
      >
        <Stack spacing={0.5}>
          <Typography variant="h6" fontWeight={600} color="text.primary">
            {formatCurrency(product.productPrice?.price)}
          </Typography>
        </Stack>

        {product.scheduledPrice && (
          <Typography variant="body2" color="text.secondary">
            Scheduled price change to{' '}
            <Typography variant="inherit" component="span" color="warning.main">
              {formatCurrency(product.scheduledPrice.price)}{' '}
            </Typography>
            on {formatDate(product.scheduledPrice.effectiveFrom, 'MMMM D, YYYY [at] hh:mm A')}
          </Typography>
        )}
      </Show>
    </Stack>
  );
};
