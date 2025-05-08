// tamagui.config.ts
import { createTamagui } from 'tamagui'
import { config as defaultConfig } from '@tamagui/config'

const config = createTamagui(defaultConfig)

type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default config
