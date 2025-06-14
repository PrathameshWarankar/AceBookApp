using AceBookApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

namespace AceBookApp.Controllers
{
    public class ProfileController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IHostEnvironment _host;

        //initializes AppDbContext
        public ProfileController(AppDbContext context, IHostEnvironment host)
        {
            _context = context;
            _host = host;
        }

        public static FriendRequest frData = new FriendRequest();

        //method to send/delete friend request
        public IActionResult SendRequest(string toRequest, string fromRequest)
        {
            if (ModelState.IsValid)
            {
                FriendRequest fr = new FriendRequest();

                //query to check if friend req already exists
                var existingReqCheckQuery = from entry in _context.FriendRequests
                                            where entry.FromRequest == fromRequest && entry.ToRequest == toRequest
                                            select entry;

                var isNoti = _context.Notifications.Where(_ => (_.NotifiedBy == HomeController.loggedUser.Email && _.NotiType == "Add Friend"));

                //if friend req already exists, delete the req
                if (existingReqCheckQuery.Any())
                {
                    _context.FriendRequests.Remove(existingReqCheckQuery.SingleOrDefault());
                    _context.Notifications.Remove(isNoti.First());

                    _context.SaveChanges();
                    return new EmptyResult();
                }

                fr.FromRequest = fromRequest;
                fr.ToRequest = toRequest;
                fr.SentDate = DateTime.Now;

                var frndReqListQuery = from entry in _context.FriendRequests
                                       orderby entry.SentDate descending
                                       select entry;

                //create request id for first entry
                if (frndReqListQuery == null || frndReqListQuery.Count() == 0)
                    fr.RequestID = string.Concat("Req1 - ", fr.FromRequest.AsSpan(0, 3), fr.ToRequest.AsSpan(0, 3));

                //create request id for subsequent entry
                else
                {
                    var res = frndReqListQuery.First().RequestID.ToString();
                    fr.RequestID = "Req" + Convert.ToString(Convert.ToInt32(res.Substring(3, 1)) + 1) + " - " + fr.FromRequest.Substring(0, 3) + fr.ToRequest.Substring(0, 3);
                }

                //add request to friend request
                _context.FriendRequests.Add(fr);

                //add notification
                Notification noti = new Notification();
                noti.NotifiedBy = fromRequest;
                noti.NotifiedTo = toRequest;
                noti.NotiType = "Add Friend";
                noti.PostId = null;
                noti.NotiStatus = "Unread";
                _context.Notifications.Add(noti);

                _context.SaveChanges();
                return new EmptyResult();
            }
            else
                return RedirectToAction("Failure", "Home");
        }

        //confirm if request sent, used to update the view
        public string IsReqSent(string toRequest)
        {
            var reqCheckQuery = from entry in _context.FriendRequests
                                where entry.FromRequest == HomeController.loggedUser.Email && entry.ToRequest == toRequest
                                select entry;

            if (reqCheckQuery.Any())
                return "Yes";
            else
                return "No";
        }

        //confirm if friend, used to update the view
        public string IsFriend(string toRequest)
        {
            var frndCheckQuery = from entry in _context.Friends
                                 where (entry.FromRequest == HomeController.loggedUser.Email && entry.ToRequest == toRequest) || (entry.ToRequest == HomeController.loggedUser.Email && entry.FromRequest == toRequest)
                                 select entry;

            if (frndCheckQuery.Any())
                return "Yes";
            else
                return "No";
        }

        //method executed when friend req accepted
        public IActionResult AddFriend(string toRequest, string fromRequest)
        {
            Friend fr = new Friend();

            fr.FromRequest = fromRequest;
            fr.ToRequest = toRequest;
            fr.SentDate = DateTime.Now;

            var frndListQuery = from entry in _context.Friends
                                orderby entry.SentDate descending
                                select entry;

            //create friend id for first entry
            if (frndListQuery == null || frndListQuery.Count() == 0)
                fr.RequestID = string.Concat("FrndID1 - ", fr.FromRequest.AsSpan(0, 3), fr.ToRequest.AsSpan(0, 3));

            //create friend id for subsequent entry
            else
            {
                var res = frndListQuery.First().RequestID.ToString();
                fr.RequestID = "FrndID" + Convert.ToString(Convert.ToInt32(res.Substring(6, 1)) + 1) + " - " + fr.FromRequest.Substring(0, 3) + fr.ToRequest.Substring(0, 3);
            }

            _context.Friends.Add(fr);

            _context.SaveChanges();
            return new EmptyResult();
        }

