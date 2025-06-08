namespace AceBookApp.Controllers
{
    public static class DateOfBirthController
    {
        //populates the dates in create account page
        public static List<string> GetAllDate()
        {
            List<string> date = new List<string>();
            for (int i = 1; i <= 31; i++)
            {
                date.Add(i.ToString());
            }

            return date;
        }

        //populates the months in create account page
        public static List<string> GetAllMonth()
        {
            List<string> month = new List<string>
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

            return month;
        }

        //populates the years in create account page
        public static List<string> GetAllYear()
        {
            List<string> year = new List<string>();
            for (int i = 1990; i <= DateTime.Now.Year; i++)
            {
                year.Add(i.ToString());
            }

            return year;
        }
    }
}
