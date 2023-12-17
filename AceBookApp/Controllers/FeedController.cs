using AceBookApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace AceBookApp.Controllers
{
    public class FeedController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IHostEnvironment _host;
        public static FriendRequest frData = new FriendRequest();
        static string fullname;
        static string profileImage;

        public FeedController(AppDbContext context, IHostEnvironment host)
        {
            _context = context;
            _host = host;
        }

        public IActionResult FeedData()
        {
            //var query = from post in _context.Posts
            //            orderby post.Date descending
            //            select post.Imagepath;
            var query = from post in _context.Posts
                        orderby post.Date descending
                        select post;

            //string[] imageFiles = query.ToArray();
            Post[] posts = query.ToArray();

            List<string> names = new List<string>();
            List<string> emails = new List<string>();
            List<string> feedPostProfileUrl = new List<string>();
            List<int> postLikeCount = new List<int>();
            foreach (var post in posts)
            {
                var query2 = from acc in _context.Accounts
                             where acc.Email == post.Email
                             select acc;
                //select acc.FirstName + " " + acc.Surname;

                //var query3 = from acc in _context.Accounts
                //             where acc.Email != post.Email
                //             select acc.ProfileImagePath;

                postLikeCount.Add(post.Likes);
                names.Add(query2.First().FirstName + " " + query2.First().Surname);
                emails.Add(query2.First().Email);
                feedPostProfileUrl.Add(query2.First().ProfileImagePath);
            }

            var likedByMe = from likes in _context.Likes
                            where likes.LikedBy == HomeController.postData.Email
                            select likes.PostId;

            ViewBag.LikedByMe = likedByMe.ToArray();

            //ViewBag.ImageFiles = imageFiles;
            ViewBag.Names = names;
            ViewBag.Posts = posts;
            ViewBag.PostEmails = emails;
            ViewBag.FeedPostProfileUrl = feedPostProfileUrl;
            ViewBag.PostLikeCount = postLikeCount;

            ViewBag.Email = HomeController.postData.Email;

            var query1 = from account in _context.Accounts
                         where account.Email == HomeController.postData.Email
                         select account;
            ViewBag.Firstname = query1.First().FirstName;
            ViewBag.Lastname = query1.First().Surname;
            ViewBag.Fullname = query1.First().FirstName + " " + query1.First().Surname;
            fullname = query1.First().FirstName + " " + query1.First().Surname;
            ViewBag.ProfileUrl = query1.First().ProfileImagePath;
            profileImage = query1.First().ProfileImagePath;
            ViewData["Host"] = Request.Host;

            ViewBag.FriendReqList = FriendReqList();
            return View();
        }

        [HttpPost]
        public IActionResult FeedData(Post p, IFormFile imgfile)
        {

            Post post = new Post();
            string path = ImgPath(imgfile);

            if (path.Equals("-1"))
            {
                return RedirectToAction("Failure", "Home");
            }
            else
            {
                post.Email = HomeController.postData.Email;
                Random r = new Random();
                post.PostId = HomeController.postData.PostId + r.Next();
                post.Caption = p.Caption;
                post.Likes = 0;
                post.Imagepath = path;
                post.Date = DateTime.Now;

                _context.Posts.Add(post);
                _context.SaveChanges();
                return RedirectToAction("FeedData", "Feed");
            }

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
                        path = Path.Combine(_host.ContentRootPath + "PostContent\\Uploads\\" + HomeController.postData.Email + "\\Posts", random + Path.GetFileName(file.FileName));
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

        [HttpPost]
        public IActionResult SearchBy(string name)
        {
            var result = _context.Accounts.Where(x => (x.FirstName.StartsWith(name) || x.Surname.StartsWith(name))).ToList();
            return Json(result);
        }

        [Route("Feed/Profile/{email}")]
        public IActionResult Profile(string email)
        {
            frData.ToRequest = email;
            ViewData["Email"] = email;
            return View();
        }

        public List<SelectListItem> FriendReqList()
        {
            List<SelectListItem> ReqList = new List<SelectListItem>();

            var query = from item in _context.FriendRequests
                        where item.ToRequest == HomeController.postData.Email
                        select item.FromRequest;

            foreach (var item in query.ToList())
            {
                ReqList.Add(new SelectListItem { Text = item.ToString() });
            }

            return ReqList;
        }

        public ActionResult Liked(string id)
        {
            Like like = new Like();

            //_context.SaveChanges();

            Post p = (from post in _context.Posts
                      where post.PostId == id
                      select post).First();

            var isLike = _context.Likes.Where(_ => (_.LikedBy == HomeController.postData.Email && _.PostId == id));
            var isNoti = _context.Notifications.Where(_ => (_.NotifiedBy == HomeController.postData.Email && _.PostId == id && _.NotiType == "Like"));

            if (!isLike.Any())
            {
                p.Likes += 1;
                like.PostId = id;
                like.LikedBy = HomeController.postData.Email;
                like.LikedByName = fullname;
                _context.Likes.Add(like);

                Notification noti = new Notification();
                if (p.Email != HomeController.postData.Email)
                {
                    noti.NotifiedBy = HomeController.postData.Email;
                    noti.NotifiedTo = p.Email;
                    noti.NotiType = "Like";
                    noti.PostId = id;
                    noti.NotiStatus = "Unread";
                    _context.Notifications.Add(noti);
                }
            }
            else
            {
                p.Likes -= 1;
                _context.Likes.Remove(isLike.First());
                _context.Notifications.Remove(isNoti.First());
            }

            _context.SaveChanges();

            return new EmptyResult();
        }

        public IActionResult GetLikesBy(string id)
        {
            //var result = _context.Accounts.Where(x => (x.FirstName.StartsWith(name) || x.Surname.StartsWith(name))).ToList();
            var result = _context.Likes.Where(x => x.PostId == id).ToList();
            return Json(result);
        }

        public ActionResult Commented(string id, string text)
        {
            Comment comment = new Comment();

            Post p = (from post in _context.Posts
                      where post.PostId == id
                      select post).First();

            p.Comments += 1;
            comment.PostId = id;
            comment.CommentedText = text;
            comment.CommentedBy = HomeController.postData.Email;
            comment.CommentedByName = fullname;
            comment.CommentedDate = DateTime.Now;
            comment.CommentedByImagepath = profileImage.Substring(64);
            _context.Comments.Add(comment);

            Notification noti = new Notification();

            if (p.Email != HomeController.postData.Email)
            {
                noti.NotifiedBy = HomeController.postData.Email;
                noti.NotifiedTo = p.Email;
                noti.NotiType = "Comment";
                noti.PostId = id;
                noti.NotiStatus = "Unread";
                _context.Notifications.Add(noti);
            }

            _context.SaveChanges();
            return Json("success");
        }

        public IActionResult GetCommentsBy(string id)
        {
            //var result = _context.Accounts.Where(x => (x.FirstName.StartsWith(name) || x.Surname.StartsWith(name))).ToList();
            //var result1 = _context.Comments.Where(x => x.PostId == id).ToList();

            var result = (from cmt in _context.Comments
                          where cmt.PostId == id
                          orderby cmt.CommentedDate descending
                          select cmt).ToList();

            return Json(result);
        }

        public IActionResult GetContacts()
        {
            var result = (from acc in _context.Friends
                          where acc.ToRequest == HomeController.postData.Email
                          select acc.FromRequest).ToList();

            var result1 = (from acc in _context.Friends
                           where acc.FromRequest == HomeController.postData.Email
                           select acc.ToRequest).ToList();

            result.AddRange(result1);

            return Json(result);
        }

        public IActionResult GetMyNotifications()
        {
            var result = from noti in _context.Notifications
                         where noti.NotifiedTo == HomeController.postData.Email
                         orderby noti descending
                         select noti;

            return Json(result);
        }

        public IActionResult UpdateNotificatioStatus(string type, string id)
        {
            if (type == "Add Friend")
            {
                _context.Notifications
                    .Where(noti => noti.NotiType == type && noti.NotifiedBy == id && noti.NotifiedTo == HomeController.postData.Email)
                    .ToList()
                    .ForEach(entry => entry.NotiStatus = "Read");
            }
            else
            {
                _context.Notifications
                    .Where(noti => noti.NotiType == type && noti.PostId == id && noti.NotifiedTo == HomeController.postData.Email)
                    .ToList()
                    .ForEach(entry => entry.NotiStatus = "Read");
            }

            //result.NotiStatus = "Read";

            _context.SaveChanges();

            return new EmptyResult();

        }
    }
}