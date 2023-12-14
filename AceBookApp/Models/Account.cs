using Microsoft.AspNetCore.Mvc.Rendering;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AceBookApp.Models
{
    public class Account
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string Surname { get; set; }

        [Required]
        [Key]
        [RegularExpression(@"^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$")]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string DOBDate { get; set; }

        [Required]
        public string DOBMon { get; set; }

        [Required]
        public string DOBYear { get; set; }

        [Required]
        public string Gender { get; set; }

        [NotMapped]
        public List<SelectListItem>? DateList { get; set; }

        [NotMapped]
        public List<SelectListItem>? MonthList { get; set; }

        [NotMapped]
        public List<SelectListItem>? YearList { get; set; }

        [DataType(DataType.ImageUrl)]
        public string? ProfileImagePath { get; set; }

        [DataType(DataType.ImageUrl)]
        public string? CoverImagePath { get; set; }

        public string Status { get; set; }
    }
}
