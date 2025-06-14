using System.ComponentModel.DataAnnotations;

namespace AceBookApp.Models
{
    public class Post
    {
        public string Email { get; set; }

        public string PostId { get; set; }

        public string Caption { get; set; }

        public int Likes { get; set; }

        public int Comments { get; set; }

        [DataType(DataType.ImageUrl)]
        public string Imagepath { get; set; }

        public DateTime Date { get; set; }
    }
}
