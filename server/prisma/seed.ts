import { PrismaClient } from '../src/db/prisma';
import { ProductSeeder } from './seeders/ProductSeeder';

const prisma = new PrismaClient();

const main = async () => {
  console.log('Starting database seeding...\n');

  const tenant = await prisma.tenant.findFirst();

  if (!tenant) {
    console.log('No tenant found. Skip seeding.');
    return;
  }

  console.log(`Using tenant: ${tenant.name} (${tenant.id})\n`);

  // Run seeders
  const productSeeder = new ProductSeeder(prisma);
  await productSeeder.seed(tenant.id);

  console.log('Database seeding completed!');
};

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
