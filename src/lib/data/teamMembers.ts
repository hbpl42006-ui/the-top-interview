import { fetchApi } from "@/lib/api/client";
export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  photo: string;
  twitter: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  bio: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function getActiveTeamMembers(): Promise<TeamMember[]> {
  try {
    const data = await fetchApi<any>('/api/news/team/?isActive=true');
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.map((m: any) => ({
      ...m,
      photo: m.photo || '',
      twitter: m.twitter || '',
      instagram: m.instagram || '',
      facebook: m.facebook || '',
      linkedin: m.linkedin || '',
      bio: m.bio || '',
      createdAt: new Date(m.createdAt),
      updatedAt: new Date(m.updatedAt)
    }));
  } catch (error) {
    console.error("Failed to fetch active team members:", error);
    return [];
  }
}

export async function getAllTeamMembersForAdmin(token?: string): Promise<TeamMember[]> {
  try {
    const data = await fetchApi<any>('/api/news/team/', { token });
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.map((m: any) => ({
      ...m,
      photo: m.photo || '',
      twitter: m.twitter || '',
      instagram: m.instagram || '',
      facebook: m.facebook || '',
      linkedin: m.linkedin || '',
      bio: m.bio || '',
      createdAt: new Date(m.createdAt),
      updatedAt: new Date(m.updatedAt)
    }));
  } catch (error) {
    console.error("Failed to fetch team members for admin:", error);
    return [];
  }
}
