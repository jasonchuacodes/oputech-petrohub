import { PrismaClient } from '../../src/db/prisma';
import { generateHash } from '../../src/utils/bcrypt';
import { Role } from '../../src/db/prisma';

export class UserSeeder {
  constructor(private prisma: PrismaClient) {}

  async seed(tenantId: string) {
    console.log('Seeding users...');

    const usersData = [
      {
        username: 'admin',
        email: 'admin@buzhub.com',
        name: 'Admin User',
        password: 'Password123!',
        role: Role.ADMIN,
        shiftAssignment: null,
      },
      {
        username: 'jsmith',
        email: 'john.smith@buzhub.com',
        name: 'John Smith',
        password: 'password',
        role: Role.USER,
        shiftAssignment: 'morning',
      },
      {
        username: 'mjohnson',
        email: 'mary.johnson@buzhub.com',
        name: 'Mary Johnson',
        password: 'password',
        role: Role.USER,
        shiftAssignment: 'morning',
      },
      {
        username: 'rbrown',
        email: 'robert.brown@buzhub.com',
        name: 'Robert Brown',
        password: 'password',
        role: Role.USER,
        shiftAssignment: 'afternoon',
      },
      {
        username: 'lwilliams',
        email: 'lisa.williams@buzhub.com',
        name: 'Lisa Williams',
        password: 'password',
        role: Role.USER,
        shiftAssignment: 'afternoon',
      },
      {
        username: 'djones',
        email: 'david.jones@buzhub.com',
        name: 'David Jones',
        password: 'password',
        role: Role.USER,
        shiftAssignment: 'morning',
      },
    ];

    let adminUser: any = null;
    const morningShiftUsers: any[] = [];
    const afternoonShiftUsers: any[] = [];

    for (const userData of usersData) {
      const hashedPassword = await generateHash(userData.password);

      const user = await this.prisma.user.upsert({
        where: { username: userData.username },
        update: {},
        create: {
          username: userData.username,
          email: userData.email,
          name: userData.name,
          password: hashedPassword,
          role: userData.role,
          shouldChangePassword: false,
        },
      });

      // Create tenant relationship
      await this.prisma.tenantsOnUsers.upsert({
        where: {
          userId_tenantId: {
            userId: user.id,
            tenantId,
          },
        },
        update: {},
        create: {
          userId: user.id,
          tenantId,
        },
      });

      // Categorize users by shift assignment
      if (userData.role === Role.ADMIN) {
        adminUser = user;
        console.log(`Admin: ${userData.username} (${userData.name}) - ${userData.email}`);
      } else {
        const shiftLabel = userData.shiftAssignment === 'morning' ? '[Morning Shift]' : '[Afternoon Shift]';
        console.log(`User: ${userData.username} (${userData.name}) - ${userData.email} ${shiftLabel}`);

        if (userData.shiftAssignment === 'morning') {
          morningShiftUsers.push(user);
        } else {
          afternoonShiftUsers.push(user);
        }
      }
    }

    console.log('Users seeded successfully\n');

    return {
      adminUser,
      morningShiftUsers,
      afternoonShiftUsers,
    };
  }
}
