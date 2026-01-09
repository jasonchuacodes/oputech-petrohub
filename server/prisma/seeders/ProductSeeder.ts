import { PrismaClient } from '../../src/db/prisma';

export class ProductSeeder {
  constructor(private prisma: PrismaClient) {}

  async seed(tenantId: string): Promise<void> {
    console.log('Seeding products...');

    const products = [
      { code: 'A', name: 'Regular Gasoline', unit: 'L' },
      { code: 'B', name: 'Premium Gasoline', unit: 'L' },
      { code: 'C', name: 'Diesel', unit: 'L' },
      { code: 'D', name: 'Kerosene', unit: 'L' },
    ];

    const basePrices = {
      A: '55.50',
      B: '58.75',
      C: '52.30',
      D: '49.80',
    };

    for (const productData of products) {
      const product = await this.prisma.product.upsert({
        where: {
          tenantId_code: {
            tenantId,
            code: productData.code,
          },
        },
        update: {},
        create: {
          tenantId,
          code: productData.code,
          name: productData.name,
          unit: productData.unit,
        },
      });

      await this.prisma.productPrice.create({
        data: {
          productId: product.id,
          price: basePrices[productData.code as keyof typeof basePrices],
          effectiveFrom: new Date('2026-01-01T00:00:00Z'),
        },
      });

      console.log(
        `Product ${productData.code} (${productData.name}) - ₱${basePrices[productData.code as keyof typeof basePrices]}/L`
      );
    }

    console.log('Products seeded successfully\n');
  }
}
