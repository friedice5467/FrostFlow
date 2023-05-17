using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Globalization;

[Authorize]
public class ChatHub : Hub
{
    public async Task SendMessageToUser(string receiverUserId, string senderUserName, string message)
    {
        try
        {
            var senderUserId = Context.UserIdentifier;

            if (senderUserId == receiverUserId)
            {
                return;
            }

            var currentTime = DateTime.Now.ToString("s", CultureInfo.InvariantCulture);

            await Clients.User(receiverUserId).SendAsync("ReceiveMessage", senderUserId, message, senderUserName, currentTime);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
    }

    public async Task SendChatRequest(string recieverUserId, string senderUserName)
    {
        try
        {
            var currentUserId = Context.UserIdentifier;

            if (currentUserId == recieverUserId)
            {
                return;
            }

            await Clients.User(recieverUserId).SendAsync("ReceiveChatRequest", currentUserId, senderUserName);
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