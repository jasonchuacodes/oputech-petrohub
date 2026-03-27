import { PrismaClient } from '../src/db/prisma';
import { TenantSeeder } from './seeders/TenantSeeder';
import { ProductSeeder } from './seeders/ProductSeeder';
import { UserSeeder } from './seeders/UserSeeder';
import { ShiftSeeder } from './seeders/ShiftSeeder';

const prisma = new PrismaClient();

const main = async () => {
  console.log('Starting database seeding...\n');

  // Create tenant first
  const tenantSeeder = new TenantSeeder(prisma);
  const tenant = await tenantSeeder.seed();

  console.log(`Using tenant: ${tenant.name} (${tenant.id})\n`);

  // Run seeders in dependency order
  const productSeeder = new ProductSeeder(prisma);
  await productSeeder.seed(tenant.id);

  const userSeeder = new UserSeeder(prisma);
  const { morningShiftUsers, afternoonShiftUsers } =
    await userSeeder.seed(tenant.id);

  const shiftSeeder = new ShiftSeeder(prisma);
  await shiftSeeder.seed(
    tenant.id,
    { morningShiftUsers, afternoonShiftUsers }
  );

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
