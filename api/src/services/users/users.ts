import type { Prisma } from '@prisma/client'
import { db } from 'src/lib/db'
import { requireAuth } from 'src/lib/auth'

export const users = () => {
  requireAuth({ roles: 'admin' })
  return db.user.findMany()
}

export const user = ({ id }: Prisma.UserWhereUniqueInput) => {
  requireAuth({ roles: '' })
  return db.user.findUnique({
    where: { id },
  })
}

interface CreateUserArgs {
  input: Prisma.UserCreateInput
}

export const createUser = ({ input }: CreateUserArgs) => {
  requireAuth({ roles: '' })
  return db.user.create({
    data: input,
  })
}

interface UpdateUserArgs extends Prisma.UserWhereUniqueInput {
  input: Prisma.UserUpdateInput
}

export const updateUser = ({ id, input }: UpdateUserArgs) => {
  requireAuth({ roles: 'admin' })
  return db.user.update({
    data: input,
    where: { id },
  })
}

export const deleteUser = ({ id }: Prisma.UserWhereUniqueInput) => {
  requireAuth({ roles: 'admin' })
  return db.user.delete({
    where: { id },
  })
}
