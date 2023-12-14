﻿using AceBookApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace AceBookApp.Controllers
{
    public class HomeController: Controller
    {

        private readonly AppDbContext _context;
        private readonly IHostEnvironment _host;
        public static Post postData = new Post();

        public HomeController(AppDbContext context, IHostEnvironment host)
        {
            _context = context;
            _host = host;
        }

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
                model.DateList.Add(new SelectListItem { Text = date.ToString()});
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


        [HttpPost]
        public IActionResult CreateAccount(Account acc)
        {
            if (ModelState.IsValid)
            {
                if(acc.ProfileImagePath == null && acc.Gender == "Male")
                {
                    acc.ProfileImagePath = _host.ContentRootPath + "PostContent\\Uploads\\DefaultProfilePhoto\\" + "maleProfilePhotoDefault.PNG";
                }
                else if (acc.ProfileImagePath == null && acc.Gender == "Female")
                {
                    acc.ProfileImagePath = _host.ContentRootPath + "PostContent\\Uploads\\DefaultProfilePhoto\\" + "femaleProfilePhotoDefault.PNG";
                }

                if (acc.CoverImagePath == null && acc.Gender == "Male")
                {
                    acc.CoverImagePath = _host.ContentRootPath + "PostContent\\Uploads\\DefaultProfilePhoto\\" + "maleProfilePhotoDefault.PNG";
                }
                else if (acc.CoverImagePath == null && acc.Gender == "Female")
                {
                    acc.CoverImagePath = _host.ContentRootPath + "PostContent\\Uploads\\DefaultProfilePhoto\\" + "femaleProfilePhotoDefault.PNG";
                }

                acc.Status = "Offline";
                _context.Accounts.Add(acc);
                _context.SaveChanges();
                return RedirectToAction("Success", "Home");
            }
            else
            {
                return View(acc);
            } 
        }

        public IActionResult Success()
        {
            return View();
        }

        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login(string email, string password)
        {
            var loggedAccount = _context.Accounts.Find(email);
            if (loggedAccount != null)
            {
                if(loggedAccount.Password == password)
                {
                    postData.Email= email;
                    postData.PostId = loggedAccount.FirstName.Substring(0, 3) + loggedAccount.Surname.Substring(0, 3);

                    var account = (from acc in _context.Accounts
                                  where acc.Email == email
                                  select acc).First();

                    account.Status = "Online";

                    _context.SaveChanges();

                    return RedirectToAction("FeedData", "Feed");
                }
                else
                {
                    return RedirectToAction("Failure", "Home");
                }
            }
            else
            {
                return RedirectToAction("Failure", "Home");
            }
            
        }

        public IActionResult ForgetPassword()
        {
            return View();
        }

        public IActionResult Failure()
        {
            return View();
        }

    }
}
