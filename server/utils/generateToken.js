
import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h'
    }
  );
};
