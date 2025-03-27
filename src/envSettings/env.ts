import { cleanEnv, str } from 'envalid'

export const env = cleanEnv(process.env, {
  DATABASE_URL: str(),
  PORT: str({ default: '3000' }),
  REDIS_HOST: str({ default: 'localhost' }),
  REDIS_PORT: str({ default: '6379' }),
  JWT_ACCESS_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  ENCRYPTION_KEY: str(),
  ALCHEMY_API_KEY: str(),
  ETH_MAINNET_PROVIDER_RPC_URL: str(),
  ETH_TESTNET_PROVIDER_RPC_URL: str()
})
