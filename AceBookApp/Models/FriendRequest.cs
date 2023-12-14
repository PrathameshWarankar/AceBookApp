using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace AceBookApp.Models
{
    public class FriendRequest
    {
        [Key]
        public string RequestID { get; set; }

        public string FromRequest { get; set; }

        public string ToRequest { get; set; }

        public DateTime SentDate { get; set; }
    }
}
