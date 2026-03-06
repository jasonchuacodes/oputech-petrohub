import {
  startOfMonth,
  endOfMonth,
  startOfDay,
  eachDayOfInterval,
  subDays,
  differenceInDays,
} from 'date-fns';
import { Decimal } from '@prisma/client/runtime/library';

import { prisma } from '~/db';
import { ProductType } from '~/db/prisma';

export interface AnalyticsDatapoint {
  value: number;
  timestamp: string;
}

export interface AnalyticsData {
  value: number;
  changePercentage: number;
  datapoints: AnalyticsDatapoint[];
}

export interface DisposalAnalyticsDataByType {
  productType: ProductType;
  value: number;
  changePercentage: number;
}

interface GetTotalIncomeAnalyticsParams {
  tenantId: string;
  startDate?: Date;
  endDate?: Date;
}

interface GetTotalExpenseAnalyticsParams {
  tenantId: string;
  startDate?: Date;
  endDate?: Date;
}

interface GetTotalInventorySalesAnalyticsParams {
  tenantId: string;
  startDate?: Date;
  endDate?: Date;
}

interface GetDisposalAnalyticsByTypeParams {
  tenantId: string;
  startDate?: Date;
  endDate?: Date;
}

export const getTotalIncomeAnalytics = async ({
  tenantId,
  startDate,
  endDate,
}: GetTotalIncomeAnalyticsParams): Promise<AnalyticsData> => {
  // Default to current month if dates not provided
  const now = new Date();
  const periodStart = startDate || startOfMonth(now);
  const periodEnd = endDate || endOfMonth(now);

  // Calculate previous period for comparison (same duration before startDate)
  const periodDuration = differenceInDays(periodEnd, periodStart) + 1;
  const previousPeriodEnd = subDays(periodStart, 1);
  const previousPeriodStart = subDays(previousPeriodEnd, periodDuration - 1);

  // Query aggregations for current period
  const currentAggregations = await prisma.reportIncomeAggregation.findMany({
    where: {
      tenantId,
      hourBucket: {
        gte: periodStart,
        lte: periodEnd,
      },
    },
    orderBy: { hourBucket: 'asc' },
  });

  // Query aggregations for previous period
  const previousAggregations = await prisma.reportIncomeAggregation.findMany({
    where: {
      tenantId,
      hourBucket: {
        gte: previousPeriodStart,
        lte: previousPeriodEnd,
      },
    },
  });

  // Calculate totals
  const currentTotal = currentAggregations.reduce(
    (sum: Decimal, agg) => sum.add(agg.totalAmount),
    new Decimal(0),
  );

  const previousTotal = previousAggregations.reduce(
    (sum: Decimal, agg) => sum.add(agg.totalAmount),
    new Decimal(0),
  );

  // Calculate change percentage
  let changePercentage = 0;
  if (previousTotal.gt(0)) {
    const change = currentTotal.sub(previousTotal);
    changePercentage = change.div(previousTotal).mul(100).toNumber();
  } else if (currentTotal.gt(0)) {
    changePercentage = 100; // 100% increase if previous was 0
  }

  // Group hourly data into daily datapoints
  const dailyMap = new Map<string, Decimal>();

  for (const agg of currentAggregations) {
    const dayKey = startOfDay(agg.hourBucket).toISOString();
    const existing = dailyMap.get(dayKey);
    if (existing) {
      dailyMap.set(dayKey, existing.add(agg.totalAmount));
    } else {
      dailyMap.set(dayKey, new Decimal(agg.totalAmount));
    }
  }

  // Fill gaps with zeros using eachDayOfInterval
  const allDays = eachDayOfInterval({ start: periodStart, end: periodEnd });
  const datapoints: AnalyticsDatapoint[] = allDays.map((day: Date) => {
    const dayKey = startOfDay(day).toISOString();
    const value = dailyMap.get(dayKey) || new Decimal(0);
    return {
      value: value.toNumber(),
      timestamp: dayKey,
    };
  });

  return {
    value: currentTotal.toNumber(),
    changePercentage: Math.round(changePercentage * 100) / 100, // Round to 2 decimals
    datapoints,
  };
};