        //returns view of profile
        public IActionResult ProfileData(string email)
        {
            return View();
        }

        //method to fetch account details of user
        public IActionResult GetProfileDetails(string email)
        {
            if (email == null)
            {
                var myAccDetailsQuery = _context.Accounts.Where(x => x.Email == HomeController.loggedUser.Email);
                return Json(myAccDetailsQuery);
            }
            else
            {
                var accDetailsQuery = _context.Accounts.Where(x => x.Email == email);
                return Json(accDetailsQuery);
            }
        }

        //method to get logged user's account details
        /*public IActionResult GetMyProfileDetails()
        {
            var myAccDetailsQuery = _context.Accounts.Where(x => x.Email == HomeController.loggedUser.Email);
            return Json(myAccDetailsQuery);
        }*/

        //method to additional account's work details in database
        public IActionResult AddAdditionalDetails(string i1, string i2, string i3)
        {
            AdditionAccountDetail details = new AdditionAccountDetail();
            var isEntry = _context.additionAccountDetails.Where(x => x.Loggedemail == HomeController.loggedUser.Email);

            //if details do not exists previously
            if (!isEntry.Any())
            {
                details.Loggedemail = HomeController.loggedUser.Email;
                details.WorkInfo1 = i1;
                details.WorkInfo2 = i2;
                details.WorkInfo3 = i3;
                _context.additionAccountDetails.Add(details);
            }
            //if details exists previously
            else
            {
                isEntry.First().WorkInfo1 = i1;
                isEntry.First().WorkInfo2 = i2;
                isEntry.First().WorkInfo3 = i3;
            }

            _context.SaveChanges();
            return new EmptyResult();
        }

        //method to additional account's non work details in database
        public IActionResult AddAdditionalDetailsNew(string type, string i1)
        {
            AdditionAccountDetail details = new AdditionAccountDetail();
            if (type == "College")
            {
                var isEntry = _context.additionAccountDetails.Where(x => x.Loggedemail == HomeController.loggedUser.Email);

                //if college details do not exists previously
                if (!isEntry.Any())
                {
                    details.Loggedemail = HomeController.loggedUser.Email;
                    details.CollegeInfo = i1;
                    _context.additionAccountDetails.Add(details);
                }

                //if college details exists previously
                else
                    isEntry.First().CollegeInfo = i1;

                _context.SaveChanges();
                return new EmptyResult();
            }

            if (type == "School")
            {
                var isEntry = _context.additionAccountDetails.Where(x => x.Loggedemail == HomeController.loggedUser.Email);

                //if school details do not exists previously
                if (!isEntry.Any())
                {
                    details.Loggedemail = HomeController.loggedUser.Email;
                    details.SchoolInfo = i1;
                    _context.additionAccountDetails.Add(details);
                }

                //if school details exists previously
                else
                    isEntry.First().SchoolInfo = i1;

                _context.SaveChanges();
                return new EmptyResult();
            }

            if (type == "City")
            {
                var isEntry = _context.additionAccountDetails.Where(x => x.Loggedemail == HomeController.loggedUser.Email);

                //if city details do not exists previously
                if (!isEntry.Any())
                {
                    details.Loggedemail = HomeController.loggedUser.Email;
                    details.PlaceInfo = i1;
                    _context.additionAccountDetails.Add(details);
                }

                //if city details exists previously
                else
                    isEntry.First().PlaceInfo = i1;

                _context.SaveChanges();
                return new EmptyResult();
            }

            if (type == "Contact")
            {
                var isEntry = _context.additionAccountDetails.Where(x => x.Loggedemail == HomeController.loggedUser.Email);

                //if contact details do not exists previously
                if (!isEntry.Any())
                {
                    details.Loggedemail = HomeController.loggedUser.Email;
                    details.PhoneInfo = i1;
                    _context.additionAccountDetails.Add(details);
                }

                //if contact details exists previously
                else
                    isEntry.First().PhoneInfo = i1;

                _context.SaveChanges();
                return new EmptyResult();
            }

            if (type == "Website")
            {
                var isEntry = _context.additionAccountDetails.Where(x => x.Loggedemail == HomeController.loggedUser.Email);

                //if website details do not exists previously
                if (!isEntry.Any())
                {
                    details.Loggedemail = HomeController.loggedUser.Email;
                    details.SocialAccInfo = i1;
                    _context.additionAccountDetails.Add(details);
                }

                //if website details exists previously
                else
                    isEntry.First().SocialAccInfo = i1;

                _context.SaveChanges();
                return new EmptyResult();
            }
            return new EmptyResult();
        }

