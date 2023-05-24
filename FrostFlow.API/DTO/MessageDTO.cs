namespace ReactMessagingV1.Api.DTO
{
    public class MessageDTO
    {
        public Guid MessageId { get; set; }
        public Guid SessionId { get; set; }
        public string SenderId { get; set; }
        public string Text { get; set; }
        public DateTime SentAt { get; set; }
        public string? SenderUserName { get; set; }
    }
}
