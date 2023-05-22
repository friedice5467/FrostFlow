using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactMessagingV1.Api.DTO;
using ReactMessagingV1.Api.Model;
using TestReactAuth.Api.Db;

namespace ReactMessagingV1.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ChatController(ApplicationDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet("Sessions/{userId}")]
        public async Task<ActionResult<IEnumerable<ChatSession>>> GetChatSessions(string userId)
        {
            var sessions = await _context.ChatSessionUsers
                .Where(csu => csu.UserId == userId)
                .Include(csu => csu.ChatSession)
                    .ThenInclude(cs => cs.ChatSessionUsers)
                        .ThenInclude(csu => csu.User)
                .ToListAsync();

            // Select only necessary fields from ChatSession entity
            var optimizedSessions = sessions.Select(cs => new
            {
                SessionId = cs.ChatSession.SessionId,
                StartedAt = cs.ChatSession.StartedAt,
                EndedAt = cs.ChatSession.EndedAt,
                ChatSessionUsers = cs.ChatSession.ChatSessionUsers.Select(csu => new
                {
                    UserId = csu.User.Id,
                    JoinedAt = csu.JoinedAt,
                    LastOnline = csu.LastOnline,
                    User = new
                    {
                        Id = csu.User.Id,
                        UserName = csu.User.UserName
                    }
                })
            });

            return Ok(optimizedSessions);
        }

        [Authorize]
        [HttpGet("Messages/{sessionId}")]
        public async Task<ActionResult<IEnumerable<MessageDTO>>> GetMessages(Guid sessionId)
        {
            var messages = await _context.Messages
                .Where(m => m.SessionId == sessionId)
                .OrderBy(x => x.SentAt)
                .Include(m => m.Sender)
                .Select(m => new MessageDTO
                {
                    MessageId = m.MessageId,
                    SessionId = m.SessionId,
                    SenderId = m.SenderId,
                    Text = m.Text,
                    SentAt = m.SentAt,
                    SenderUserName = m.Sender.UserName  // Include the Sender.UserName in the response
                })
                .ToListAsync();

            return Ok(messages);
        }
    }
}
