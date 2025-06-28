using AceBookApp.Models;
using Azure.Identity;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;

namespace AceBookApp.Controllers
{
    public class FeedController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IHostEnvironment _host;

        public static FriendRequest frData = new FriendRequest();
        static string fullname;
        static string profileImage;
        protected string CurrentUserEmail => User.Identity?.Name;

        //initializes AppDbContext
        public FeedController(AppDbContext context, IHostEnvironment host)
        {
            _context = context;
            _host = host;
        }

        //loads user's feed
        public async Task<IActionResult> FeedData()
        {
            //return all the user posts present in database
            List<Post> posts = await (from post in _context.Posts
                                     orderby post.Date descending
                                     select post).ToListAsync();

            List<string> names = new List<string>();
            List<string> emails = new List<string>();
            List<string> feedPostProfileUrl = new List<string>();
            List<int> postLikeCount = new List<int>();

            foreach (var post in posts)
            {
                //fetch account details of post owners
                var postOwner = await (from acc in _context.Accounts
                                            where acc.Email == post.Email
                                            select acc).FirstOrDefaultAsync();

                postLikeCount.Add(post.Likes);

                names.Add(postOwner.FirstName + " " + postOwner.Surname);
                emails.Add(postOwner.Email);

                var feedPostProfileUrlSplit = postOwner.ProfileImagePath.Split("/");
                feedPostProfileUrl.Add(HomeController.SasTokenGenerator(feedPostProfileUrlSplit[3], feedPostProfileUrlSplit[4]));

                var postImageSplit = post.Imagepath.Split("/");
                post.Imagepath = HomeController.SasTokenGenerator(postImageSplit[3], postImageSplit[4]);
            }

            //get list of posts already liked by logged user
            var likedByMeQuery = await (from likes in _context.Likes
                                        where likes.LikedBy == CurrentUserEmail
                                        select likes.PostId).ToListAsync();

            ViewBag.LikedByMe = likedByMeQuery;

            ViewBag.Names = names;
            ViewBag.Posts = posts;
            ViewBag.PostEmails = emails;
            ViewBag.FeedPostProfileUrl = feedPostProfileUrl;
            ViewBag.PostLikeCount = postLikeCount;

            ViewBag.Email = CurrentUserEmail;

            //get account details of logged user
            var loggedAccountDetailsQuery = await (from account in _context.Accounts
                                                   where account.Email == CurrentUserEmail
                                                   select account).FirstOrDefaultAsync();

            ViewBag.Firstname = loggedAccountDetailsQuery.FirstName;
            ViewBag.Lastname = loggedAccountDetailsQuery.Surname;
            ViewBag.Fullname = loggedAccountDetailsQuery.FirstName + " " + loggedAccountDetailsQuery.Surname;
            fullname = loggedAccountDetailsQuery.FirstName + " " + loggedAccountDetailsQuery.Surname;

            var profileImagePathSplit = loggedAccountDetailsQuery.ProfileImagePath.Split("/");

            ViewBag.ProfileUrl = HomeController.SasTokenGenerator(profileImagePathSplit[3], profileImagePathSplit[4]);
            profileImage = loggedAccountDetailsQuery.ProfileImagePath;
            ViewData["Host"] = Request.Host;

            ViewBag.FriendReqList = FriendReqList();
            return View();
        }

        //method executed when new post is created
        [HttpPost]
        public async Task<IActionResult> FeedData(Post p, IFormFile imgfile)
        {
            Post post = new Post();
            Result result = await ImgPath(imgfile);

            if (result.isError == true)
                return RedirectToAction("Result", "Feed", result);
            else
            {
                //add new post's data in database
                post.Email = CurrentUserEmail;
                Random r = new Random();
                post.PostId = HomeController.loggedUser.UserId + r.Next();
                post.Caption = p.Caption;
                post.Likes = 0;
                post.Imagepath = result.message;
                post.Date = DateTime.Now;

                _context.Posts.Add(post);

                await _context.SaveChangesAsync();
                return RedirectToAction("FeedData", "Feed");
            }
        }

        public IActionResult Result(Result result)
        {
            TempData["AlertMessage"] = result.message;
            TempData["RedirectUrl"] = Url.Action("FeedData", "Feed");
            return View(result);
        }

