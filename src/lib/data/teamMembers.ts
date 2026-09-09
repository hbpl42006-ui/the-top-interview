import { prisma } from "@/lib/prisma";

export async function getActiveTeamMembers() {
  return prisma.teamMember.findMany({
    where: { isActive: true },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
  });
}

export async function getAllTeamMembersForAdmin() {
  return prisma.teamMember.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
  });
}
