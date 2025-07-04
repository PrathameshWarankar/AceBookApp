﻿using AceBookApp.Handler;
using AceBookApp.Models;
using Azure.Identity;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AceBookApp.Controllers
{
    public class ProfileController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IHostEnvironment _host;
        protected string CurrentUserEmail => User.Identity?.Name;

        //initializes AppDbContext
        public ProfileController(AppDbContext context, IHostEnvironment host)
        {
            _context = context;
            _host = host;
        }

        public static FriendRequest frData = new FriendRequest();

        //method to send/delete friend request
        public async Task<IActionResult> SendRequest(string toRequest, string fromRequest)
        {
            if (ModelState.IsValid)
            {
                FriendRequest fr = new FriendRequest();

                //query to check if friend req already exists
                var existingReqCheckQuery = await (from entry in _context.FriendRequests
                                                  where entry.FromRequest == fromRequest && entry.ToRequest == toRequest
                                                  select entry).SingleOrDefaultAsync();

                var isNoti = await _context.Notifications
                            .Where(_ => _.NotifiedBy == CurrentUserEmail && _.NotiType == "Add Friend")
                            .FirstOrDefaultAsync();

                //if friend req already exists, delete the req
                if (existingReqCheckQuery != null)
                {
                    _context.FriendRequests.Remove(existingReqCheckQuery);
                    _context.Notifications.Remove(isNoti);

                    await _context.SaveChangesAsync();
                    return new EmptyResult();
                }

                fr.FromRequest = fromRequest;
                fr.ToRequest = toRequest;
                fr.SentDate = DateTime.Now;

                var frndReqListQuery = await (from entry in _context.FriendRequests
                                              orderby entry.SentDate descending
                                              select entry).ToListAsync();

                //create request id for first entry
                if (frndReqListQuery == null || frndReqListQuery.Count() == 0)
                    fr.RequestID = string.Concat("Req1 - ", fr.FromRequest.AsSpan(0, 3), fr.ToRequest.AsSpan(0, 3));

                //create request id for subsequent entry
                else
                {
                    var res = frndReqListQuery.Last().RequestID.ToString();
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

                await _context.SaveChangesAsync();
                return new EmptyResult();
            }
            else
                return RedirectToAction("Failure", "Home");
        }

        //confirm if request sent, used to update the view
        public async Task<string> IsReqSent(string toRequest)
        {
            var reqCheckQuery = await (from entry in _context.FriendRequests
                                      where entry.FromRequest == CurrentUserEmail && entry.ToRequest == toRequest
                                      select entry).FirstOrDefaultAsync();

            if (reqCheckQuery != null)
                return "Yes";
            else
                return "No";
        }

        //confirm if friend, used to update the view
        public async Task<string> IsFriend(string toRequest)
        {
            var frndCheckQuery = await (from entry in _context.Friends
                                       where (entry.FromRequest == CurrentUserEmail && entry.ToRequest == toRequest)
                                          || (entry.ToRequest == CurrentUserEmail && entry.FromRequest == toRequest)
                                       select entry).FirstOrDefaultAsync();

            if (frndCheckQuery != null)
                return "Yes";
            else
                return "No";
        }

        //method executed when friend req accepted
        public async Task<IActionResult> AddFriend(string toRequest, string fromRequest)
        {
            Friend fr = new Friend();

            fr.FromRequest = fromRequest;
            fr.ToRequest = toRequest;
            fr.SentDate = DateTime.Now;

            var frndListQuery = await (from entry in _context.Friends
                                      orderby entry.SentDate descending
                                      select entry).ToListAsync();

            //create friend id for first entry
            if (frndListQuery == null || frndListQuery.Count() == 0)
                fr.RequestID = string.Concat("FrndID1 - ", fr.FromRequest.AsSpan(0, 3), fr.ToRequest.AsSpan(0, 3));

            //create friend id for subsequent entry
            else
            {
                var res = frndListQuery.Last().RequestID.ToString();
                fr.RequestID = "FrndID" + Convert.ToString(Convert.ToInt32(res.Substring(6, 1)) + 1) + " - " + fr.FromRequest.Substring(0, 3) + fr.ToRequest.Substring(0, 3);
            }

            _context.Friends.Add(fr);

            await _context.SaveChangesAsync();
            return new EmptyResult();
        }

        //returns view of profile
        public IActionResult ProfileData(string email)
        {
            return View();
        }

        //method to fetch account details of user
        public async Task<IActionResult> GetProfileDetails(string email)
        {
            if (email == null)
            {
                var myAccDetailsQuery = await _context.Accounts
                                        .Where(x => x.Email == CurrentUserEmail)
                                        .FirstOrDefaultAsync();
                myAccDetailsQuery.CoverImagePath = HomeController.SasTokenGenerator(myAccDetailsQuery.CoverImagePath.Split("/")[3], myAccDetailsQuery.CoverImagePath.Split("/")[4]);
                myAccDetailsQuery.ProfileImagePath = HomeController.SasTokenGenerator(myAccDetailsQuery.ProfileImagePath.Split("/")[3], myAccDetailsQuery.ProfileImagePath.Split("/")[4]);
                
                return Json(myAccDetailsQuery);
            }
            else
            {
                var accDetailsQuery = await _context.Accounts
                                        .Where(x => x.Email == email)
                                        .FirstOrDefaultAsync();

                accDetailsQuery.CoverImagePath = HomeController.SasTokenGenerator(accDetailsQuery.CoverImagePath.Split("/")[3], accDetailsQuery.CoverImagePath.Split("/")[4]);
                accDetailsQuery.ProfileImagePath = HomeController.SasTokenGenerator(accDetailsQuery.ProfileImagePath.Split("/")[3], accDetailsQuery.ProfileImagePath.Split("/")[4]);

                return Json(accDetailsQuery);
            }
        }

        //method to additional account's work details in database
        public async Task<IActionResult> AddAdditionalDetails(string i1, string i2, string i3)
        {
            AdditionAccountDetail details = new AdditionAccountDetail();
            var isEntry = await _context.additionAccountDetails
                            .Where(x => x.Loggedemail == CurrentUserEmail)
                            .FirstOrDefaultAsync();

            //if details do not exists previously
            if (isEntry == null)
            {
                details.Loggedemail = CurrentUserEmail;
                details.WorkInfo1 = i1;
                details.WorkInfo2 = i2;
                details.WorkInfo3 = i3;
                _context.additionAccountDetails.Add(details);
            }
            //if details exists previously
            else
            {
                isEntry.WorkInfo1 = i1;
                isEntry.WorkInfo2 = i2;
                isEntry.WorkInfo3 = i3;
            }

            await _context.SaveChangesAsync();
            return new EmptyResult();
        }

        //method to additional account's non work details in database
        public async Task<IActionResult> AddAdditionalDetailsNew(string type, string i1)
        {
            AdditionAccountDetail details = new AdditionAccountDetail();
            if (type == "College")
            {
                var isEntry = await _context.additionAccountDetails
                                .FirstOrDefaultAsync(x => x.Loggedemail == CurrentUserEmail);

                //if college details do not exists previously
                if (isEntry == null)
                {
                    details.Loggedemail = CurrentUserEmail;
                    details.CollegeInfo = i1;
                    _context.additionAccountDetails.Add(details);
                }

                //if college details exists previously
                else
                    isEntry.CollegeInfo = i1;

                await _context.SaveChangesAsync();
                return new EmptyResult();
            }

            if (type == "School")
            {
                var isEntry = await _context.additionAccountDetails
                                                .FirstOrDefaultAsync(x => x.Loggedemail == CurrentUserEmail);
                //if school details do not exists previously
                if (isEntry == null)
                {
                    details.Loggedemail = CurrentUserEmail;
                    details.SchoolInfo = i1;
                    _context.additionAccountDetails.Add(details);
                }

                //if school details exists previously
                else
                    isEntry.SchoolInfo = i1;

                await _context.SaveChangesAsync();
                return new EmptyResult();
            }

            if (type == "City")
            {
                var isEntry = await _context.additionAccountDetails
                                                .FirstOrDefaultAsync(x => x.Loggedemail == CurrentUserEmail);
                //if city details do not exists previously
                if (isEntry == null)
                {
                    details.Loggedemail = CurrentUserEmail;
                    details.PlaceInfo = i1;
                    _context.additionAccountDetails.Add(details);
                }

                //if city details exists previously
                else
                    isEntry.PlaceInfo = i1;

                await _context.SaveChangesAsync();
                return new EmptyResult();
            }

            if (type == "Contact")
            {
                var isEntry = await _context.additionAccountDetails
                                                .FirstOrDefaultAsync(x => x.Loggedemail == CurrentUserEmail);
                //if contact details do not exists previously
                if (isEntry == null)
                {
                    details.Loggedemail = CurrentUserEmail;
                    details.PhoneInfo = i1;
                    _context.additionAccountDetails.Add(details);
                }

                //if contact details exists previously
                else
                    isEntry.PhoneInfo = i1;

                await _context.SaveChangesAsync();
                return new EmptyResult();
            }

            if (type == "Website")
            {
                var isEntry = await _context.additionAccountDetails
                                                .FirstOrDefaultAsync(x => x.Loggedemail == CurrentUserEmail);
                //if website details do not exists previously
                if (isEntry == null)
                {
                    details.Loggedemail = CurrentUserEmail;
                    details.SocialAccInfo = i1;
                    _context.additionAccountDetails.Add(details);
                }

                //if website details exists previously
                else
                    isEntry.SocialAccInfo = i1;

                await _context.SaveChangesAsync();
                return new EmptyResult();
            }
            return new EmptyResult();
        }

        //method to fetch additional details of user from database
        public async Task<IActionResult> GetAdditionalDetails(string email)
        {
            if (email == null)
            {
                var myDetailsQuery = await _context.additionAccountDetails
                                    .FirstOrDefaultAsync(x => x.Loggedemail == CurrentUserEmail);

                return Json(myDetailsQuery);
            }
            else
            {
                var userDetailsQuery = await _context.additionAccountDetails
                                        .FirstOrDefaultAsync(x => x.Loggedemail == email);

                return Json(userDetailsQuery);
            }
        }

        //returns friends page view
        public IActionResult Friends(string email)
        {
            return View();
        }

        //method to get list of friend requests received
        public async Task<IActionResult> GetFriendReq(string email)
        {
            var query = await (from req in _context.FriendRequests
                              where req.ToRequest == email
                              orderby req.SentDate descending
                              select req).ToListAsync();

            return Json(query);
        }

        //method to delete friend req
        public async Task<IActionResult> DeleteReq(string fromRequest, string toRequest)
        {
            var reqQuery = await (from req in _context.FriendRequests
                                 where req.FromRequest == fromRequest && req.ToRequest == toRequest
                                 select req).FirstOrDefaultAsync();

            _context.FriendRequests.Remove(reqQuery);
            await _context.SaveChangesAsync();

            return new EmptyResult();
        }

        //method to get list of friend
        public async Task<IActionResult> GetFriendList(string email)
        {
            var frndListQuery = await (from req in _context.Friends
                                      where req.ToRequest == email || req.FromRequest == email
                                      orderby req.SentDate descending
                                      select req).ToListAsync();

            return Json(frndListQuery);
        }

        //method to get all posts of particular user
        public async Task<IActionResult> GetPostsList(string email)
        {
            var postsQuery = await (from post in _context.Posts
                                   where post.Email == email
                                   select post).ToListAsync();

            postsQuery.ForEach(post => post.Imagepath = HomeController.SasTokenGenerator(post.Imagepath.Split("/")[3], post.Imagepath.Split("/")[4]));

            return Json(postsQuery);
        }

        //method to get posts like by logged user
        public async Task<IActionResult> GetPostsLikedByMe()
        {
            var myLikedPostsQuery = await (from like in _context.Likes
                                          where like.LikedBy == CurrentUserEmail
                                          select like.PostId).ToListAsync();

            return Json(myLikedPostsQuery);
        }

        //method to update profile photo of logged user
        public async Task<IActionResult> ProfileImgUpload(IFormFile profileImg)
        {
            var account = await (from acc in _context.Accounts
                                where acc.Email == CurrentUserEmail
                                select acc).FirstOrDefaultAsync();

            Result result = await ImgPath(profileImg);

            if (result.isError == true)
                return RedirectToAction("Result", "Feed", result);
            else
                account.ProfileImagePath = result.message;

            await _context.SaveChangesAsync();

            return RedirectToAction("ProfileData", "Profile", new { email = CurrentUserEmail });
        }

        //method to update cover photo of logged user
        public async Task<IActionResult> CoverImgUpload(IFormFile coverImg)
        {
            var account = await (from acc in _context.Accounts
                                where acc.Email == CurrentUserEmail
                                select acc).FirstOrDefaultAsync();

            Result result = await ImgPath(coverImg);

            if (result.isError == true)
                return RedirectToAction("Result", "Feed", result);
            else
                account.CoverImagePath = result.message;

            await _context.SaveChangesAsync();

            return RedirectToAction("ProfileData", "Profile", new { email = CurrentUserEmail });
        }

        //method to generate path of profile/cover photo
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

                        BlobContainerClient? containerClient = blobServiceClient.GetBlobContainerClient(CurrentUserEmail.Replace("@", "").Replace(".", "") + "-profile-images");

                        var exists = await containerClient.ExistsAsync();

                        if (!exists.Value)
                        {
                            containerClient = await blobServiceClient.CreateBlobContainerAsync(CurrentUserEmail.Replace("@", "").Replace(".", "") + "-profile-images");
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

        //return settings page of logged user
        public async Task<IActionResult> Settings(string email)
        {
            var account = await (from acc in _context.Accounts
                                where acc.Email == CurrentUserEmail
                                select acc).FirstOrDefaultAsync();

            return View(account);
        }

        //method to update account details
        public async Task<IActionResult> EditAccountDetails(string type, string value1, string value2)
        {
            Account account = new Account();

            var myAcc = await (from acc in _context.Accounts
                              where acc.Email == CurrentUserEmail
                              select acc).FirstOrDefaultAsync();

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

                var myAddAcc = await (from addAcc in _context.additionAccountDetails
                                      where addAcc.Loggedemail == CurrentUserEmail
                                      select addAcc).FirstOrDefaultAsync();

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
                    .Where(x => x.CommentedBy == CurrentUserEmail)
                    .ToList()
                    .ForEach(a => a.CommentedBy = value1);

                _context.FriendRequests
                    .Where(x => x.FromRequest == CurrentUserEmail)
                    .ToList()
                    .ForEach(a => a.FromRequest = value1);

                _context.FriendRequests
                    .Where(x => x.ToRequest == CurrentUserEmail)
                    .ToList()
                    .ForEach(a => a.ToRequest = value1);

                _context.Friends
                    .Where(x => x.FromRequest == CurrentUserEmail)
                    .ToList()
                    .ForEach(a => a.FromRequest = value1);

                _context.Friends
                    .Where(x => x.ToRequest == CurrentUserEmail)
                    .ToList()
                    .ForEach(a => a.ToRequest = value1);

                _context.Likes
                    .Where(x => x.LikedBy == CurrentUserEmail)
                    .ToList()
                    .ForEach(a => a.LikedBy = value1);

                _context.Posts
                    .Where(x => x.Email == CurrentUserEmail)
                    .ToList()
                    .ForEach(a => a.Email = value1);
            }

            await _context.SaveChangesAsync();

            return new EmptyResult();
        }

        //method to update account password
        public async Task<string> UpdatePassword(string currPass, string newPass)
        {
            var myAcc = await (from acc in _context.Accounts
                              where acc.Email == CurrentUserEmail
                              select acc).FirstOrDefaultAsync();

            if (myAcc.Password != currPass)
            {
                return "Wrong Password";
            }
            else
            {
                myAcc.Password = newPass;
                await _context.SaveChangesAsync();
                return "Success";
            }
        }

        //method to logout user
        public async Task Logout()
        {
            try
            {
                var account = await (from acc in _context.Accounts
                                     where acc.Email == CurrentUserEmail
                                     select acc).FirstOrDefaultAsync();

                account.Status = "Offline";

                await _context.SaveChangesAsync();

                await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            }
            catch (Exception ex)
            {
                await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

                Console.WriteLine("Error while saving Status changes to database: " + ex.Message);
            }
        }
    }
}
