import bcrypt from 'bcryptjs';

const generateHash = async (input: string, rounds = 10): Promise<string> =>
    bcrypt.hash(input, rounds);

const verify = async (input: string, hash: string): Promise<boolean> => bcrypt.compare(input, hash);

export { generateHash, verify };
