using System.ComponentModel.DataAnnotations;

namespace AceBookApp.Models
{
    public class Notification
    {
        public int NotificationId { get; set; }

        public string NotifiedBy { get; set; }

        public string NotifiedTo { get; set;}

        public string NotiType { get; set;}

        public string? PostId { get; set;}

        public string NotiStatus { get; set;}

    }
}
