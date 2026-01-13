import { PrismaClient } from '../../src/db/prisma';

export class TenantSeeder {
  constructor(private prisma: PrismaClient) {}

  async seed() {
    console.log('Seeding tenant...');

    const tenant = await this.prisma.tenant.create({
      data: {
        name: 'Petromate Demo',
        email: 'demo@petromate.com',
        contact: '+63 912 345 6789',
        address: '123 Business St, Manila, Philippines',
        description: 'Demo tenant for Petromate application',
      },
    });

    console.log(`Tenant created: ${tenant.name} (${tenant.id})\n`);
    return tenant;
  }
}
