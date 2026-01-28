import { PrismaClient } from '../../src/db/prisma';

export class ProductSeeder {
  constructor(private prisma: PrismaClient) {}

  async seed(tenantId: string): Promise<void> {
    console.log('Seeding products...');

    const products = [{ name: 'XCS' }, { name: 'XTRA 1' }, { name: 'XTRA 2' }, { name: 'ADO' }];

    const basePrices = {
      XCS: '55.50',
      'XTRA 1': '54.75',
      'XTRA 2': '54.75',
      ADO: '49.80',
    };

    for (const productData of products) {
      const product = await this.prisma.product.upsert({
        where: {
          tenantId_name: {
            tenantId,
            name: productData.name,
          },
        },
        update: {},
        create: {
          tenantId,
          name: productData.name,
        },
      });

      await this.prisma.productPrice.create({
        data: {
          productId: product.id,
          price: basePrices[productData.name as keyof typeof basePrices],
          effectiveFrom: new Date('2026-01-01T00:00:00Z'),
        },
      });

      await this.prisma.productReading.create({
        data: {
          productId: product.id,
          reading: 100.000,
        },
      });

      console.log(
        `Product (${productData.name}) - ₱${
          basePrices[productData.name as keyof typeof basePrices]
        }/L`,
      );
    }

    console.log('Products seeded successfully\n');
  }
}
