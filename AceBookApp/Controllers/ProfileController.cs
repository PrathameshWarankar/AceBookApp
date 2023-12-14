using AceBookApp.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Cryptography.X509Certificates;
using System.Xml.Linq;

namespace AceBookApp.Controllers
{
    public class ProfileController: Controller
    {
        private readonly AppDbContext _context;
        private readonly IHostEnvironment _host;

        public ProfileController(AppDbContext context, IHostEnvironment host)
        {
            _context = context;
            _host = host;
        }

        public static FriendRequest frData = new FriendRequest();

        public IActionResult SendRequest(string toRequest, string fromRequest)
        {
            if (ModelState.IsValid)
            {
                FriendRequest fr = new FriendRequest();

                var query1 = from entry in _context.FriendRequests
                             where entry.FromRequest == fromRequest && entry.ToRequest == toRequest
                             select entry;

                var isNoti = _context.Notifications.Where(_ => (_.NotifiedBy == HomeController.postData.Email && _.NotiType == "Add Friend"));

                if (query1.Any())
                {
                    _context.FriendRequests.Remove(query1.SingleOrDefault());
                    _context.Notifications.Remove(isNoti.First());

                    _context.SaveChanges();
                    return new EmptyResult();
                }
                
                fr.FromRequest = fromRequest;
                fr.ToRequest = toRequest;
                fr.SentDate = DateTime.Now;

                var query = from entry in _context.FriendRequests
                            orderby entry.SentDate descending
                            select entry;

                if (query == null || query.Count() == 0)
                {
                    fr.RequestID = string.Concat("Req1 - ", fr.FromRequest.AsSpan(0, 3), fr.ToRequest.AsSpan(0, 3));
                }
                else
                {
                    var res = query.First().RequestID.ToString();
                    fr.RequestID = "Req" + Convert.ToString(Convert.ToInt32(res.Substring(3, 1)) + 1) + " - " + fr.FromRequest.Substring(0,3) + fr.ToRequest.Substring(0,3);
                }

                _context.FriendRequests.Add(fr);

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
            {
                return RedirectToAction("Failure", "Home");
            }

        }

        public string IsReqSent(string toRequest)
        {
            var query = from entry in _context.FriendRequests
                        where entry.FromRequest == HomeController.postData.Email && entry.ToRequest == toRequest
                        select entry;

            if (query.Any())
            {
                return "Yes";
            }
            else
            {
                return "No";
            }
        }

        public string IsFriend(string toRequest)
        {
            var query = from entry in _context.Friends
                        where (entry.FromRequest == HomeController.postData.Email && entry.ToRequest == toRequest) || (entry.ToRequest == HomeController.postData.Email && entry.FromRequest == toRequest)
                        select entry;

            if (query.Any())
            {
                return "Yes";
            }
            else
            {
                return "No";
            }
        }

        public IActionResult AddFriend(string toRequest, string fromRequest)
        {
            Friend fr = new Friend();

            fr.FromRequest = fromRequest;
            fr.ToRequest = toRequest;
            fr.SentDate = DateTime.Now;

            var query = from entry in _context.Friends
                        orderby entry.SentDate descending
                        select entry;

            if (query == null || query.Count() == 0)
            {
                fr.RequestID = string.Concat("FrndID1 - ", fr.FromRequest.AsSpan(0, 3), fr.ToRequest.AsSpan(0, 3));
            }
            else
            {
                var res = query.First().RequestID.ToString();
                fr.RequestID = "FrndID" + Convert.ToString(Convert.ToInt32(res.Substring(6, 1)) + 1) + " - " + fr.FromRequest.Substring(0, 3) + fr.ToRequest.Substring(0, 3);
            }

            _context.Friends.Add(fr);

            _context.SaveChanges();
            return new EmptyResult();
        }

        public IActionResult ProfileData(string email)
        {
            //frData.ToRequest = email;
            //ViewData["Email"] = email;
            return View();
        }

        public IActionResult GetProfileDetails(string email)
        {
            if (email == null)
            {
                var result = _context.Accounts.Where(x => x.Email == HomeController.postData.Email);
                return Json(result);
            }
            else
            {
                var result = _context.Accounts.Where(x => x.Email == email);
                return Json(result);
            }
        }

        public IActionResult GetMyProfileDetails()
        {
            var result = _context.Accounts.Where(x => x.Email == HomeController.postData.Email);
            return Json(result);
        }

        public IActionResult AddAdditionalDetails(string i1, string i2, string i3)
        {
            AdditionAccountDetail details = new AdditionAccountDetail();
            var isEntry = _context.additionAccountDetails.Where(x => x.Loggedemail == HomeController.postData.Email);

            if(!isEntry.Any())
            {
                details.Loggedemail = HomeController.postData.Email;
                details.WorkInfo1 = i1;
                details.WorkInfo2 = i2;
                details.WorkInfo3 = i3;
                _context.additionAccountDetails.Add(details);
            }
            else
            {
                isEntry.First().WorkInfo1= i1;
                isEntry.First().WorkInfo2= i2;
                isEntry.First().WorkInfo3= i3;
            }

            _context.SaveChanges();
            return new EmptyResult();

        }

        public IActionResult AddAdditionalDetailsNew(string type, string i1)
        {
            AdditionAccountDetail details = new AdditionAccountDetail();
            if(type == "College")
            {
                var isEntry = _context.additionAccountDetails.Where(x => x.Loggedemail == HomeController.postData.Email);
                if(!isEntry.Any())
                {
                    details.Loggedemail = HomeController.postData.Email;
                    details.CollegeInfo = i1;
                    _context.additionAccountDetails.Add(details);
                }
                else
                {
                    isEntry.First().CollegeInfo = i1;
                }

                _context.SaveChanges();
                return new EmptyResult();
            }

            if (type == "School")
            {
                var isEntry = _context.additionAccountDetails.Where(x => x.Loggedemail == HomeController.postData.Email);
                if (!isEntry.Any())
                {
                    details.Loggedemail = HomeController.postData.Email;
                    details.SchoolInfo = i1;
                    _context.additionAccountDetails.Add(details);
                }
                else
                {
                    isEntry.First().SchoolInfo = i1;
                }

                _context.SaveChanges();
                return new EmptyResult();
            }

            if (type == "City")
            {
                var isEntry = _context.additionAccountDetails.Where(x => x.Loggedemail == HomeController.postData.Email);
                if (!isEntry.Any())
                {
                    details.Loggedemail = HomeController.postData.Email;
                    details.PlaceInfo = i1;
                    _context.additionAccountDetails.Add(details);
                }
                else
                {
                    isEntry.First().PlaceInfo = i1;
                }

                _context.SaveChanges();
                return new EmptyResult();
            }

            if (type == "Contact")
            {
                var isEntry = _context.additionAccountDetails.Where(x => x.Loggedemail == HomeController.postData.Email);
                if (!isEntry.Any())
                {
                    details.Loggedemail = HomeController.postData.Email;
                    details.PhoneInfo = i1;
                    _context.additionAccountDetails.Add(details);
                }
                else
                {
                    isEntry.First().PhoneInfo = i1;
                }

                _context.SaveChanges();
                return new EmptyResult();
            }

            if (type == "Website")
            {
                var isEntry = _context.additionAccountDetails.Where(x => x.Loggedemail == HomeController.postData.Email);
                if (!isEntry.Any())
                {
                    details.Loggedemail = HomeController.postData.Email;
                    details.SocialAccInfo = i1;
                    _context.additionAccountDetails.Add(details);
                }
                else
                {
                    isEntry.First().SocialAccInfo = i1;
                }

                _context.SaveChanges();
                return new EmptyResult();
            }
            return new EmptyResult();
        }

        public IActionResult GetAdditionalDetails (string email) 
        {
            if (email == null)
            {
                var result = _context.additionAccountDetails.Where(x => x.Loggedemail == HomeController.postData.Email);
                return Json(result);
            }
            else
            {
                var result = _context.additionAccountDetails.Where(x => x.Loggedemail == email);
                return Json(result);
            }
        }

        public IActionResult Friends(string email)
        {
            return View();
        }

        public IActionResult GetFriendReq(string email)
        {
            var query = from req in _context.FriendRequests
                        where req.ToRequest == email
                        orderby req.SentDate descending
                        select req;
            return Json(query);
        }

        public IActionResult DeleteReq(string fromRequest, string toRequest)
        {
            var query = from req in _context.FriendRequests
                        where req.FromRequest == fromRequest && req.ToRequest == toRequest
                        select req;

            _context.FriendRequests.Remove(query.SingleOrDefault());
            _context.SaveChanges();

            return new EmptyResult();
        }

        public IActionResult GetFriendList(string email)
        {
            var query = from req in _context.Friends
                        where req.ToRequest == email || req.FromRequest == email
                        orderby req.SentDate descending
                        select req;
            return Json(query);
        }

        public IActionResult GetPhotosList(string email)
        {
            var query = from req in _context.Posts
                        where req.Email == email
                        select req;
            return Json(query);
        }

        public IActionResult GetPostsList(string email)
        {
            var result = from post in _context.Posts
                         where post.Email == email
                         select post;

            return Json(result);
        }

        public IActionResult GetPostsLikedByMe()
        {
            var result = from like in _context.Likes
                          where like.LikedBy == HomeController.postData.Email
                          select like.PostId;
           
            return Json(result);
        }

        public IActionResult profileImgUpload(IFormFile profileImg)
        {
            var account = (from acc in _context.Accounts
                          where acc.Email == HomeController.postData.Email
                          select acc).First();

            string path = ImgPath(profileImg);
            account.ProfileImagePath = path;

            _context.SaveChanges();

            return RedirectToAction("ProfileData", "Profile", new { email = HomeController.postData.Email});
        }

        public IActionResult coverImgUpload(IFormFile coverImg)
        {
            var account = (from acc in _context.Accounts
                           where acc.Email == HomeController.postData.Email
                           select acc).First();

            string path = ImgPath(coverImg);
            account.CoverImagePath = path;

            _context.SaveChanges();

            return RedirectToAction("ProfileData", "Profile", new { email = HomeController.postData.Email });
        }

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
                        path = Path.Combine(_host.ContentRootPath + "PostContent\\Uploads\\" + HomeController.postData.Email + "\\ProfileCoverImg", random + Path.GetFileName(file.FileName));
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

        public IActionResult Settings(string email)
        {
            var account = (from acc in _context.Accounts
                          where acc.Email == HomeController.postData.Email
                          select acc).First();

            return View(account);
        }

        public IActionResult EditAccountDetails(string type, string value1, string value2)
        {
            Account account = new Account();

            var myAcc = (from acc in _context.Accounts
                        where acc.Email == HomeController.postData.Email
                        select acc).First();

            if(type == "name")
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
                                where addAcc.Loggedemail == HomeController.postData.Email
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
                    .Where(x => x.CommentedBy == HomeController.postData.Email)
                    .ToList()
                    .ForEach(a => a.CommentedBy = value1);

                _context.FriendRequests
                    .Where(x => x.FromRequest == HomeController.postData.Email)
                    .ToList()
                    .ForEach(a => a.FromRequest = value1);

                _context.FriendRequests
                    .Where(x => x.ToRequest == HomeController.postData.Email)
                    .ToList()
                    .ForEach(a => a.ToRequest = value1);

                _context.Friends
                    .Where(x => x.FromRequest == HomeController.postData.Email)
                    .ToList()
                    .ForEach(a => a.FromRequest = value1);

                _context.Friends
                    .Where(x => x.ToRequest == HomeController.postData.Email)
                    .ToList()
                    .ForEach(a => a.ToRequest = value1);

                _context.Likes
                    .Where(x => x.LikedBy == HomeController.postData.Email)
                    .ToList()
                    .ForEach(a => a.LikedBy = value1);

                _context.Posts
                    .Where(x => x.Email == HomeController.postData.Email)
                    .ToList()
                    .ForEach(a => a.Email = value1);

                HomeController.postData.Email = value1;
            }

            _context.SaveChanges();

            return new EmptyResult();
        }

        public string UpdatePassword (string currPass, string newPass)
        {
            var myAcc = (from acc in _context.Accounts
                         where acc.Email == HomeController.postData.Email
                         select acc).First();

            if(myAcc.Password != currPass)
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

        public void Logout()
        {
            var account = (from acc in _context.Accounts
                           where acc.Email == HomeController.postData.Email
                           select acc).First();

            account.Status = "Offline";
            _context.SaveChanges();
        }

    }
}
