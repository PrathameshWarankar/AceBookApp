using System.ComponentModel.DataAnnotations;

namespace AceBookApp.Models
{
    public class Comment
    {
        public int CommentId { get; set; }

        public string PostId { get; set; }

        public string CommentedBy { get; set; }

        public string CommentedByName { get; set; }

        public string CommentedText { get; set; }

        public DateTime CommentedDate { get; set; }

        [DataType(DataType.ImageUrl)]
        public string CommentedByImagepath { get; set; }
    }
}
