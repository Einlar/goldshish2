import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: { data: { email: 'String4807946' } },
    two: { data: { email: 'String630192' } },
  },
})

export type StandardScenario = typeof standard