        //save the new post's image in local folder and then return its path
        public async Task<Result> ImgPath(IFormFile file)
        {
            Random r = new Random();
            string path = string.Empty;

            int random = r.Next();
            if (file != null && file.Length > 0)
            {
                string extension = Path.GetExtension(file.FileName);

                if (file.ContentType.ToLower().Contains("image"))
                {
                    try
                    {
                        var blobServiceClient = new BlobServiceClient(
                                                new Uri("https://acebookstorage01.blob.core.windows.net"),
                                                new DefaultAzureCredential());

                        BlobContainerClient? containerClient = blobServiceClient.GetBlobContainerClient(CurrentUserEmail.Replace("@", "").Replace(".", "") + "-posts");

                        var exists = await containerClient.ExistsAsync();

                        if (!exists.Value)
                        {
                            containerClient = await blobServiceClient.CreateBlobContainerAsync(CurrentUserEmail.Replace("@", "").Replace(".", "") + "-posts");
                        }

                        BlobClient blobClient = containerClient.GetBlobClient(Path.GetFileName(file.FileName));

                        using (var stream = file.OpenReadStream())
                        {
                            await blobClient.UploadAsync(stream, overwrite: true);
                        }

                        path = blobClient.Uri.ToString();

                        //Directory.CreateDirectory(Path.GetDirectoryName(path));
                        //using (Stream fileStream = new FileStream(path, FileMode.Create, FileAccess.Write))
                        //{
                        //    file.CopyTo(fileStream);
                        //}
                    }
                    catch (Exception ex)
                    {
                        return new Result
                        {
                            isError = true,
                            message = "An error occurred while uploading the file. Please try again."
                        };
                    }
                }
                else
                    return new Result
                    {
                        isError = true,
                        message = "File type not supported. Please upload an image."
                    };
            }
            else
                return new Result
                {
                    isError = true,
                    message = "File not found. Please upload an image."
                };

            return new Result
            {
                isError = false,
                message = path
            };
        }

