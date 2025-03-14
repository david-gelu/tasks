import { hash } from "bcryptjs"
import prisma from "../app/utils/connect"

async function resetPassword() {
  const userId = "test" // Your user ID
  const newPassword = "your-new-password"

  const hashedPassword = await hash(newPassword, 12)

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  })

  console.log("Password reset successfully")
}

resetPassword()
  .catch(console.error)
  .finally(() => prisma.$disconnect())


//npx ts-node scripts/reset-password.ts