        //method to fetch additional details of user from database
        public IActionResult GetAdditionalDetails(string email)
        {
            if (email == null)
            {
                var myDetailsQuery = _context.additionAccountDetails.Where(x => x.Loggedemail == HomeController.loggedUser.Email);
                return Json(myDetailsQuery);
            }
            else
            {
                var userDetailsQuery = _context.additionAccountDetails.Where(x => x.Loggedemail == email);
                return Json(userDetailsQuery);
            }
        }

        //returns friends page view
        public IActionResult Friends(string email)
        {
            return View();
        }

        //method to get list of friend requests received
        public IActionResult GetFriendReq(string email)
        {
            var query = from req in _context.FriendRequests
                        where req.ToRequest == email
                        orderby req.SentDate descending
                        select req;

            return Json(query);
        }

        //method to delete friend req
        public IActionResult DeleteReq(string fromRequest, string toRequest)
        {
            var reqQuery = from req in _context.FriendRequests
                           where req.FromRequest == fromRequest && req.ToRequest == toRequest
                           select req;

            _context.FriendRequests.Remove(reqQuery.SingleOrDefault());
            _context.SaveChanges();

            return new EmptyResult();
        }

        //method to get list of friend
        public IActionResult GetFriendList(string email)
        {
            var frndListQuery = from req in _context.Friends
                                where req.ToRequest == email || req.FromRequest == email
                                orderby req.SentDate descending
                                select req;

            return Json(frndListQuery);
        }

        //method to get all posts of particular user
        //public IActionResult GetPhotosList(string email)
        //{
        //    var postsQuery = from post in _context.Posts
        //                      where post.Email == email
        //                      select post;
        //   return Json(postsQuery);
        //}

        //method to get all posts of particular user
        public IActionResult GetPostsList(string email)
        {
            var postsQuery = from post in _context.Posts
                             where post.Email == email
                             select post;

            return Json(postsQuery);
        }

        //method to get posts like by logged user
        public IActionResult GetPostsLikedByMe()
        {
            var myLikedPostsQuery = from like in _context.Likes
                                    where like.LikedBy == HomeController.loggedUser.Email
                                    select like.PostId;

            return Json(myLikedPostsQuery);
        }

        //method to update profile photo of logged user
        public IActionResult ProfileImgUpload(IFormFile profileImg)
        {
            var account = (from acc in _context.Accounts
                           where acc.Email == HomeController.loggedUser.Email
                           select acc).First();

            string path = ImgPath(profileImg);
            account.ProfileImagePath = path;

            _context.SaveChanges();

            return RedirectToAction("ProfileData", "Profile", new { email = HomeController.loggedUser.Email });
        }

        //method to update cover photo of logged user
        public IActionResult CoverImgUpload(IFormFile coverImg)
        {
            var account = (from acc in _context.Accounts
                           where acc.Email == HomeController.loggedUser.Email
                           select acc).First();

            string path = ImgPath(coverImg);
            account.CoverImagePath = path;

            _context.SaveChanges();

            return RedirectToAction("ProfileData", "Profile", new { email = HomeController.loggedUser.Email });
        }

        //method to generate path of profile/cover photo
        public string ImgPath(IFormFile file)
        {
            Random r = new Random();
            string path = "-1";
            int random = r.Next();
            if (file != null && file.Length > 0)
            {
                string extension = Path.GetExtension(file.FileName);

                if (extension.ToLower().Equals(".jpg") || extension.ToLower().Equals(".jpeg") || extension.ToLower().Equals(".png") || extension.ToLower().Equals(".jfif"))
                {
                    try
                    {
                        path = Path.Combine(_host.ContentRootPath + "PostContent\\Uploads\\" + HomeController.loggedUser.Email + "\\ProfileCoverImg", random + Path.GetFileName(file.FileName));
                        Directory.CreateDirectory(Path.GetDirectoryName(path));
                        using (Stream fileStream = new FileStream(path, FileMode.Create, FileAccess.Write))
                        {
                            file.CopyTo(fileStream);
                        }
                    }
                    catch (Exception)
                    {
                        path = "-1";
                    }
                }
                else
                {
                    path = "-1";
                }
            }
            else
            {
                path = "-1";
            }

            return path;
        }

