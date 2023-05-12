using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

[Authorize]
public class ChatHub : Hub
{
    public async Task SendMessageToUser(string userId, string message)
    {
        try
        {
            var currentUserId = Context.UserIdentifier;

            if (currentUserId == userId)
            {
                return;
            }
            var getUser = Clients.User(userId);
            await Clients.User(userId).SendAsync("ReceiveMessage", message);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
        
    }

    public async Task SendChatRequest(string userId)
    {
        try
        {
            var currentUserId = Context.UserIdentifier;

            if (currentUserId == userId)
            {
                return;
            }

            await Clients.User(userId).SendAsync("ReceiveChatRequest", currentUserId);
        }
        catch(Exception ex)
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