        //return results for Search functionality
        [HttpPost]
        public async Task<IActionResult> SearchBy(string name)
        {
            var result = await _context.Accounts
                        .Where(x => x.FirstName.StartsWith(name) || x.Surname.StartsWith(name))
                        .ToListAsync();

            result.ForEach(_ => _.ProfileImagePath = HomeController.SasTokenGenerator(_.ProfileImagePath.Split("/")[3], _.ProfileImagePath.Split("/")[4]));

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
        public async Task<List<SelectListItem>> FriendReqList()
        {
            List<SelectListItem> reqList = new List<SelectListItem>();

            var friendReqQuery = await (from item in _context.FriendRequests
                                       where item.ToRequest == CurrentUserEmail
                                       select item.FromRequest).ToListAsync();

            foreach (var item in friendReqQuery)
            {
                reqList.Add(new SelectListItem { Text = item.ToString() });
            }

            return reqList;
        }

        //method to return all posts id
        public async Task<ActionResult> AllPostIds()
        {
            var postIds = await (from post in _context.Posts
                                select post.PostId).ToListAsync();

            return Json(postIds);
        }

        //method to be executed with a post is liked/unliked
        public async Task<ActionResult> Liked(string id)
        {
            Like like = new Like();

            Post p = await (from post in _context.Posts
                           where post.PostId == id
                           select post).FirstOrDefaultAsync();

            var isLike = await _context.Likes
                            .FirstOrDefaultAsync(_ => _.LikedBy == CurrentUserEmail && _.PostId == id);

            var isNoti = await _context.Notifications
                            .FirstOrDefaultAsync(_ => _.NotifiedBy == CurrentUserEmail && _.PostId == id && _.NotiType == "Like");

            //if post was not liked previously by logged user
            if (isLike == null)
            {
                p.Likes += 1;
                like.PostId = id;
                like.LikedBy = CurrentUserEmail;
                like.LikedByName = fullname;
                _context.Likes.Add(like);

                //send notification for liked post to post owner
                Notification noti = new Notification();
                if (p.Email != CurrentUserEmail)
                {
                    noti.NotifiedBy = CurrentUserEmail;
                    noti.NotifiedTo = p.Email;
                    noti.NotiType = "Like";
                    noti.PostId = id;
                    noti.NotiStatus = "Unread";
                    _context.Notifications.Add(noti);

                    await _context.SaveChangesAsync();
                }
            }
            //if post was already liked previously by logged user
            else
            {
                p.Likes -= 1;
                _context.Likes.Remove(isLike);

                if (p.Email != CurrentUserEmail)
                {
                    _context.Notifications.Remove(isNoti);
                }
            }

            await _context.SaveChangesAsync();

            return new EmptyResult();
        }

        //returns all the likes for a given post
        public async Task<IActionResult> GetLikesBy(string id)
        {
            var getLikesQuery = await _context.Likes
                                .Where(x => x.PostId == id)
                                .ToListAsync();

            return Json(getLikesQuery);
        }

        //method to be executed when there is new comment on a post
        public async Task<ActionResult> Commented(string id, string text)
        {
            Comment comment = new Comment();

            Post p = await (from post in _context.Posts
                           where post.PostId == id
                           select post).FirstOrDefaultAsync();

            p.Comments += 1;
            comment.PostId = id;
            comment.CommentedText = text;
            comment.CommentedBy = CurrentUserEmail;
            comment.CommentedByName = fullname;
            comment.CommentedDate = DateTime.Now;
            comment.CommentedByImagepath = profileImage;
            _context.Comments.Add(comment);

            Notification noti = new Notification();

            //send notification for commented post to post owner
            if (p.Email != CurrentUserEmail)
            {
                noti.NotifiedBy = CurrentUserEmail;
                noti.NotifiedTo = p.Email;
                noti.NotiType = "Comment";
                noti.PostId = id;
                noti.NotiStatus = "Unread";
                _context.Notifications.Add(noti);
            }

            await _context.SaveChangesAsync();
            return Json("success");
        }

        //returns all the comments for a given post
        public async Task<IActionResult> GetCommentsBy(string id)
        {
            var getCommentsQuery = await (from cmt in _context.Comments
                                         where cmt.PostId == id
                                         orderby cmt.CommentedDate descending
                                         select cmt).ToListAsync();

            getCommentsQuery.ForEach(post => post.CommentedByImagepath = HomeController.SasTokenGenerator(post.CommentedByImagepath.Split("/")[3], post.CommentedByImagepath.Split("/")[4]));

            return Json(getCommentsQuery);
        }

        //returns all the friends of logged user
        public async Task<IActionResult> GetContacts()
        {
            var getFriendsQuery1 = await (from acc in _context.Friends
                                         where acc.ToRequest == CurrentUserEmail
                                         select acc.FromRequest).ToListAsync();

            var getFriendsQuery2 = await (from acc in _context.Friends
                                    where acc.FromRequest == CurrentUserEmail
                                    select acc.ToRequest).ToListAsync();

            getFriendsQuery1.AddRange(getFriendsQuery2);

            return Json(getFriendsQuery1);
        }

        //returns all notications of logged user
        public async Task<IActionResult> GetMyNotifications()
        {
            var getMyNotiQuery = await (from noti in _context.Notifications
                                       where noti.NotifiedTo == CurrentUserEmail
                                       orderby noti descending
                                       select noti).ToListAsync();

            return Json(getMyNotiQuery);
        }

        //method to update notification status if it has been read
        public async Task<IActionResult> UpdateNotificatioStatus(string type, string id)
        {
            if (type == "Add Friend")
            {
                var notifications = await _context.Notifications
                                    .Where(noti => noti.NotiType == type &&
                                                   noti.NotifiedBy == id &&
                                                   noti.NotifiedTo == CurrentUserEmail)
                                    .ToListAsync();

                notifications.ForEach(entry => entry.NotiStatus = "Read");
            }
            else
            {
                var notifications = await _context.Notifications
                                    .Where(noti => noti.NotiType == type &&
                                                   noti.PostId == id &&
                                                   noti.NotifiedTo == CurrentUserEmail)
                                    .ToListAsync();

                notifications.ForEach(entry => entry.NotiStatus = "Read");
            }

            await _context.SaveChangesAsync();

            return new EmptyResult();
        }
    }
}