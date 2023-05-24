namespace ReactMessagingV1.Api.Model
{
    public class ChatSession
    {
        public Guid SessionId { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime? EndedAt { get; set; }

        // Navigation property for related ChatSessionUsers
        public ICollection<ChatSessionUser> ChatSessionUsers { get; set; }

        // Navigation property for related Messages
        public ICollection<Message> Messages { get; set; }
    }
}