export const getTotalExpenseAnalytics = async ({
  tenantId,
  startDate,
  endDate,
}: GetTotalExpenseAnalyticsParams): Promise<AnalyticsData> => {
  // Default to current month if dates not provided
  const now = new Date();
  const periodStart = startDate || startOfMonth(now);
  const periodEnd = endDate || endOfMonth(now);

  // Calculate previous period for comparison (same duration before startDate)
  const periodDuration = differenceInDays(periodEnd, periodStart) + 1;
  const previousPeriodEnd = subDays(periodStart, 1);
  const previousPeriodStart = subDays(previousPeriodEnd, periodDuration - 1);

  // Query aggregations for current period
  const currentAggregations = await prisma.reportExpenseAggregation.findMany({
    where: {
      tenantId,
      hourBucket: {
        gte: periodStart,
        lte: periodEnd,
      },
    },
    orderBy: { hourBucket: 'asc' },
  });

  // Query aggregations for previous period
  const previousAggregations = await prisma.reportExpenseAggregation.findMany({
    where: {
      tenantId,
      hourBucket: {
        gte: previousPeriodStart,
        lte: previousPeriodEnd,
      },
    },
  });

  // Calculate totals
  const currentTotal = currentAggregations.reduce(
    (sum: Decimal, agg) => sum.add(agg.totalAmount),
    new Decimal(0),
  );

  const previousTotal = previousAggregations.reduce(
    (sum: Decimal, agg) => sum.add(agg.totalAmount),
    new Decimal(0),
  );

  // Calculate change percentage
  let changePercentage = 0;
  if (previousTotal.gt(0)) {
    const change = currentTotal.sub(previousTotal);
    changePercentage = change.div(previousTotal).mul(100).toNumber();
  } else if (currentTotal.gt(0)) {
    changePercentage = 100; // 100% increase if previous was 0
  }

  // Group hourly data into daily datapoints
  const dailyMap = new Map<string, Decimal>();

  for (const agg of currentAggregations) {
    const dayKey = startOfDay(agg.hourBucket).toISOString();
    const existing = dailyMap.get(dayKey);
    if (existing) {
      dailyMap.set(dayKey, existing.add(agg.totalAmount));
    } else {
      dailyMap.set(dayKey, new Decimal(agg.totalAmount));
    }
  }

  // Fill gaps with zeros using eachDayOfInterval
  const allDays = eachDayOfInterval({ start: periodStart, end: periodEnd });
  const datapoints: AnalyticsDatapoint[] = allDays.map((day: Date) => {
    const dayKey = startOfDay(day).toISOString();
    const value = dailyMap.get(dayKey) || new Decimal(0);
    return {
      value: value.toNumber(),
      timestamp: dayKey,
    };
  });

  return {
    value: currentTotal.toNumber(),
    changePercentage: Math.round(changePercentage * 100) / 100, // Round to 2 decimals
    datapoints,
  };
};

