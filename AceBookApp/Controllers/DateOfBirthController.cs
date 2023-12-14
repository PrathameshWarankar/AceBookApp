namespace AceBookApp.Controllers
{
    public static class DateOfBirthController
    {
        public static List<string> GetAllDate()
        {
            List<string> Date = new List<string>();
            for (int i = 1; i <= 31; i++)
            {
                Date.Add(i.ToString());
            }

            return Date;
        }

        public static List<string> GetAllMonth()
        {
            List<string> Month = new List<string>
            {
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            };

            return Month;
        }

        public static List<string> GetAllYear()
        {
            List<string> Year = new List<string>();
            for (int i = 1990; i <= DateTime.Now.Year; i++)
            {
                Year.Add(i.ToString());
            }

            return Year;
        }
    }
}
