using TestReactAuth.Api.Model;

namespace ReactMessagingV1.Api.Model
{
    public class Message
    {
        public Guid MessageId { get; set; }
        public Guid SessionId { get; set; }
        public string SenderId { get; set; }
        public string Text { get; set; }
        public DateTime SentAt { get; set; }

        // Navigation properties
        public ChatSession ChatSession { get; set; }
        public UserModel Sender { get; set; }
    }
}
