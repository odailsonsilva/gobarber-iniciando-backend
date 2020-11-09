import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/Users';

import AppError from '../errors/AppError';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    // regra para nao duplicar usuarios
    const checkUserExists = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new AppError('Email address already used.');
    }

    // regra de negocio para criptografar senha
    const hanshedPassword = await hash(password, 8);

    // cria usuario e salva na base de dados
    const user = usersRepository.create({
      name,
      email,
      password: hanshedPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
