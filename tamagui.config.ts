import { createTamagui } from 'tamagui'
import { themes } from './themes'
import { config as v3Config } from '@tamagui/config/v3'
import { shorthands } from '@tamagui/shorthands'

export const config = createTamagui({
  ...v3Config,
  themes,
  shorthands,
})

export type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config
 