import { PrismaClient } from '../src/db/prisma';
import { ProductSeeder } from './seeders/ProductSeeder';
import { UserSeeder } from './seeders/UserSeeder';
import { ShiftSeeder } from './seeders/ShiftSeeder';
import { ReportSeeder } from './seeders/ReportSeeder';

const prisma = new PrismaClient();

const main = async () => {
  console.log('Starting database seeding...\n');

  const tenant = await prisma.tenant.findFirst();

  if (!tenant) {
    console.log('No tenant found. Skip seeding.');
    return;
  }

  console.log(`Using tenant: ${tenant.name} (${tenant.id})\n`);

  // Run seeders in dependency order
  const productSeeder = new ProductSeeder(prisma);
  await productSeeder.seed(tenant.id);

  const userSeeder = new UserSeeder(prisma);
  const { adminUser, morningShiftUsers, afternoonShiftUsers } =
    await userSeeder.seed(tenant.id);

  const shiftSeeder = new ShiftSeeder(prisma);
  const { morningShift, afternoonShift } = await shiftSeeder.seed(
    tenant.id,
    { morningShiftUsers, afternoonShiftUsers }
  );

  const reportSeeder = new ReportSeeder(prisma);
  await reportSeeder.seed(
    tenant.id,
    adminUser.id,
    { morningShift, afternoonShift },
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