export const getTotalInventorySalesAnalytics = async ({
  tenantId,
  startDate,
  endDate,
}: GetTotalInventorySalesAnalyticsParams): Promise<AnalyticsData> => {
  const now = new Date();
  const periodStart = startDate || startOfMonth(now);
  const periodEnd = endDate || endOfMonth(now);

  const periodDuration = differenceInDays(periodEnd, periodStart) + 1;
  const previousPeriodEnd = subDays(periodStart, 1);
  const previousPeriodStart = subDays(previousPeriodEnd, periodDuration - 1);

  const currentAggregations = await prisma.reportInventorySalesAggregation.findMany({
    where: {
      tenantId,
      hourBucket: {
        gte: periodStart,
        lte: periodEnd,
      },
    },
    orderBy: { hourBucket: 'asc' },
  });

  const previousAggregations = await prisma.reportInventorySalesAggregation.findMany({
    where: {
      tenantId,
      hourBucket: {
        gte: previousPeriodStart,
        lte: previousPeriodEnd,
      },
    },
  });

  const currentTotal = currentAggregations.reduce(
    (sum: Decimal, agg) => sum.add(agg.totalAmount),
    new Decimal(0),
  );

  const previousTotal = previousAggregations.reduce(
    (sum: Decimal, agg) => sum.add(agg.totalAmount),
    new Decimal(0),
  );

  let changePercentage = 0;
  if (previousTotal.gt(0)) {
    const change = currentTotal.sub(previousTotal);
    changePercentage = change.div(previousTotal).mul(100).toNumber();
  } else if (currentTotal.gt(0)) {
    changePercentage = 100;
  }

  const dailyMap = new Map<string, Decimal>();

  for (const agg of currentAggregations) {
    const dayKey = startOfDay(agg.hourBucket).toISOString();
    const existing = dailyMap.get(dayKey);
    if (existing) {
      dailyMap.set(dayKey, existing.add(agg.totalAmount));
    } else {
      dailyMap.set(dayKey, new Decimal(agg.totalAmount));
    }
  }

  const allDays = eachDayOfInterval({ start: periodStart, end: periodEnd });
  const datapoints: AnalyticsDatapoint[] = allDays.map((day: Date) => {
    const dayKey = startOfDay(day).toISOString();
    const value = dailyMap.get(dayKey) || new Decimal(0);
    return {
      value: value.toNumber(),
      timestamp: dayKey,
    };
  });

  return {
    value: currentTotal.toNumber(),
    changePercentage: Math.round(changePercentage * 100) / 100,
    datapoints,
  };
};

export const getDisposalAnalyticsByType = async ({
  tenantId,
  startDate,
  endDate,
}: GetDisposalAnalyticsByTypeParams): Promise<DisposalAnalyticsDataByType[]> => {
  const now = new Date();
  const periodStart = startDate || startOfMonth(now);
  const periodEnd = endDate || endOfMonth(now);

  const periodDuration = differenceInDays(periodEnd, periodStart) + 1;
  const previousPeriodEnd = subDays(periodStart, 1);
  const previousPeriodStart = subDays(previousPeriodEnd, periodDuration - 1);

  const [currentAggregations, previousAggregations, products] = await Promise.all([
    prisma.reportDisposalAggregation.findMany({
      where: { tenantId, hourBucket: { gte: periodStart, lte: periodEnd } },
    }),
    prisma.reportDisposalAggregation.findMany({
      where: { tenantId, hourBucket: { gte: previousPeriodStart, lte: previousPeriodEnd } },
    }),
    prisma.product.findMany({
      where: { active: true },
      select: { type: true },
    }),
  ]);

  const buildTotalsMap = (aggregations: typeof currentAggregations) => {
    const map = new Map<ProductType, Decimal>();

    for (const agg of aggregations) {
      const existing = map.get(agg.productType);

      map.set(
        agg.productType,
        existing ? existing.add(agg.totalDisposal) : new Decimal(agg.totalDisposal),
      );
    }

    return map;
  };

  const currentByType = buildTotalsMap(currentAggregations);
  const previousByType = buildTotalsMap(previousAggregations);

  const productTypes = Array.from(
    new Set(products.map((p) => p.type).filter(Boolean)),
  ) as ProductType[];

  const results: DisposalAnalyticsDataByType[] = productTypes.map((productType) => {
    const currentTotal = currentByType.get(productType) ?? new Decimal(0);
    const previousTotal = previousByType.get(productType) ?? new Decimal(0);

    let changePercentage = 0;
    if (previousTotal.gt(0)) {
      changePercentage = currentTotal.sub(previousTotal).div(previousTotal).mul(100).toNumber();
    } else if (currentTotal.gt(0)) {
      changePercentage = 100;
    }

    return {
      productType,
      value: currentTotal.toNumber(),
      changePercentage: Math.round(changePercentage * 100) / 100,
    };
  });

  return results;
};
