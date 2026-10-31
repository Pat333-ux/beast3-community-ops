import { memberDirectory, MemberRole } from "../core/MemberDirectory";
import { supportTicketManager, TicketCategory, TicketStatus } from "../core/SupportTicketManager";

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export class CommunityAPIHandler {
  /**
   * Register a new community member.
   * POST /api/community/members
   */
  static registerMember(body: {
    username: string;
    walletAddress: string;
    role?: MemberRole;
    divisionsJoined?: string[];
  }): APIResponse<any> {
    try {
      if (!body.username || !body.walletAddress) {
        return {
          success: false,
          error: "Missing required fields: username or walletAddress.",
          timestamp: new Date().toISOString(),
        };
      }

      const member = memberDirectory.registerMember(
        body.username,
        body.walletAddress,
        body.role || "Contributor",
        body.divisionsJoined || []
      );

      return {
        success: true,
        data: member,
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Failed to register member.",
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Create a support ticket.
   * POST /api/community/tickets
   */
  static createTicket(body: {
    memberId: string;
    category: TicketCategory;
    subject: string;
    description: string;
  }): APIResponse<any> {
    const member = memberDirectory.getMember(body.memberId);
    if (!member) {
      return {
        success: false,
        error: "Member not found in directory.",
        timestamp: new Date().toISOString(),
      };
    }

    const ticket = supportTicketManager.createTicket(
      body.memberId,
      body.category,
      body.subject,
      body.description
    );

    return {
      success: true,
      data: ticket,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Retrieve member community dossier and tickets.
   * GET /api/community/dossier/:memberId
   */
  static getMemberDossier(memberId: string): APIResponse<any> {
    const member = memberDirectory.getMember(memberId);
    if (!member) {
      return {
        success: false,
        error: "Member profile not found.",
        timestamp: new Date().toISOString(),
      };
    }

    const tickets = supportTicketManager.getTicketsByMember(memberId);

    return {
      success: true,
      data: {
        member,
        tickets,
      },
      timestamp: new Date().toISOString(),
    };
  }
}
