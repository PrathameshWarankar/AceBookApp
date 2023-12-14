namespace AceBookApp.Models
{
    public class Like
    {
        public int LikeId { get; set; }
        public string PostId { get; set; }

        public string LikedBy { get; set; }

        public string LikedByName { get; set; }
    }
}
