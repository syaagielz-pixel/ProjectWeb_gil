import { Cpu, HardDrive, MemoryStick, Monitor, Zap } from 'lucide-react'

/** Ordered spec rows shown on cards, rows and the detail modal. */
export const SPEC_FIELDS = [
  { key: 'cpu', label: 'Processor', icon: Cpu },
  { key: 'gpu', label: 'Graphics', icon: Zap },
  { key: 'ram', label: 'Memory', icon: MemoryStick },
  { key: 'storage', label: 'Storage', icon: HardDrive },
  { key: 'display', label: 'Display', icon: Monitor },
]
