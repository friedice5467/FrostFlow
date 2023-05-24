using TestReactAuth.Api.Model;

namespace ReactMessagingV1.Api.Model
{
    public class ChatSessionUser
    {
        public Guid SessionId { get; set; }
        public string UserId { get; set; }
        public DateTime JoinedAt { get; set; }
        public DateTime? LastOnline { get; set; }

        // Navigation properties
        public ChatSession ChatSession { get; set; }
        public UserModel User { get; set; }
    }
}
