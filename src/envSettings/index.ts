export const schema = {
  type: 'object',
  required: [
    'PORT',
    'DATABASE_URL',
    'REDIS_HOST',
    'REDIS_PORT',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET'
  ],
  properties: {
    ['DATABASE_URL']: {
      type: 'string'
    },
    ['PORT']: {
      type: 'string',
      default: 3000
    },
    ['REDIS_HOST']: {
      type: 'string',
      default: 'localhost'
    },
    ['REDIS_PORT']: {
      type: 'string',
      default: 6379
    },
    ['JWT_ACCESS_SECRET']: {
      type: 'string',
      default: 'pupa'
    },
    ['JWT_REFRESH_SECRET']: {
      type: 'string',
      default: 'lupa'
    }
  }
}

export type Envs = {
  PORT: string
  DATABASE_URL: string
  REDIS_HOST: string
  REDIS_PORT: string
  JWT_ACCESS_SECRET: string
  JWT_REFRESH_SECRET: string
}
