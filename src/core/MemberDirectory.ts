export type MemberRole = "Contributor" | "Validator" | "Division Lead" | "Governing Officer" | "Observer";

export interface CommunityMember {
  id: string;
  username: string;
  walletAddress: string;
  role: MemberRole;
  divisionsJoined: string[];
  joinedAt: string;
  active: boolean;
}

export class MemberDirectory {
  private members: Map<string, CommunityMember> = new Map();

  /**
   * Register a new member into the community directory.
   */
  registerMember(
    username: string,
    walletAddress: string,
    role: MemberRole = "Contributor",
    divisionsJoined: string[] = []
  ): CommunityMember {
    const member: CommunityMember = {
      id: crypto.randomUUID(),
      username,
      walletAddress,
      role,
      divisionsJoined,
      joinedAt: new Date().toISOString(),
      active: true,
    };

    this.members.set(member.id, member);
    return member;
  }

  /**
   * Retrieve member details by ID.
   */
  getMember(id: string): CommunityMember | undefined {
    return this.members.get(id);
  }

  /**
   * Retrieve member details by wallet address.
   */
  getByWallet(walletAddress: string): CommunityMember | undefined {
    for (const member of this.members.values()) {
      if (member.walletAddress.toLowerCase() === walletAddress.toLowerCase()) {
        return member;
      }
    }
    return undefined;
  }

  /**
   * Update a member's role or assigned divisions.
   */
  updateMember(
    id: string,
    updates: Partial<Pick<CommunityMember, "role" | "divisionsJoined" | "active">>
  ): CommunityMember | undefined {
    const member = this.members.get(id);
    if (!member) return undefined;

    const updated: CommunityMember = {
      ...member,
      ...updates,
    };

    this.members.set(id, updated);
    return updated;
  }

  /**
   * List all active members.
   */
  getActiveMembers(): CommunityMember[] {
    return Array.from(this.members.values()).filter((m) => m.active);
  }
}

export const memberDirectory = new MemberDirectory();
