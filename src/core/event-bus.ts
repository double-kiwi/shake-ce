import type { AdjustType } from '@/stores/configuration'
import mitt from 'mitt'

export type AdjustConfigurationPayload = {
    id: string
    key: string
    value: string[]
    type: AdjustType
}

type Events = {
    'conf:adjust': AdjustConfigurationPayload[]
}

export const eventBus = mitt<Events>()
