export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'secretKey',
  expiresIn: '60m' as const,
};
