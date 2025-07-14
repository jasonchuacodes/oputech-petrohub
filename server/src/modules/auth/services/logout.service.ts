import { prisma } from '~/db';
import { JwtSessionPayload, verifyJwt } from '~/utils';

export const logoutSession = async (refreshToken: string) => {
  const decoded = verifyJwt<JwtSessionPayload>(refreshToken);
  if (decoded && decoded.sessionId) {
    await prisma.session.delete({
      where: { id: decoded.sessionId },
    });
  }
};
