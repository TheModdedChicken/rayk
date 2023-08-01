import path from 'path';

interface IEnv {
  NODE_ENV: string

  PORT: number
  DATABASE_URL: string

  AUTH_SECRET: string
  SNOWFLAKE_EPOCH: string

  EMAIL_HOST: string
  EMAIL_PORT: number
  EMAIL_USER: string
  EMAIL_PASS: string
}

const env: IEnv = {
  NODE_ENV: getVariable<string>('NODE_ENV', true),

  PORT: /*getVariable<number>('PORT') ||*/ 5656,
  DATABASE_URL: getVariable<string>('DATABASE_URL', true),

  AUTH_SECRET: getVariable<string>('AUTH_SECRET', true),
  SNOWFLAKE_EPOCH: getVariable<string>('SNOWFLAKE_EPOCH', true),

  EMAIL_HOST: getVariable<string>('EMAIL_HOST', true),
  EMAIL_PORT: getVariable<number>('EMAIL_PORT', true),
  EMAIL_USER: getVariable<string>('EMAIL_USER', true),
  EMAIL_PASS: getVariable<string>('EMAIL_PASS', true)
};

function getVariable<T> (name: string, required?: boolean): T {
  const v = process.env[name] as T;
  if (required && !v) throw new Error(`Couldn't find variable named '${name}`);
  return v;
}

export default env;