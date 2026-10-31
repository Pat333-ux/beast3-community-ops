export type TicketCategory = "Onboarding" | "Technical" | "Governance" | "Treasury" | "General";
export type TicketStatus = "Open" | "In Progress" | "Resolved" | "Closed";

export interface CommunityTicket {
  id: string;
  memberId: string;
  category: TicketCategory;
  subject: string;
  description: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export class SupportTicketManager {
  private tickets: Map<string, CommunityTicket> = new Map();

  /**
   * Open a new support ticket for a community member.
   */
  createTicket(
    memberId: string,
    category: TicketCategory,
    subject: string,
    description: string
  ): CommunityTicket {
    const ticket: CommunityTicket = {
      id: crypto.randomUUID(),
      memberId,
      category,
      subject,
      description,
      status: "Open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tickets.set(ticket.id, ticket);
    return ticket;
  }

  /**
   * Update ticket status (e.g., resolve or close).
   */
  updateStatus(ticketId: string, status: TicketStatus): CommunityTicket | undefined {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) return undefined;

    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();
    this.tickets.set(ticketId, ticket);

    return ticket;
  }

  /**
   * Get all tickets submitted by a specific member.
   */
  getTicketsByMember(memberId: string): CommunityTicket[] {
    return Array.from(this.tickets.values()).filter((t) => t.memberId === memberId);
  }

  /**
   * Get all unresolved open tickets.
   */
  getOpenTickets(): CommunityTicket[] {
    return Array.from(this.tickets.values()).filter(
      (t) => t.status === "Open" || t.status === "In Progress"
    );
  }
}

export const supportTicketManager = new SupportTicketManager();
