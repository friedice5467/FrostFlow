using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using ReactMessagingV1.Api.Model;
using System.Globalization;
using TestReactAuth.Api.Db;

[Authorize]
public class ChatHub : Hub
{
    private readonly ApplicationDbContext _context;

    public ChatHub(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task SendMessageToUser(string receiverUserId, string senderUserName, string message)
    {
        try
        {
            var senderUserId = Context.UserIdentifier;

            if (senderUserId == receiverUserId)
            {
                return;
            }

            var chatSession = await _context.ChatSessions
                .Include(cs => cs.ChatSessionUsers)
                    .ThenInclude(csu => csu.User)
                .FirstOrDefaultAsync(cs =>
                    cs.ChatSessionUsers.Any(csu => csu.UserId == senderUserId) &&
                    cs.ChatSessionUsers.Any(csu => csu.UserId == receiverUserId));

            if (chatSession == null)
            {
                // No existing session, cannot send message
                return;
            }

            var currentTime = DateTime.Now.ToString("s", CultureInfo.InvariantCulture);

            await Clients.User(receiverUserId).SendAsync("ReceiveMessage", chatSession.SessionId, senderUserId, message, senderUserName, currentTime);

            // Create a new Message and save to db
            var newMessage = new Message { MessageId = Guid.NewGuid(), SessionId = chatSession.SessionId, SenderId = senderUserId, Text = message, SentAt = DateTime.UtcNow };
            await _context.Messages.AddAsync(newMessage);

            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
    }

    public async Task SendChatRequest(string receiverUserId, string senderUserName)
    {
        try
        {
            var senderUserId = Context.UserIdentifier;

            if (senderUserId == receiverUserId)
            {
                return;
            }

            var chatSession = await _context.ChatSessions
                .Where(cs => cs.ChatSessionUsers.Any(csu => csu.UserId == senderUserId)
                        && cs.ChatSessionUsers.Any(csu => csu.UserId == receiverUserId))
                .FirstOrDefaultAsync();

            if (chatSession == null)
            {
                chatSession = new ChatSession { SessionId = Guid.NewGuid(), StartedAt = DateTime.UtcNow };
                await _context.ChatSessions.AddAsync(chatSession);

                // Add new users to the chat session
                await _context.ChatSessionUsers.AddAsync(new ChatSessionUser { SessionId = chatSession.SessionId, UserId = senderUserId, JoinedAt = DateTime.UtcNow });
                await _context.ChatSessionUsers.AddAsync(new ChatSessionUser { SessionId = chatSession.SessionId, UserId = receiverUserId, JoinedAt = DateTime.UtcNow });
            }
            else
            {
                await Clients.User(receiverUserId).SendAsync("ReceiveChatRequest", chatSession.SessionId, senderUserId, senderUserName);

                // Update existing users in the chat session
                var senderChatSessionUser = await _context.ChatSessionUsers.FindAsync(chatSession.SessionId, senderUserId);
                var receiverChatSessionUser = await _context.ChatSessionUsers.FindAsync(chatSession.SessionId, receiverUserId);

                if (senderChatSessionUser != null)
                {
                    senderChatSessionUser.LastOnline = DateTime.UtcNow;
                    _context.ChatSessionUsers.Update(senderChatSessionUser);
                }

                if (receiverChatSessionUser != null)
                {
                    receiverChatSessionUser.LastOnline = DateTime.UtcNow;
                    _context.ChatSessionUsers.Update(receiverChatSessionUser);
                }
            }

            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
    }


    public async Task SendMessageToGroup(string groupName, string message)
    {
        await Clients.Group(groupName).SendAsync("ReceiveGroupMessage", message);
    }

    public async Task AddToGroup(string groupName)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
    }

    public async Task RemoveFromGroup(string groupName)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
    }
}