import { Args, Int } from '@nestjs/graphql';

export function NameArg(name = 'name') {
  return Args(name, { type: () => String, nullable: true });
}

export function PageArg(name = 'page') {
  return Args(name, { type: () => Int, nullable: true });
}

export function IdArg(name = 'id') {
  return Args(name, { type: () => Int, defaultValue: 1 });
}
