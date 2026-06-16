export interface Recipient {
  id: string
  email: string
  name: string | null
  generatedContent: string | null
  status: "pending" | "sent" | "failed"
  sentAt: string | null
}

export interface Campaign {
  id: string
  subject: string
  context: string
  createdAt: string
  recipients: Recipient[]
}