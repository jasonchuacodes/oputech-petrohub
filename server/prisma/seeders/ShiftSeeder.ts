import { PrismaClient, User } from '../../src/db/prisma';
import { getNextShiftColor } from '../../src/modules/shift/utils/shiftColors';

interface UsersByShift {
  morningShiftUsers: User[];
  afternoonShiftUsers: User[];
}

export class ShiftSeeder {
  constructor(private prisma: PrismaClient) {}

  async seed(tenantId: string, usersByShift: UsersByShift) {
    console.log('Seeding shifts...');

    const shiftsData = [
      {
        name: 'Morning Shift',
        shiftStart: new Date('1970-01-01T05:00:00.000Z'), // 5:00 AM
        shiftEnd: new Date('1970-01-01T13:00:00.000Z'), // 1:00 PM
      },
      {
        name: 'Afternoon Shift',
        shiftStart: new Date('1970-01-01T13:00:00.000Z'), // 1:00 PM
        shiftEnd: new Date('1970-01-01T21:00:00.000Z'), // 9:00 PM
      },
    ];

    const shifts: any[] = [];

    for (let i = 0; i < shiftsData.length; i++) {
      const shiftData = shiftsData[i];
      const color = getNextShiftColor(i);

      const shift = await this.prisma.shift.create({
        data: {
          tenantId,
          name: shiftData.name,
          shiftStart: shiftData.shiftStart,
          shiftEnd: shiftData.shiftEnd,
          color,
        },
      });

      shifts.push(shift);

      // Log shift creation with time and color
      const startTime = shiftData.shiftStart.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      const endTime = shiftData.shiftEnd.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      console.log(`Shift: ${shiftData.name} (${startTime} - ${endTime}) [${color}]`);
    }

    // Assign users to shifts
    const morningShift = shifts[0];
    const afternoonShift = shifts[1];

    // Assign morning shift users
    for (const user of usersByShift.morningShiftUsers) {
      await this.prisma.tenantsOnUsers.update({
        where: {
          userId_tenantId: {
            userId: user.id,
            tenantId,
          },
        },
        data: {
          shiftId: morningShift.id,
        },
      });
    }
    console.log(`  - Assigned ${usersByShift.morningShiftUsers.length} users to ${morningShift.name}`);

    // Assign afternoon shift users
    for (const user of usersByShift.afternoonShiftUsers) {
      await this.prisma.tenantsOnUsers.update({
        where: {
          userId_tenantId: {
            userId: user.id,
            tenantId,
          },
        },
        data: {
          shiftId: afternoonShift.id,
        },
      });
    }
    console.log(`  - Assigned ${usersByShift.afternoonShiftUsers.length} users to ${afternoonShift.name}`);

    console.log('Shifts seeded successfully\n');

    return {
      morningShift,
      afternoonShift,
    };
  }
}
