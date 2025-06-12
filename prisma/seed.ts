import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: 'admin@thesharpexecutive.com',
    },
  })

  if (existingAdmin) {
    console.log('Admin user already exists, skipping creation')
    return
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin123!', 10)
  
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@thesharpexecutive.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('Created admin user:', admin.id)

  // Create a test category
  const category = await prisma.category.create({
    data: {
      name: 'Getting Started',
      slug: 'getting-started',
      description: 'Tips and guides to help you get started',
    },
  })

  console.log('Created category:', category.id)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