        //return settings page of logged user
        public IActionResult Settings(string email)
        {
            var account = (from acc in _context.Accounts
                           where acc.Email == HomeController.loggedUser.Email
                           select acc).First();

            return View(account);
        }

        //method to update account details
        public IActionResult EditAccountDetails(string type, string value1, string value2)
        {
            Account account = new Account();

            var myAcc = (from acc in _context.Accounts
                         where acc.Email == HomeController.loggedUser.Email
                         select acc).First();

            if (type == "name")
            {
                myAcc.FirstName = value1;
                myAcc.Surname = value2;
            }
            else if (type == "contact")
            {
                Account newAcc = new Account();
                newAcc.FirstName = myAcc.FirstName;
                newAcc.Surname = myAcc.Surname;
                newAcc.Password = myAcc.Password;
                newAcc.DOBDate = myAcc.DOBDate;
                newAcc.DOBMon = myAcc.DOBMon;
                newAcc.DOBYear = myAcc.DOBYear;
                newAcc.Gender = myAcc.Gender;
                newAcc.ProfileImagePath = myAcc.ProfileImagePath;
                newAcc.CoverImagePath = myAcc.CoverImagePath;
                newAcc.Email = value1;

                _context.Accounts.Remove(myAcc);
                _context.Accounts.Add(newAcc);

                var myAddAcc = (from addAcc in _context.additionAccountDetails
                                where addAcc.Loggedemail == HomeController.loggedUser.Email
                                select addAcc).First();

                AdditionAccountDetail newAddAcc = new AdditionAccountDetail();
                newAddAcc.WorkInfo1 = myAddAcc.WorkInfo1;
                newAddAcc.WorkInfo2 = myAddAcc.WorkInfo2;
                newAddAcc.WorkInfo3 = myAddAcc.WorkInfo3;
                newAddAcc.SchoolInfo = myAddAcc.SchoolInfo;
                newAddAcc.CollegeInfo = myAddAcc.CollegeInfo;
                newAddAcc.PlaceInfo = myAddAcc.PlaceInfo;
                newAddAcc.PhoneInfo = myAddAcc.PhoneInfo;
                newAddAcc.Loggedemail = value1;

                _context.additionAccountDetails.Remove(myAddAcc);
                _context.additionAccountDetails.Add(newAddAcc);

                _context.Comments
                    .Where(x => x.CommentedBy == HomeController.loggedUser.Email)
                    .ToList()
                    .ForEach(a => a.CommentedBy = value1);

                _context.FriendRequests
                    .Where(x => x.FromRequest == HomeController.loggedUser.Email)
                    .ToList()
                    .ForEach(a => a.FromRequest = value1);

                _context.FriendRequests
                    .Where(x => x.ToRequest == HomeController.loggedUser.Email)
                    .ToList()
                    .ForEach(a => a.ToRequest = value1);

                _context.Friends
                    .Where(x => x.FromRequest == HomeController.loggedUser.Email)
                    .ToList()
                    .ForEach(a => a.FromRequest = value1);

                _context.Friends
                    .Where(x => x.ToRequest == HomeController.loggedUser.Email)
                    .ToList()
                    .ForEach(a => a.ToRequest = value1);

                _context.Likes
                    .Where(x => x.LikedBy == HomeController.loggedUser.Email)
                    .ToList()
                    .ForEach(a => a.LikedBy = value1);

                _context.Posts
                    .Where(x => x.Email == HomeController.loggedUser.Email)
                    .ToList()
                    .ForEach(a => a.Email = value1);

                HomeController.loggedUser.Email = value1;
            }

            _context.SaveChanges();

            return new EmptyResult();
        }

        //method to update account password
        public string UpdatePassword(string currPass, string newPass)
        {
            var myAcc = (from acc in _context.Accounts
                         where acc.Email == HomeController.loggedUser.Email
                         select acc).First();

            if (myAcc.Password != currPass)
            {
                return "Wrong Password";
            }
            else
            {
                myAcc.Password = newPass;
                _context.SaveChanges();
                return "Success";
            }
        }

        //method to logout user
        public void Logout()
        {
            var account = (from acc in _context.Accounts
                           where acc.Email == HomeController.loggedUser.Email
                           select acc).First();

            account.Status = "Offline";
            _context.SaveChanges();
        }
    }
}
