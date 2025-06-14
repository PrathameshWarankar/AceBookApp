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

        //initializes AppDbContext
        public FeedController(AppDbContext context, IHostEnvironment host)
        {
            _context = context;
            _host = host;
        }

        //loads user's feed
        public IActionResult FeedData()
        {
            //return all the user posts present in database
            var allPostQuery = from post in _context.Posts
                               orderby post.Date descending
                               select post;

            Post[] posts = allPostQuery.ToArray();

            List<string> names = new List<string>();
            List<string> emails = new List<string>();
            List<string> feedPostProfileUrl = new List<string>();
            List<int> postLikeCount = new List<int>();

            foreach (var post in posts)
            {
                //fetch account details of post owners
                var postOwnerQuery = from acc in _context.Accounts
                                     where acc.Email == post.Email
                                     select acc;

                postLikeCount.Add(post.Likes);
                names.Add(postOwnerQuery.First().FirstName + " " + postOwnerQuery.First().Surname);
                emails.Add(postOwnerQuery.First().Email);
                feedPostProfileUrl.Add(postOwnerQuery.First().ProfileImagePath);
            }

            //get list of posts already liked by logged user
            var likedByMeQuery = from likes in _context.Likes
                                 where likes.LikedBy == HomeController.loggedUser.Email
                                 select likes.PostId;

            ViewBag.LikedByMe = likedByMeQuery.ToArray();

            ViewBag.Names = names;
            ViewBag.Posts = posts;
            ViewBag.PostEmails = emails;
            ViewBag.FeedPostProfileUrl = feedPostProfileUrl;
            ViewBag.PostLikeCount = postLikeCount;

            ViewBag.Email = HomeController.loggedUser.Email;

            //get account details of logged user
            var loggedAccountDetailsQuery = from account in _context.Accounts
                                            where account.Email == HomeController.loggedUser.Email
                                            select account;

            ViewBag.Firstname = loggedAccountDetailsQuery.First().FirstName;
            ViewBag.Lastname = loggedAccountDetailsQuery.First().Surname;
            ViewBag.Fullname = loggedAccountDetailsQuery.First().FirstName + " " + loggedAccountDetailsQuery.First().Surname;
            fullname = loggedAccountDetailsQuery.First().FirstName + " " + loggedAccountDetailsQuery.First().Surname;
            ViewBag.ProfileUrl = loggedAccountDetailsQuery.First().ProfileImagePath;
            profileImage = loggedAccountDetailsQuery.First().ProfileImagePath;
            ViewData["Host"] = Request.Host;

            ViewBag.FriendReqList = FriendReqList();
            return View();
        }

        //method executed when new post is created
        [HttpPost]
        public IActionResult FeedData(Post p, IFormFile imgfile)
        {

            Post post = new Post();
            string path = ImgPath(imgfile);

            if (path.Equals("-1"))
                return RedirectToAction("Failure", "Home");
            else
            {
                //add new post's data in database
                post.Email = HomeController.loggedUser.Email;
                Random r = new Random();
                post.PostId = HomeController.loggedUser.UserId + r.Next();
                post.Caption = p.Caption;
                post.Likes = 0;
                post.Imagepath = path;
                post.Date = DateTime.Now;

                _context.Posts.Add(post);
                _context.SaveChanges();
                return RedirectToAction("FeedData", "Feed");
            }
        }

        //save the new post's image in local folder and then return its path
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
                        path = Path.Combine(_host.ContentRootPath + "PostContent\\Uploads\\" + HomeController.loggedUser.Email + "\\Posts", random + Path.GetFileName(file.FileName));
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
                    path = "-1";
            }
            else
                path = "-1";

            return path;
        }

        //return results for Search functionality
        [HttpPost]
        public IActionResult SearchBy(string name)
        {
            var result = _context.Accounts.Where(x => (x.FirstName.StartsWith(name) || x.Surname.StartsWith(name))).ToList();
            return Json(result);
        }

        //returns profile page of acebook users
        [Route("Feed/Profile/{email}")]
        public IActionResult Profile(string email)
        {
            frData.ToRequest = email;
            ViewData["Email"] = email;
            return View();
        }

        //returns list of friend requests
        public List<SelectListItem> FriendReqList()
        {
            List<SelectListItem> reqList = new List<SelectListItem>();

            var friendReqQuery = from item in _context.FriendRequests
                                 where item.ToRequest == HomeController.loggedUser.Email
                                 select item.FromRequest;

            foreach (var item in friendReqQuery.ToList())
            {
                reqList.Add(new SelectListItem { Text = item.ToString() });
            }

            return reqList;
        }

        //method to return all posts id
        public ActionResult AllPostIds()
        {
            var postIds = (from post in _context.Posts
                           select post.PostId).ToList();
            return Json(postIds);
        }

        //method to be executed with a post is liked/unliked
        public ActionResult Liked(string id)
        {
            Like like = new Like();

            Post p = (from post in _context.Posts
                      where post.PostId == id
                      select post).First();

            var isLike = _context.Likes.Where(_ => (_.LikedBy == HomeController.loggedUser.Email && _.PostId == id));
            var isNoti = _context.Notifications.Where(_ => (_.NotifiedBy == HomeController.loggedUser.Email && _.PostId == id && _.NotiType == "Like"));

            //if post was not liked previously by logged user
            if (!isLike.Any())
            {
                p.Likes += 1;
                like.PostId = id;
                like.LikedBy = HomeController.loggedUser.Email;
                like.LikedByName = fullname;
                _context.Likes.Add(like);

                //send notification for liked post to post owner
                Notification noti = new Notification();
                if (p.Email != HomeController.loggedUser.Email)
                {
                    noti.NotifiedBy = HomeController.loggedUser.Email;
                    noti.NotifiedTo = p.Email;
                    noti.NotiType = "Like";
                    noti.PostId = id;
                    noti.NotiStatus = "Unread";
                    _context.Notifications.Add(noti);
                    _context.SaveChanges();
                }
            }
            //if post was already liked previously by logged user
            else
            {
                p.Likes -= 1;
                _context.Likes.Remove(isLike.First());

                if (p.Email != HomeController.loggedUser.Email)
                {
                    _context.Notifications.Remove(isNoti.First());
                }
            }

            _context.SaveChanges();

            return new EmptyResult();
        }

        //returns all the likes for a given post
        public IActionResult GetLikesBy(string id)
        {
            var getLikesQuery = _context.Likes.Where(x => x.PostId == id).ToList();
            return Json(getLikesQuery);
        }

        //method to be executed when there is new comment on a post
        public ActionResult Commented(string id, string text)
        {
            Comment comment = new Comment();

            Post p = (from post in _context.Posts
                      where post.PostId == id
                      select post).First();

            p.Comments += 1;
            comment.PostId = id;
            comment.CommentedText = text;
            comment.CommentedBy = HomeController.loggedUser.Email;
            comment.CommentedByName = fullname;
            comment.CommentedDate = DateTime.Now;
            comment.CommentedByImagepath = profileImage.Substring(64);
            _context.Comments.Add(comment);

            Notification noti = new Notification();

            //send notification for commented post to post owner
            if (p.Email != HomeController.loggedUser.Email)
            {
                noti.NotifiedBy = HomeController.loggedUser.Email;
                noti.NotifiedTo = p.Email;
                noti.NotiType = "Comment";
                noti.PostId = id;
                noti.NotiStatus = "Unread";
                _context.Notifications.Add(noti);
            }

            _context.SaveChanges();
            return Json("success");
        }

        //returns all the comments for a given post
        public IActionResult GetCommentsBy(string id)
        {
            var getCommentsQuery = (from cmt in _context.Comments
                                    where cmt.PostId == id
                                    orderby cmt.CommentedDate descending
                                    select cmt).ToList();

            return Json(getCommentsQuery);
        }

        //returns all the friends of logged user
        public IActionResult GetContacts()
        {
            var getFriendsQuery1 = (from acc in _context.Friends
                                    where acc.ToRequest == HomeController.loggedUser.Email
                                    select acc.FromRequest).ToList();

            var getFriendsQuery2 = (from acc in _context.Friends
                                    where acc.FromRequest == HomeController.loggedUser.Email
                                    select acc.ToRequest).ToList();

            getFriendsQuery1.AddRange(getFriendsQuery2);

            return Json(getFriendsQuery1);
        }

        //returns all notications of logged user
        public IActionResult GetMyNotifications()
        {
            var getMyNotiQuery = from noti in _context.Notifications
                                 where noti.NotifiedTo == HomeController.loggedUser.Email
                                 orderby noti descending
                                 select noti;

            return Json(getMyNotiQuery);
        }

        //method to update notification status if it has been read
        public IActionResult UpdateNotificatioStatus(string type, string id)
        {
            if (type == "Add Friend")
            {
                _context.Notifications
                    .Where(noti => noti.NotiType == type && noti.NotifiedBy == id && noti.NotifiedTo == HomeController.loggedUser.Email)
                    .ToList()
                    .ForEach(entry => entry.NotiStatus = "Read");
            }
            else
            {
                _context.Notifications
                    .Where(noti => noti.NotiType == type && noti.PostId == id && noti.NotifiedTo == HomeController.loggedUser.Email)
                    .ToList()
                    .ForEach(entry => entry.NotiStatus = "Read");
            }

            _context.SaveChanges();

            return new EmptyResult();
        }
    }
}