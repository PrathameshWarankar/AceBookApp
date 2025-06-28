using AceBookApp.Handler;
using AceBookApp.Models;
using Azure.Identity;
using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace AceBookApp.Controllers
{
    [AllowAnonymous]
    public class HomeController : Controller
    {

        private readonly AppDbContext _context;
        private readonly IHostEnvironment _host;
        public static Post postData = new Post();
        public static LoggedUser loggedUser = new LoggedUser();
        private static IMemoryCache _memoryCache;

        //initializes AppDbContext
        public HomeController(AppDbContext context, IHostEnvironment host, IMemoryCache memoryCache)
        {
            _context = context;
            _host = host;
            _memoryCache = memoryCache;
        }

        //returns view of create account page
        public IActionResult CreateAccount()
        {
            var DOBDate = DateOfBirthController.GetAllDate();
            var DOBMonth = DateOfBirthController.GetAllMonth();
            var DOBYear = DateOfBirthController.GetAllYear();

            var model = new Account();
            model.DateList = new List<SelectListItem>();
            model.MonthList = new List<SelectListItem>();
            model.YearList = new List<SelectListItem>();

            foreach (var date in DOBDate)
            {
                model.DateList.Add(new SelectListItem { Text = date.ToString() });
            }

            foreach (var month in DOBMonth)
            {
                model.MonthList.Add(new SelectListItem { Text = month.ToString() });
            }

            foreach (var year in DOBYear)
            {
                model.YearList.Add(new SelectListItem { Text = year.ToString() });
            }

            return View(model);
        }

        //adds created account's details in database
        [HttpPost]
        public async Task<IActionResult> CreateAccount(Account acc)
        {
            if (ModelState.IsValid)
            {
                if (acc.ProfileImagePath == null && acc.Gender == "Male")
                    acc.ProfileImagePath = "https://acebookstorage01.blob.core.windows.net/default-profile-photo/maleProfilePhotoDefault.png";
                else if (acc.ProfileImagePath == null && acc.Gender == "Female")
                    acc.ProfileImagePath = "https://acebookstorage01.blob.core.windows.net/default-profile-photo/femaleProfilePhotoDefault.png";

                if (acc.CoverImagePath == null)
                    acc.CoverImagePath = "https://acebookstorage01.blob.core.windows.net/default-profile-photo/coverPhotoDefault.jpg";

                acc.Status = "Offline";

                var passwordHasher = new PasswordHasher<IdentityUser>();
                acc.Password = passwordHasher.HashPassword(null, acc.Password);

                _context.Accounts.Add(acc);

                await _context.SaveChangesAsync();
                return RedirectToAction("Success", "Home");
            }
            else
                return View(acc);
        }

        //returns success page
        public IActionResult Success()
        {
            return View();
        }

        //returns login page
        public IActionResult Login()
        {
            return View();
        }

        //checks if logged user is a valid user or not
        [HttpPost]
        public async Task<IActionResult> Login(string email, string password)
        {
            var loggedAccount = _context.Accounts.Find(email);
            if (loggedAccount != null)
            {
                var passwordHasher = new PasswordHasher<IdentityUser>();
                var result = passwordHasher.VerifyHashedPassword(null, loggedAccount.Password, password);

                if (result == PasswordVerificationResult.Success)
                {
                    loggedUser.UserId = BitConverter.ToString(SHA256.HashData(Encoding.UTF8.GetBytes(email.Trim().ToLower()))).Replace("-", "").ToLower().Substring(0, 16);

                    var account = await (from acc in _context.Accounts
                                         where acc.Email == email
                                         select acc).FirstOrDefaultAsync();

                    account.Status = "Online";

                    await _context.SaveChangesAsync();

                    var claims = new List<Claim> {
                                    new Claim(ClaimTypes.Name, email),
                                };

                    var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                    await HttpContext.SignInAsync(
                            CookieAuthenticationDefaults.AuthenticationScheme,
                            new ClaimsPrincipal(claimsIdentity),
                            new AuthenticationProperties
                            {
                                IsPersistent = false 
                            });


                    return RedirectToAction("FeedData", "Feed");
                }
                else
                    return RedirectToAction("Failure", "Home");
            }
            else
                return RedirectToAction("Failure", "Home");
        }

        //returns forget password page
        public IActionResult ForgetPassword()
        {
            return View();
        }

        //returns failure page
        public IActionResult Failure()
        {
            return View();
        }

        public static string SasTokenGenerator(string containerName, string blobName)
        {
            var storageAccountName = "acebookstorage01";
            var blobEndpoint = $"https://{storageAccountName}.blob.core.windows.net";

            if (_memoryCache.TryGetValue(containerName + "/" + blobName, out string cachedValue))
            {
                return cachedValue;
            }

            var credential = new AzureCliCredential();
            var blobServiceClient = new BlobServiceClient(new Uri(blobEndpoint), credential);

            // Get the container and blob client
            var containerClient = blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(blobName);

            // Get a User Delegation Key
            var delegationKey = blobServiceClient.GetUserDelegationKey(
                DateTimeOffset.UtcNow,
                DateTimeOffset.UtcNow.AddHours(2));

            // Create SAS builder
            var sasBuilder = new BlobSasBuilder
            {
                BlobContainerName = containerName,
                BlobName = blobName,
                Resource = "b", // "b" for blob
                StartsOn = DateTimeOffset.UtcNow.AddMinutes(-5),
                ExpiresOn = DateTimeOffset.UtcNow.AddMinutes(15)
            };

            sasBuilder.SetPermissions(BlobSasPermissions.Read);

            // Generate SAS token
            var sasToken = sasBuilder.ToSasQueryParameters(delegationKey.Value, storageAccountName).ToString();

            _memoryCache.Set(containerName + "/" + blobName, $"{blobClient.Uri}?{sasToken}", TimeSpan.FromMinutes(15));

            // Final URL
            return $"{blobClient.Uri}?{sasToken}";
        }
    }
}
