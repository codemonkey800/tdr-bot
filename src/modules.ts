import { Client } from 'discord.js'
import { ServerState } from './state'
import _ from 'lodash'

interface Modules {
  discordClient: Client<true>
  state: ServerState
}

type ModuleKey = keyof Modules
const MODULES = Symbol('modules')

export function getModules(): Modules {
  return (global as any)[MODULES]
}

export function getModule<K extends ModuleKey>(key: K): Modules[K] {
  return getModules()[key]
}

export function addModule<K extends keyof Modules>(key: K, value: Modules[K]) {
  ;(global as any)[MODULES] = {
    ...getModules(),
    [key]: value,
  }
}
