using System.ComponentModel.DataAnnotations;

namespace AceBookApp.Models
{
    public class AdditionAccountDetail
    {
        [Key]
        public string Loggedemail { get; set; }
        public string? WorkInfo1 { get; set; }
        public string? WorkInfo2 { get; set; }
        public string? WorkInfo3 { get; set; }
        public string? CollegeInfo { get; set; }
        public string? SchoolInfo { get; set; }
        public string? PlaceInfo { get; set; }
        public string? PhoneInfo { get; set; }
        public string? SocialAccInfo { get; set; }
        public string? FamilyMemberInfo { get; set; }
    }
}
