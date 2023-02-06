import { genSalt, hash, compare } from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(10);
  return hash(password, salt);
};

export const compareHashPassword = async (
  password: string,
  hashPassword: string,
): Promise<boolean> => {
  return compare(password, hashPassword);
};
