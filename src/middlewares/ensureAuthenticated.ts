import { Request, Response, NextFunction } from 'express';
import { decode, verify } from 'jsonwebtoken';

import authConfig from '../config/auth';

import AppError from '../errors/AppError';

interface TokenPaylaoad {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  // validacao do token jwt
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  // dividindo o token de Bearer
  const [, token] = authHeader.split(' ');

  // verifica se o token e valido. caso nao seja valido ele da um erro (throw) e como msg e padrao quero colocar a minha mensagem
  try {
    const decoded = verify(token, authConfig.jwt.secret);
    const { sub } = decoded as TokenPaylaoad;

    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}
