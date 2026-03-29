import { PrismaClient, ProductType } from '../../src/db/prisma';

export class ProductSeeder {
  constructor(private prisma: PrismaClient) {}

  async seed(tenantId: string): Promise<void> {
    console.log('Seeding products...');

    const products = [
      { name: 'XCS', type: ProductType.PREMIUM, color: 'primary' },
      { name: 'XTRA 1', type: ProductType.GASOLINE, color: 'success' },
      { name: 'XTRA 2', type: ProductType.GASOLINE, color: 'warning' },
      { name: 'ADO', type: ProductType.DIESEL, color: 'error' },
    ];

    const basePrices = {
      XCS: '55.50',
      'XTRA 1': '54.75',
      'XTRA 2': '54.75',
      ADO: '49.80',
    };

    for (const productData of products) {
      const product = await this.prisma.product.upsert({
        where: {
          tenantId_name_type: {
            tenantId,
            name: productData.name,
            type: productData.type,
          },
        },
        update: {
          type: productData.type,
          color: productData.color,
        },
        create: {
          tenantId,
          name: productData.name,
          type: productData.type,
          color: productData.color,
        },
      });

      const existingPrice = await this.prisma.productPrice.findFirst({
        where: { productId: product.id },
      });

      if (!existingPrice) {
        await this.prisma.productPrice.create({
          data: {
            productId: product.id,
            price: basePrices[productData.name as keyof typeof basePrices],
            effectiveFrom: new Date('2026-01-01T00:00:00Z'),
          },
        });
      }

      const existingReading = await this.prisma.productReading.findFirst({
        where: { productId: product.id },
      });

      if (!existingReading) {
        await this.prisma.productReading.create({
          data: {
            productId: product.id,
            reading: 100.0,
          },
        });
      }

      console.log(
        `Product (${productData.name}) - ₱${
          basePrices[productData.name as keyof typeof basePrices]
        }/L`,
      );
    }

    console.log('Products seeded successfully\n');
  }
}
