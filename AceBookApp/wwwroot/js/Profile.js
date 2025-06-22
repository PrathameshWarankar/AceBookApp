// Read the anti-forgery token from the hidden input
var antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();

// Set up jQuery to include the token in all AJAX requests
$.ajaxSetup({
    headers: { 'RequestVerificationToken': antiForgeryToken }
});

//method to display all likes for particular post when mouse hovered over likes
function DisplayLikes(myData) {
    var value = {
        "id": myData
    }
    $.ajax({
        url: 'https://' + location.host + '/Feed/GetLikesBy',
        method: 'Post',
        data: value,
        success: function (data) {
            var result = '';
            for (var i = 0; i < data.length; i++) {
                result = result + '<span class="myLikedEmail">' + data[i].likedByName + '</span>' + '</br>'
            }
            document.getElementById(myData).getElementsByClassName("myLikedNames")[0].style.display = "block";
            document.getElementById(myData).getElementsByClassName("myLikedNames")[0].innerHTML = result;
        },
        error: function (xhr, status, error) {
            alert("An error occurred: " + error);
        }
    })
}

//method to hide all likes for particular post when mouse removed over likes
function DisplayLikesHide(myData) {
    document.getElementById(myData).getElementsByClassName("myLikedNames")[0].style.display = "none";
}

//method to show comments section
function ShowComments(myData) {
    if (document.getElementById(myData).getElementsByClassName("myCommentSection")[0].style.display == "block") {
        document.getElementById(myData).getElementsByClassName("myCommentSection")[0].style.display = "none";
    }
    else {
        document.getElementById(myData).getElementsByClassName("myCommentSection")[0].style.display = "block";
    }

    document.getElementById(myData).getElementsByClassName("myCommentSection")[0].getElementsByClassName("myAddComment")[0].focus();
}

//method to display all previous comments for a particular post
function GetCommentList(myData) {
    var value1 = {
        "id": myData
    }
    $.ajax({
        url: 'https://' + location.host + '/Feed/GetCommentsBy',
        method: 'Post',
        data: value1,
        success: function (data) {
            var result = '';
            for (var i = 0; i < data.length; i++) {
                result = result + '<div class="commentDetails"><div class="commentImgDiv"><img class="commentImg" src="' + 'http://127.0.0.1:8080/' + data[i].commentedByImagepath + '"/></div><div class="commentData"><div><a class="commentName" href="/Profile/ProfileData/' + data[i].commentedBy + '">' + data[i].commentedByName + '</a></br><span class="commentText"> ' + data[i].commentedText + '</span ></div></div></div>'
            }
            document.getElementById(myData).getElementsByClassName("myCommentsList")[0].innerHTML = result
            //GetCommentsCount();
        },
        error: function (xhr, status, error) {
            alert("An error occurred: " + error);
        }
    })
}

function UpdateCommentCount(postId) {
    var value = { "id": postId };
    $.ajax({
        url: 'https://' + location.host + '/Feed/GetCommentsBy',
        method: 'Post',
        data: value,
        success: function (data) {
            var countText = data.length === 1 ? "1 comment" : data.length + " comments";
            // Update the comment count in the DOM for this post
            var postElem = document.getElementById(postId);
            if (postElem) {
                var countElem = postElem.getElementsByClassName("commentCount")[0];
                if (countElem) {
                    countElem.innerHTML = countText;
                }
            }
        },
        error: function (xhr, status, error) {
            alert("An error occurred: " + error);
        }
    });
}

//method to display previous comments and adds new comment when entered by user
function AddingComment(myData) {
    var val;

    if (myData.postId == undefined) {
        val = myData.id
    } else {
        val = myData.postId
    }

    GetCommentList(val);
    var input = document.getElementById(val).getElementsByClassName("myCommentSection")[0].getElementsByClassName("myAddComment")[0];

    let isSubmitting = false;

    input.addEventListener("keyup", (event) => {
        if (event.key === "Enter" && input.value.trim() !== '' && !isSubmitting) {
            isSubmitting = true;

            var value = {
                "id": val,
                "text": input.value
            };

            $.ajax({
                url: 'https://' + location.host + '/Feed/Commented',
                method: 'Post',
                data: value,
                success: function (data) {
                    input.value = '';
                    setTimeout(function () {
                        GetCommentList(val);
                        UpdateCommentCount(val); 
                    }, 750);
                },
                complete: function () {
                    isSubmitting = false;
                },
                error: function (xhr, status, error) {
                    alert("An error occurred: " + error);
                }
            });
        }
    });
}

//method to update profile photo
function Submit() {
    document.getElementsByClassName("profileImgForm")[0].submit();
}

//method to update cover photo
function Submit1() {
    document.getElementsByClassName("coverImgForm")[0].submit();
}

$(document).ready(function () {
    var myEmail;

    $('.myProfileHeaderProfileAddEditDiv').addClass('hidden');
    $('.myProfileHeaderProfileEditDiv').addClass('hidden');
    $('.myProfileHeaderProfileCancelReqDiv').addClass('hidden');
    $('.myProfileHeaderProfileFrndAcceptedDiv').addClass('hidden');
    $('.myProfileHeaderProfileAddFriendDiv').addClass('hidden');
    document.getElementsByClassName("myProfileHeaderCoverEditBtnDiv")[0].style.visibility = "hidden";

    document.getElementsByClassName("myProfileHeaderOptionsPostsOuterDiv")[0].style.borderBottom = "3px solid #1876F2"
    document.getElementsByClassName("myProfileHeaderOptionsPosts")[0].style.color = "#1876F2"

    $('.aboutOptionDiv').addClass('hidden');

    $('.myProfileHeaderOptionsAboutDiv').click(function () {
        $('.aboutOptionDiv').removeClass('hidden');
        $('.aboutSectionDiv').removeClass('hidden');
        $('.aboutSectionRightFriendsDiv').removeClass('hidden');
        $('.aboutSectionRightPhotosDiv').removeClass('hidden');
        $('.postOptionDiv').addClass('hidden');

        document.getElementsByClassName("myProfileHeaderOptionsAbout")[0].style.color = "#1876F2"
        document.getElementsByClassName("myProfileHeaderOptionsFriends")[0].style.color = "#65676B"
        document.getElementsByClassName("myProfileHeaderOptionsPosts")[0].style.color = "#65676B"
        document.getElementsByClassName("myProfileHeaderOptionsPhotos")[0].style.color = "#65676B"

        document.getElementsByClassName("aboutSectionLeftOverview")[0].style.color = "#1876F2"
        document.getElementsByClassName("aboutSectionLeftOverview")[0].style.backgroundColor = "#EFF3FF";
        $('.aboutSectionRightWorkDiv').addClass('hidden');
        $('.aboutSectionRightPlaceDiv').addClass('hidden');
        $('.aboutSectionRightContactDiv').addClass('hidden');
        $('.aboutSectionRightFamilyDiv').addClass('hidden');
        $('.aboutSectionRightOverviewDiv').removeClass('hidden');

        document.getElementsByClassName("myProfileHeaderOptionsAboutOuterDiv")[0].style.borderBottom = "3px solid #1876F2"
        document.getElementsByClassName("myProfileHeaderOptionsPostsOuterDiv")[0].style.borderBottom = "none"
        document.getElementsByClassName("myProfileHeaderOptionsFriendsOuterDiv")[0].style.borderBottom = "none"
        document.getElementsByClassName("myProfileHeaderOptionsPhotosOuterDiv")[0].style.borderBottom = "none"
    })

    $('.myProfileHeaderOptionsFriendsDiv').click(function () {
        document.getElementsByClassName("myProfileHeaderOptionsAbout")[0].style.color = "#65676B"
        document.getElementsByClassName("myProfileHeaderOptionsFriends")[0].style.color = "#1876F2"
        document.getElementsByClassName("myProfileHeaderOptionsPosts")[0].style.color = "#65676B"
        document.getElementsByClassName("myProfileHeaderOptionsPhotos")[0].style.color = "#65676B"

        $('.aboutOptionDiv').removeClass('hidden');
        $('.aboutSectionDiv').addClass('hidden');
        $('.aboutSectionRightFriendsDiv').removeClass('hidden');
        $('.aboutSectionRightPhotosDiv').addClass('hidden');

        document.getElementsByClassName("myProfileHeaderOptionsAboutOuterDiv")[0].style.borderBottom = "none"
        document.getElementsByClassName("myProfileHeaderOptionsPostsOuterDiv")[0].style.borderBottom = "none"
        document.getElementsByClassName("myProfileHeaderOptionsFriendsOuterDiv")[0].style.borderBottom = "3px solid #1876F2"
        document.getElementsByClassName("myProfileHeaderOptionsPhotosOuterDiv")[0].style.borderBottom = "none"

        $('.postOptionDiv').addClass('hidden');
    });

    $('.myProfileHeaderOptionsPhotosDiv').click(function () {
        document.getElementsByClassName("myProfileHeaderOptionsAbout")[0].style.color = "#65676B"
        document.getElementsByClassName("myProfileHeaderOptionsFriends")[0].style.color = "#65676B"
        document.getElementsByClassName("myProfileHeaderOptionsPosts")[0].style.color = "#65676B"
        document.getElementsByClassName("myProfileHeaderOptionsPhotos")[0].style.color = "#1876F2"

        $('.aboutOptionDiv').removeClass('hidden');
        $('.aboutSectionDiv').addClass('hidden');
        $('.aboutSectionRightFriendsDiv').addClass('hidden');
        $('.aboutSectionRightPhotosDiv').removeClass('hidden');

        document.getElementsByClassName("myProfileHeaderOptionsAboutOuterDiv")[0].style.borderBottom = "none"
        document.getElementsByClassName("myProfileHeaderOptionsPostsOuterDiv")[0].style.borderBottom = "none"
        document.getElementsByClassName("myProfileHeaderOptionsFriendsOuterDiv")[0].style.borderBottom = "none"
        document.getElementsByClassName("myProfileHeaderOptionsPhotosOuterDiv")[0].style.borderBottom = "3px solid #1876F2"

        $('.postOptionDiv').addClass('hidden');

    });

    $('.myProfileHeaderOptionsPostsDiv').click(function () {
        $('.postOptionDiv').removeClass('hidden');

        document.getElementsByClassName("myProfileHeaderOptionsAbout")[0].style.color = "#65676B"
        document.getElementsByClassName("myProfileHeaderOptionsFriends")[0].style.color = "#65676B"
        document.getElementsByClassName("myProfileHeaderOptionsPosts")[0].style.color = "#1876F2"
        document.getElementsByClassName("myProfileHeaderOptionsPhotos")[0].style.color = "#65676B"

        $('.aboutOptionDiv').addClass('hidden');

        document.getElementsByClassName("myProfileHeaderOptionsAboutOuterDiv")[0].style.borderBottom = "none"
        document.getElementsByClassName("myProfileHeaderOptionsPostsOuterDiv")[0].style.borderBottom = "3px solid #1876F2"
        document.getElementsByClassName("myProfileHeaderOptionsFriendsOuterDiv")[0].style.borderBottom = "none"
        document.getElementsByClassName("myProfileHeaderOptionsPhotosOuterDiv")[0].style.borderBottom = "none"
    });

    //method to get logged user details and display on profile page
    var value = {
        "email": $(location).attr('href').substr(35 + location.host.length).split('#')[0]
    }
    $.ajax({
        url: 'https://' + location.host + '/Profile/GetProfileDetails',
        method: 'Post',
        data: value,
        success: function (data) {
            document.getElementsByClassName("myProfileHeaderCoverImg")[0].src = "http://127.0.0.1:8080/" + data[0].coverImagePath.split('Uploads\\')[1];
            document.getElementsByClassName("myProfileHeaderProfileImg")[0].src = "http://127.0.0.1:8080/" + data[0].profileImagePath.split('Uploads\\')[1];
            document.getElementsByClassName("myProfileHeaderMyDetailsName")[0].textContent = data[0].firstName + " " + data[0].surname;
        },
        error: function (xhr, status, error) {
            alert("An error occurred: " + error);
        }
    })

    //method to display friends count on profile page
    var value = {
        "email": $(location).attr('href').substr(35 + location.host.length).split('#')[0]
    }
    $.ajax({
        url: 'https://' + location.host + '/Profile/GetFriendList',
        method: 'Post',
        data: value,
        success: function (data) {
            document.getElementsByClassName("myProfileHeaderMyDetailsFriendsCount")[0].textContent = data.length + " friends"
        },
        error: function (xhr, status, error) {
            alert("An error occurred: " + error);
        }
    });

    //method to display friends count inside friends section
    var value = {
        "email": $(location).attr('href').substr(35 + location.host.length).split('#')[0]
    }
    $.ajax({
        url: 'https://' + location.host + '/Profile/GetFriendList',
        method: 'Post',
        data: value,
        success: function (data) {
            document.getElementsByClassName("postOptionLeftFriendsCount")[0].textContent = data.length + " friends"
        },
        error: function (xhr, status, error) {
            alert("An error occurred: " + error);
        }
    });

    //method to get logged user details to populate multiple fields
    var value = {}
    $.ajax({
        url: 'https://' + location.host + '/Profile/GetProfileDetails',
        method: 'Post',
        data: value,
        success: function (data) {
            myEmail = data[0].email;

            //if profile is not of logged user
            if (myEmail != $(location).attr('href').substr(35 + location.host.length).split('#')[0]) {
                $('.myProfileHeaderProfileEditDiv').addClass('hidden');
                $('.myProfileHeaderProfileFrndAcceptedDiv').addClass('hidden');
                document.getElementsByClassName("myProfileHeaderCoverEditBtnDiv")[0].style.visibility = "hidden";
                document.getElementsByClassName("myProfileHeaderProfieUploadImg")[0].style.visibility = "hidden";
                document.getElementsByClassName("myProfileHeaderProfieUpload")[0].style.visibility = "hidden";
            }
            //if profile is of logged user
            else {
                $('.myProfileHeaderProfileCancelReqDiv').addClass('hidden');
                $('.myProfileHeaderProfileAddFriendDiv').addClass('hidden');
                $('.myProfileHeaderProfileEditDiv').removeClass('hidden');
                $('.myProfileHeaderProfileFrndAcceptedDiv').addClass('hidden');
                setTimeout(function () {
                    document.getElementsByClassName("myProfileHeaderCoverEditBtnDiv")[0].style.visibility = "visible";
                    document.getElementsByClassName("myProfileHeaderProfieUploadImg")[0].style.visibility = "visible";
                }, 10)
                document.getElementsByClassName("myProfileHeaderProfieUpload")[0].style.visibility = "visible";
                document.getElementsByClassName("myProfileHeaderProfileImg")[0].style.cursor = "pointer";
            }
        },
        error: function (xhr, status, error) {
            alert("An error occurred: " + error);
        }
    })

    //method to populate additional details (Overview) of user
    var value = {
        "email": $(location).attr('href').substr(35 + location.host.length).split('#')[0]
    }
    $.ajax({
        url: 'https://' + location.host + '/Profile/GetAdditionalDetails',
        method: 'Post',
        data: value,
        success: function (data) {
            if (data[0] == undefined || data[0].workInfo1 == null) {
                document.getElementsByClassName("aboutSectionRightOverviewWork1aSpan")[0].innerHTML = 'No workplace to show';
                $('.aboutSectionRightOverviewWork1bSpan').addClass('hidden');
                document.getElementsByClassName("aboutSectionRightOverviewWorkDiv")[0].style.height = "37px";
            }
            else {
                document.getElementsByClassName("aboutSectionRightOverviewWork1aSpan")[0].innerHTML = 'Worked at ' + '<b>' + data[0].workInfo1 + '<b>';
                document.getElementsByClassName("aboutSectionRightOverviewWork1bSpan")[0].textContent = data[0].workInfo2;
            }

            if (data[0] == undefined || data[0].collegeInfo == null) {
                document.getElementsByClassName("aboutSectionRightOverviewCollegeSpan")[0].innerHTML = 'No college to show';
                document.getElementsByClassName("aboutSectionRightOverviewCollegeDiv")[0].style.height = "37px";
            }
            else {
                document.getElementsByClassName("aboutSectionRightOverviewCollegeSpan")[0].innerHTML = 'Studied at ' + '<b>' + data[0].collegeInfo + '<b>';
            }

            if (data[0] == undefined || data[0].placeInfo == null) {
                document.getElementsByClassName("aboutSectionRightOverviewPlaceSpan")[0].innerHTML = 'No city to show';
                document.getElementsByClassName("aboutSectionRightOverviewPlaceDiv")[0].style.height = "37px";
            }
            else {
                document.getElementsByClassName("aboutSectionRightOverviewPlaceSpan")[0].innerHTML = 'From ' + '<b>' + data[0].placeInfo + '<b>';
            }

            if (data[0] == undefined || data[0].phoneInfo == null) {
                document.getElementsByClassName("aboutSectionRightOverviewContactSpan")[0].innerHTML = 'No phone number to show';
                document.getElementsByClassName("aboutSectionRightOverviewContactDiv")[0].style.height = "37px";
            }
            else {
                document.getElementsByClassName("aboutSectionRightOverviewContactSpan")[0].innerHTML = '<b>' + data[0].phoneInfo + '</b>';
            }
        },
        error: function (xhr, status, error) {
            alert("An error occurred: " + error);
        }
    })

    //method to populate additional details (Work, College, Place, Contact) of user
    var value = {
        "email": $(location).attr('href').substr(35 + location.host.length).split('#')[0]
    }
    $.ajax({
        url: 'https://' + location.host + '/Profile/GetAdditionalDetails',
        method: 'Post',
        data: value,
        success: function (data) {
            if (data[0] == undefined || data[0].workInfo1 == null) {
                document.getElementsByClassName("postOptionLeftWork1aSpan")[0].innerHTML = 'No workplace to show';
                $('.postOptionRightWork1bSpan').addClass('hidden');
                document.getElementsByClassName("postOptionLeftWorkDiv")[0].style.height = "37px";
            }
            else {
                document.getElementsByClassName("postOptionLeftWork1aSpan")[0].innerHTML = 'Worked at ' + '<b>' + data[0].workInfo1 + '<b>';
                document.getElementsByClassName("postOptionLeftWork1bSpan")[0].textContent = data[0].workInfo2;
            }

            if (data[0] == undefined || data[0].collegeInfo == null) {
                document.getElementsByClassName("postOptionLeftCollegeSpan")[0].innerHTML = 'No college to show';
                document.getElementsByClassName("postOptionLeftCollegeDiv")[0].style.height = "37px";
            }
            else {
                document.getElementsByClassName("postOptionLeftCollegeSpan")[0].innerHTML = 'Studied at ' + '<b>' + data[0].collegeInfo + '<b>';
            }

            if (data[0] == undefined || data[0].placeInfo == null) {
                document.getElementsByClassName("postOptionLeftPlaceSpan")[0].innerHTML = 'No city to show';
                document.getElementsByClassName("postOptionLeftPlaceDiv")[0].style.height = "37px";
            }
            else {
                document.getElementsByClassName("postOptionLeftPlaceSpan")[0].innerHTML = 'From ' + '<b>' + data[0].placeInfo + '<b>';
            }

            if (data[0] == undefined || data[0].phoneInfo == null) {
                document.getElementsByClassName("postOptionLeftContactSpan")[0].innerHTML = 'No phone number to show';
                document.getElementsByClassName("postOptionLeftContactDiv")[0].style.height = "37px";
            }
            else {
                document.getElementsByClassName("postOptionLeftContactSpan")[0].innerHTML = '<b>' + data[0].phoneInfo + '</b>';
            }
        },
        error: function (xhr, status, error) {
            alert("An error occurred: " + error);
        }
    })

    //page to display when request is sent to a user
    var value = {
        "toRequest": $(location).attr('href').substr(35 + location.host.length).split('#')[0]
    }
    $.ajax({
        url: 'https://' + location.host + '/Profile/IsReqSent',
        method: 'Post',
        data: value,
        success: function (data) {
            if (data == "Yes") {
                $('.myProfileHeaderProfileAddEditDiv').removeClass('hidden');
                $('.myProfileHeaderProfileCancelReqDiv').removeClass('hidden');
                $('.myProfileHeaderProfileAddFriendDiv').addClass('hidden');
                $('.myProfileHeaderProfileFrndAcceptedDiv').addClass('hidden');
                $('.myProfileHeaderProfileEditDiv').addClass('hidden');
            }
            else if (myEmail == $(location).attr('href').substr(35 + location.host.length).split('#')[0]) {
                $('.myProfileHeaderProfileCancelReqDiv').addClass('hidden');
                $('.myProfileHeaderProfileAddFriendDiv').addClass('hidden');
                $('.myProfileHeaderProfileFrndAcceptedDiv').addClass('hidden');
                $('.myProfileHeaderProfileEditDiv').removeClass('hidden');
            }
            else {
                $('.myProfileHeaderProfileCancelReqDiv').addClass('hidden');
                $('.myProfileHeaderProfileAddEditDiv').removeClass('hidden');
                $('.myProfileHeaderProfileAddFriendDiv').removeClass('hidden');
                $('.myProfileHeaderProfileFrndAcceptedDiv').addClass('hidden');
                $('.myProfileHeaderProfileEditDiv').addClass('hidden');
            }
        },
        error: function (xhr, status, error) {
            alert("An error occurred: " + error);
        }
    })

    //page to display when user is a friend
    var value = {
        "toRequest": $(location).attr('href').substr(35 + location.host.length).split('#')[0]
    }
    $.ajax({
        url: 'https://' + location.host + '/Profile/IsFriend',
        method: 'Post',
        data: value,
        success: function (data) {
            if (data == "Yes") {
                $('.myProfileHeaderProfileCancelReqDiv').addClass('hidden');
                $('.myProfileHeaderProfileAddFriendDiv').addClass('hidden');
                $('.myProfileHeaderProfileAddEditDiv').removeClass('hidden');
                $('.myProfileHeaderProfileFrndAcceptedDiv').removeClass('hidden');
                $('.myProfileHeaderProfileEditDiv').addClass('hidden');
            }
            else if (myEmail == $(location).attr('href').substr(35 + location.host.length).split('#')[0]) {
                $('.myProfileHeaderProfileCancelReqDiv').addClass('hidden');
                $('.myProfileHeaderProfileAddFriendDiv').addClass('hidden');
                $('.myProfileHeaderProfileFrndAcceptedDiv').addClass('hidden');
                $('.myProfileHeaderProfileEditDiv').removeClass('hidden');
            }
            else {
                $('.myProfileHeaderProfileFrndAcceptedDiv').addClass('hidden');
            }
        },
        error: function (xhr, status, error) {
            alert("An error occurred: " + error);
        }
    })

    //method to populate friends when friends tab is clicked 
    var result = '';
    var value = {
        "email": $(location).attr('href').substr(35 + location.host.length).split('#')[0]
    }
    $.ajax({
        url: 'https://' + location.host + '/Profile/GetFriendList',
        method: 'Post',
        data: value,
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var email;
                if (data[i].fromRequest == $(location).attr('href').substr(35 + location.host.length).split('#')[0]) {
                    email = data[i].toRequest
                }
                else {
                    email = data[i].fromRequest
                }
                var value = {
                    "email": email
                }
                $.ajax({
                    url: 'https://' + location.host + '/Profile/GetProfileDetails',
                    method: 'Post',
                    data: value,
                    success: function (data1) {
                        result = result + '<div class="frndAcc" id="' + data1[0].email + '" onclick=\'window.location.href="/Profile/ProfileData?email=' + email + '"\'><div class="frndAccImgDiv"><img class="frndAccImg" src="http://127.0.0.1:8080/' + data1[0].profileImagePath.split('Uploads\\')[1] + '"/></div><div class="frndAccNameDiv"><span class="frndAccName">' + data1[0].firstName + ' ' + data1[0].surname + '</span></div></div > '
                    },
                    error: function (xhr, status, error) {
                        alert("An error occurred: " + error);
                    }
                });
            }
            document.getElementsByClassName("aboutSectionRightFriendsListDiv")[0].innerHTML = result;
        },
        error: function (xhr, status, error) {
            alert("An error occurred: " + error);
        }
    });

    //method to populate friends when posts tab is clicked 
    var result = '';
    var value = {
        "email": $(location).attr('href').substr(35 + location.host.length).split('#')[0]
    }
    $.ajax({
        url: 'https://' + location.host + '/Profile/GetFriendList',
        method: 'Post',
        data: value,
        success: function (data) {
            var len = 0;
            if (data.length > 6) {
                len = 6;
            }
            else {
                len = data.length
            }
            for (var i = 0; i < len; i++) {
                var email;
                if (data[i].fromRequest == $(location).attr('href').substr(35 + location.host.length).split('#')[0]) {
                    email = data[i].toRequest
                }
                else {
                    email = data[i].fromRequest
                }
                var value = {
                    "email": email
                }
                $.ajax({
                    url: 'https://' + location.host + '/Profile/GetProfileDetails',
                    method: 'Post',
                    data: value,
                    success: function (data1) {
                        result = result + '<div class="frndAccPost" id="' + data1[0].email + '" onclick=\'window.location.href="/Profile/ProfileData?email=' + email + '"\'><div class="frndAccPostImgDiv"><img class="frndAccPostImg" src="http://127.0.0.1:8080/' + data1[0].profileImagePath.split('Uploads\\')[1] + '"/></div><div class="frndAccPostNameDiv"><span class="frndAccPostName">' + data1[0].firstName + ' ' + data1[0].surname + '</span></div></div > '
                    },
                    error: function (xhr, status, error) {
                        alert("An error occurred: " + error);
                    }
                });
            }
            document.getElementsByClassName("postOptionLeftFriendsListDiv")[0].innerHTML = result;
        },
        error: function (xhr, status, error) {
            alert("An error occurred: " + error);
        }
    });

    $(".aboutSectionRightFriendsHeaderFrndReqDiv").click(function () {
        window.location.href = '/Profile/Friends?email=' + $(location).attr('href').substr(35 + location.host.length).split('#')[0];
    });

    //method to populate posts when about tab is clicked 
    var result = '';
    var value = {
        "email": $(location).attr('href').substr(35 + location.host.length).split('#')[0]
    }
    $.ajax({
        url: 'https://' + location.host + '/Profile/GetPostsList',
        method: 'Post',
        data: value,
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                result = result + '<div class="ImgDiv"><img class="myPhotos" src="http://127.0.0.1:8080/' + data[i].imagepath.split('Uploads\\')[1] + '"/></div>';
            }
            document.getElementsByClassName("aboutSectionRightPhotosListDiv")[0].innerHTML = result;
        },
        error: function (xhr, status, error) {
            alert("An error occurred: " + error);
        }
    });

    //method to populate posts when photos tab is clicked 
    var result = '';
    var value = {
        "email": $(location).attr('href').substr(35 + location.host.length).split('#')[0]
    }
    $.ajax({
        url: 'https://' + location.host + '/Profile/GetPostsList',
        method: 'Post',
        data: value,
        success: function (data) {
            var len = 0;
            if (data.length > 6) {
                len = 6;
            }
            else {
                len = data.length
            }
            for (var i = 0; i < len; i++) {
                result = result + '<div class="ImgDiv"><img class="myPhotosPost" src="http://127.0.0.1:8080/' + data[i].imagepath.split('Uploads\\')[1] + '"/></div>';
            }
            document.getElementsByClassName("postOptionLeftPhotosListDiv")[0].innerHTML = result;
        },
        error: function (xhr, status, error) {
            alert("An error occurred: " + error);
        }
    });

    //methods to be executed when each of the button is clicked
    $('.myProfileHeaderProfileAddFriendDiv, .myProfileHeaderProfileCancelReqDiv').click(function () {
        var value = {
            "fromRequest": myEmail,
            "toRequest": $(location).attr('href').substr(35 + location.host.length).split('#')[0]
        }
        $.ajax({
            url: 'https://' + location.host + '/Profile/SendRequest',
            method: 'Post',
            data: value,
            success: function (data) {
                if ($('.myProfileHeaderProfileCancelReqDiv').hasClass('hidden')) {
                    $('.myProfileHeaderProfileAddEditDiv').removeClass('hidden');
                    $('.myProfileHeaderProfileCancelReqDiv').removeClass('hidden');
                    $('.myProfileHeaderProfileAddFriendDiv').addClass('hidden');
                }
                else {
                    $('.myProfileHeaderProfileCancelReqDiv').addClass('hidden');
                    $('.myProfileHeaderProfileAddEditDiv').removeClass('hidden');
                    $('.myProfileHeaderProfileAddFriendDiv').removeClass('hidden');
                }
            },
            error: function (xhr, status, error) {
                alert("An error occurred: " + error);
            }
        })
    })

    $('.postOptionLeftPhotosHeaderAllPhotosDiv').click(function () {
        document.getElementsByClassName("myProfileHeaderOptionsPhotosDiv")[0].click();
    });

    $('.postOptionLeftFriendsHeaderAllFrndDiv').click(function () {
        document.getElementsByClassName("myProfileHeaderOptionsFriendsDiv")[0].click();
    });

    $('.aboutSectionLeftOverview').click(function () {
        document.getElementsByClassName("aboutSectionLeftOverview")[0].style.color = "#1876F2"
        document.getElementsByClassName("aboutSectionLeftOverview")[0].style.backgroundColor = "#EFF3FF";

        document.getElementsByClassName("aboutSectionLeftWork")[0].style.color = "#65676B"
        document.getElementsByClassName("aboutSectionLeftWork")[0].style.backgroundColor = "transparent"

        document.getElementsByClassName("aboutSectionLeftPlace")[0].style.color = "#65676B"
        document.getElementsByClassName("aboutSectionLeftPlace")[0].style.backgroundColor = "transparent"

        document.getElementsByClassName("aboutSectionLeftContact")[0].style.color = "#65676B"
        document.getElementsByClassName("aboutSectionLeftContact")[0].style.backgroundColor = "transparent"

        document.getElementsByClassName("aboutSectionLeftFamily")[0].style.color = "#65676B"
        document.getElementsByClassName("aboutSectionLeftFamily")[0].style.backgroundColor = "transparent"

        $('.aboutSectionRightWorkDiv').addClass('hidden');
        $('.aboutSectionRightPlaceDiv').addClass('hidden');
        $('.aboutSectionRightContactDiv').addClass('hidden');
        $('.aboutSectionRightFamilyDiv').addClass('hidden');
        $('.aboutSectionRightOverviewDiv').removeClass('hidden');

        var value = {
            "email": $(location).attr('href').substr(35 + location.host.length).split('#')[0]
        }
        $.ajax({
            url: 'https://' + location.host + '/Profile/GetAdditionalDetails',
            method: 'Post',
            data: value,
            success: function (data) {
                if (data[0] == undefined || data[0].workInfo1 == null) {
                    document.getElementsByClassName("aboutSectionRightOverviewWork1aSpan")[0].innerHTML = 'No workplace to show';
                    $('.aboutSectionRightOverviewWork1bSpan').addClass('hidden');
                    document.getElementsByClassName("aboutSectionRightOverviewWorkDiv")[0].style.height = "37px";
                }
                else {
                    document.getElementsByClassName("aboutSectionRightOverviewWork1aSpan")[0].innerHTML = 'Worked at ' + '<b>' + data[0].workInfo1 + '<b>';
                    document.getElementsByClassName("aboutSectionRightOverviewWork1bSpan")[0].textContent = data[0].workInfo2;
                }

                if (data[0] == undefined || data[0].collegeInfo == null) {
                    document.getElementsByClassName("aboutSectionRightOverviewCollegeSpan")[0].innerHTML = 'No college to show';
                    document.getElementsByClassName("aboutSectionRightOverviewCollegeDiv")[0].style.height = "37px";
                }
                else {
                    document.getElementsByClassName("aboutSectionRightOverviewCollegeSpan")[0].innerHTML = 'Studied at ' + '<b>' + data[0].collegeInfo + '<b>';
                }

                if (data[0] == undefined || data[0].placeInfo == null) {
                    document.getElementsByClassName("aboutSectionRightOverviewPlaceSpan")[0].innerHTML = 'No city to show';
                    document.getElementsByClassName("aboutSectionRightOverviewPlaceDiv")[0].style.height = "37px";
                }
                else {
                    document.getElementsByClassName("aboutSectionRightOverviewPlaceSpan")[0].innerHTML = 'From ' + '<b>' + data[0].placeInfo + '<b>';
                }

                if (data[0] == undefined || data[0].phoneInfo == null) {
                    document.getElementsByClassName("aboutSectionRightOverviewContactSpan")[0].innerHTML = 'No phone number to show';
                    document.getElementsByClassName("aboutSectionRightOverviewContactDiv")[0].style.height = "37px";
                }
                else {
                    document.getElementsByClassName("aboutSectionRightOverviewContactSpan")[0].innerHTML = '<b>' + data[0].phoneInfo + '</b>';
                }
            },
            error: function (xhr, status, error) {
                alert("An error occurred: " + error);
            }
        })
    });

    //----------------------------------------------------------------------------------------

    $('.aboutSectionLeftWork').click(function () {
        document.getElementsByClassName("aboutSectionLeftOverview")[0].style.color = "#65676B"
        document.getElementsByClassName("aboutSectionLeftOverview")[0].style.backgroundColor = "transparent";

        document.getElementsByClassName("aboutSectionLeftWork")[0].style.color = "#1876F2"
        document.getElementsByClassName("aboutSectionLeftWork")[0].style.backgroundColor = "#EFF3FF"

        document.getElementsByClassName("aboutSectionLeftPlace")[0].style.color = "#65676B"
        document.getElementsByClassName("aboutSectionLeftPlace")[0].style.backgroundColor = "transparent"

        document.getElementsByClassName("aboutSectionLeftContact")[0].style.color = "#65676B"
        document.getElementsByClassName("aboutSectionLeftContact")[0].style.backgroundColor = "transparent"

        document.getElementsByClassName("aboutSectionLeftFamily")[0].style.color = "#65676B"
        document.getElementsByClassName("aboutSectionLeftFamily")[0].style.backgroundColor = "transparent"

        $('.aboutSectionRightPlaceDiv').addClass('hidden');
        $('.aboutSectionRightContactDiv').addClass('hidden');
        $('.aboutSectionRightFamilyDiv').addClass('hidden');
        $('.aboutSectionRightOverviewDiv').addClass('hidden');
        $('.aboutSectionRightWorkDiv').removeClass('hidden');
        $('.aboutSectionRightWorkAddInput1Div').addClass('hidden');
        $('.aboutSectionRightWorkAddInput2Div').addClass('hidden');
        $('.aboutSectionRightWorkAddInput3Div').addClass('hidden');

        if (myEmail != $(location).attr('href').substr(35 + location.host.length).split('#')[0]) {
            $('.aboutSectionRightWorkAddDiv1').addClass('hidden');
            $('.aboutSectionRightWorkAddDiv2').addClass('hidden');
            $('.aboutSectionRightWorkAddDiv3').addClass('hidden');
        }
        else {
            $('.aboutSectionRightWorkAddDiv1').removeClass('hidden');

        }

        var value = {
            "email": $(location).attr('href').substr(35 + location.host.length).split('#')[0]
        }
        $.ajax({
            url: 'https://' + location.host + '/Profile/GetAdditionalDetails',
            method: 'Post',
            data: value,
            success: function (data) {
                if (data[0] == undefined || data[0].workInfo1 == null) {
                    document.getElementsByClassName("aboutSectionRightWorkResult1aSpan")[0].innerHTML = 'No workplace to show';
                    $('.aboutSectionRightWorkResult1bSpan').addClass('hidden');
                    document.getElementsByClassName("aboutSectionRightWorkResultDiv1")[0].style.height = "35px";
                }
                else {
                    document.getElementsByClassName("aboutSectionRightWorkResult1aSpan")[0].innerHTML = 'Worked at ' + '<b>' + data[0].workInfo1 + '<b>';
                    document.getElementsByClassName("aboutSectionRightWorkResult1bSpan")[0].textContent = data[0].workInfo2;
                    /*document.getElementsByClassName("aboutSectionRightWorkResult1cSpan")[0].textContent = data[0].workInfo3;*/
                    /*document.getElementsByClassName("aboutSectionRightWorkResultDiv1")[0].style.display = "block";*/
                }

                if (data[0] == undefined || data[0].collegeInfo == null) {
                    document.getElementsByClassName("aboutSectionRightWorkResult2aSpan")[0].innerHTML = 'No college to show';
                }
                else {
                    document.getElementsByClassName("aboutSectionRightWorkResult2aSpan")[0].innerHTML = 'Studied at ' + '<b>' + data[0].collegeInfo + '<b>';
                }

                if (data[0] == undefined || data[0].schoolInfo == null) {
                    document.getElementsByClassName("aboutSectionRightWorkResult3aSpan")[0].innerHTML = 'No school to show';
                }
                else {
                    document.getElementsByClassName("aboutSectionRightWorkResult3aSpan")[0].innerHTML = 'Went at ' + '<b>' + data[0].schoolInfo + '<b>';
                }
            },
            error: function (xhr, status, error) {
                alert("An error occurred: " + error);
            }
        })
    });

    $('.aboutSectionRightWorkAddDiv1').click(function () {
        $('.aboutSectionRightWorkAddInput1Div').removeClass('hidden');
        $('.aboutSectionRightWorkAddDiv1').addClass('hidden');
    })

    $('.aboutSectionRightWorkAddInput1a').click(function () {
        $('.aboutSectionRightWorkAddInput1Div').addClass('hidden');
        $('.aboutSectionRightWorkAddDiv1').addClass('hidden');
    })

    $('.aboutSectionRightWorkAddInput1b').click(function () {
        var value = {
            "i1": $('.aboutSectionRightWorkAddInput11')[0].value,
            "i2": $('.aboutSectionRightWorkAddInput12')[0].value,
            "i3": $('.aboutSectionRightWorkAddInput13')[0].value
        }
        $.ajax({
            url: 'https://' + location.host + '/Profile/AddAdditionalDetails',
            method: 'Post',
            data: value,
            success: function (data) {
            },
            error: function (xhr, status, error) {
                alert("An error occurred: " + error);
            }
        })

        $('.aboutSectionRightWorkAddInput11')[0].value = "";
        $('.aboutSectionRightWorkAddInput12')[0].value = "";
        $('.aboutSectionRightWorkAddInput13')[0].value = "";
        $('.aboutSectionRightWorkAddInput1Div').addClass('hidden');
        $('.aboutSectionRightWorkAddDiv1').removeClass('hidden');

        setTimeout(function () {
            var value = {
                "email": $(location).attr('href').substr(35 + location.host.length).split('#')[0]
            }
            $.ajax({
                url: 'https://' + location.host + '/Profile/GetAdditionalDetails',
                method: 'Post',
                data: value,
                success: function (data) {
                    if (data[0].workInfo1 != null) {
                        document.getElementsByClassName("aboutSectionRightWorkResult1aSpan")[0].innerHTML = 'Worked at ' + '<b>' + data[0].workInfo1 + '<b>';
                        document.getElementsByClassName("aboutSectionRightWorkResult1bSpan")[0].textContent = data[0].workInfo2;
                        /*document.getElementsByClassName("aboutSectionRightWorkResult1cSpan")[0].textContent = data[0].workInfo3;*/
                        document.getElementsByClassName("aboutSectionRightWorkResultDiv1")[0].style.display = "block";
                    }
                },
                error: function (xhr, status, error) {
                    alert("An error occurred: " + error);
                }
            })
        }, 500);
    })

    $('.aboutSectionRightWorkAddDiv2').click(function () {
        $('.aboutSectionRightWorkAddInput2Div').removeClass('hidden');
        $('.aboutSectionRightWorkAddDiv2').addClass('hidden');
    })

    $('.aboutSectionRightWorkAddInput2a').click(function () {
        $('.aboutSectionRightWorkAddInput2Div').addClass('hidden');
        $('.aboutSectionRightWorkAddDiv2').removeClass('hidden');
    })

    $('.aboutSectionRightWorkAddInput2b').click(function () {

        var value = {
            "type": "College",
            "i1": $('.aboutSectionRightWorkAddInput2')[0].value,
        }
        $.ajax({
            url: 'https://' + location.host + '/Profile/AddAdditionalDetailsNew',
            method: 'Post',
            data: value,
            success: function (data) {

            },
            error: function (xhr, status, error) {
                alert("An error occurred: " + error);
            }
        })
        $('.aboutSectionRightWorkAddInput2')[0].value = "";
        $('.aboutSectionRightWorkAddInput2Div').addClass('hidden');
        $('.aboutSectionRightWorkAddDiv2').removeClass('hidden');

        setTimeout(function () {
            var value = {
                "email": $(location).attr('href').substr(35 + location.host.length).split('#')[0]
            }
            $.ajax({
                url: 'https://' + location.host + '/Profile/GetAdditionalDetails',
                method: 'Post',
                data: value,
                success: function (data) {
                    if (data[0].collegeInfo != null) {
                        document.getElementsByClassName("aboutSectionRightWorkResult2aSpan")[0].innerHTML = 'Studied at ' + '<b>' + data[0].collegeInfo + '<b>';
                        document.getElementsByClassName("aboutSectionRightWorkResultDiv2")[0].style.display = "block";
                    }
                },
                error: function (xhr, status, error) {
                    alert("An error occurred: " + error);
                }
            })
        }, 500);
    })

    $('.aboutSectionRightWorkAddDiv3').click(function () {
        $('.aboutSectionRightWorkAddInput3Div').removeClass('hidden');
        $('.aboutSectionRightWorkAddDiv3').addClass('hidden');
    })

    $('.aboutSectionRightWorkAddInput3a').click(function () {
        $('.aboutSectionRightWorkAddInput3Div').addClass('hidden');
        $('.aboutSectionRightWorkAddDiv3').removeClass('hidden');
    })

    $('.aboutSectionRightWorkAddInput3b').click(function () {

        var value = {
            "type": "School",
            "i1": $('.aboutSectionRightWorkAddInput3')[0].value,
        }
        $.ajax({
            url: 'https://' + location.host + '/Profile/AddAdditionalDetailsNew',
            method: 'Post',
            data: value,
            success: function (data) {

            },
            error: function (xhr, status, error) {
                alert("An error occurred: " + error);
            }
        })
        $('.aboutSectionRightWorkAddInput3')[0].value = "";
        $('.aboutSectionRightWorkAddInput3Div').addClass('hidden');
        $('.aboutSectionRightWorkAddDiv3').removeClass('hidden');

        setTimeout(function () {
            var value = {
                "email": $(location).attr('href').substr(35 + location.host.length).split('#')[0]
            }
            $.ajax({
                url: 'https://' + location.host + '/Profile/GetAdditionalDetails',
                method: 'Post',
                data: value,
                success: function (data) {
                    if (data[0].schoolInfo != null) {
                        document.getElementsByClassName("aboutSectionRightWorkResult3aSpan")[0].innerHTML = 'Went at ' + '<b>' + data[0].schoolInfo + '<b>';
                        document.getElementsByClassName("aboutSectionRightWorkResultDiv3")[0].style.display = "block";
                    }
                },
                error: function (xhr, status, error) {
                    alert("An error occurred: " + error);
                }
            })
        }, 500);
    })

    //--------------------------------------------------------------------------------------------

    $('.aboutSectionLeftPlace').click(function () {
        document.getElementsByClassName("aboutSectionLeftOverview")[0].style.color = "#65676B"
        document.getElementsByClassName("aboutSectionLeftOverview")[0].style.backgroundColor = "#transparent";

        document.getElementsByClassName("aboutSectionLeftWork")[0].style.color = "#65676B"
        document.getElementsByClassName("aboutSectionLeftWork")[0].style.backgroundColor = "transparent"

        document.getElementsByClassName("aboutSectionLeftPlace")[0].style.color = "#1876F2"
        document.getElementsByClassName("aboutSectionLeftPlace")[0].style.backgroundColor = "#EFF3FF"

        document.getElementsByClassName("aboutSectionLeftContact")[0].style.color = "#65676B"
        document.getElementsByClassName("aboutSectionLeftContact")[0].style.backgroundColor = "transparent"

        document.getElementsByClassName("aboutSectionLeftFamily")[0].style.color = "#65676B"
        document.getElementsByClassName("aboutSectionLeftFamily")[0].style.backgroundColor = "transparent"

        $('.aboutSectionRightContactDiv').addClass('hidden');
        $('.aboutSectionRightFamilyDiv').addClass('hidden');
        $('.aboutSectionRightOverviewDiv').addClass('hidden');
        $('.aboutSectionRightWorkDiv').addClass('hidden');
        $('.aboutSectionRightPlaceDiv').removeClass('hidden');
        $('.aboutSectionRightPlaceAddInput1Div').addClass('hidden');

        if (myEmail != $(location).attr('href').substr(35 + location.host.length).split('#')[0]) {
            $('.aboutSectionRightPlaceAddDiv').addClass('hidden');
        }
        else {
            $('.aboutSectionRightPlaceAddDiv').removeClass('hidden');
        }

        var value = {
            "email": $(location).attr('href').substr(35 + location.host.length).split('#')[0]
        }
        $.ajax({
            url: 'https://' + location.host + '/Profile/GetAdditionalDetails',
            method: 'Post',
            data: value,
            success: function (data) {
                if (data[0] == undefined || data[0].placeInfo == null) {
                    document.getElementsByClassName("aboutSectionRightPlaceResult1aSpan")[0].innerHTML = 'No city to show';
                }
                else {
                    document.getElementsByClassName("aboutSectionRightPlaceResult1aSpan")[0].innerHTML = 'From ' + '<b>' + data[0].placeInfo + '<b>';
                }
            },
            error: function (xhr, status, error) {
                alert("An error occurred: " + error);
            }
        })
    });

    $('.aboutSectionRightPlaceAddDiv').click(function () {
        $('.aboutSectionRightPlaceAddInput1Div').removeClass('hidden');
        $('.aboutSectionRightPlaceAddDiv').addClass('hidden');
    })

    $('.aboutSectionRightPlaceAddInput1a').click(function () {
        $('.aboutSectionRightPlaceAddInput1Div').addClass('hidden');
        $('.aboutSectionRightPlaceAddDiv').removeClass('hidden');
    })

    $('.aboutSectionRightPlaceAddInput1b').click(function () {

        var value = {
            "type": "City",
            "i1": $('.aboutSectionRightPlaceAddInput1')[0].value,
        }
        $.ajax({
            url: 'https://' + location.host + '/Profile/AddAdditionalDetailsNew',
            method: 'Post',
            data: value,
            success: function (data) {

            },
            error: function (xhr, status, error) {
                alert("An error occurred: " + error);
            }
        })
        $('.aboutSectionRightPlaceAddInput1')[0].value = "";
        $('.aboutSectionRightPlaceAddInput1Div').addClass('hidden');
        $('.aboutSectionRightPlaceAddDiv').removeClass('hidden');

        setTimeout(function () {
            var value = {
                "email": $(location).attr('href').substr(35 + location.host.length).split('#')[0]
            }
            $.ajax({
                url: 'https://' + location.host + '/Profile/GetAdditionalDetails',
                method: 'Post',
                data: value,
                success: function (data) {
                    if (data[0].placeInfo != null) {
                        document.getElementsByClassName("aboutSectionRightPlaceResult1aSpan")[0].innerHTML = 'From ' + '<b>' + data[0].placeInfo + '<b>';
                        document.getElementsByClassName("aboutSectionRightPlaceResultDiv1")[0].style.display = "block";
                    }
                },
                error: function (xhr, status, error) {
                    alert("An error occurred: " + error);
                }
            })
        }, 500);
    })

    //--------------------------------------------------------------------------------------------

    $('.aboutSectionLeftContact').click(function () {
        document.getElementsByClassName("aboutSectionLeftOverview")[0].style.color = "#65676B"
        document.getElementsByClassName("aboutSectionLeftOverview")[0].style.backgroundColor = "transparent";

        document.getElementsByClassName("aboutSectionLeftWork")[0].style.color = "#65676B"
        document.getElementsByClassName("aboutSectionLeftWork")[0].style.backgroundColor = "transparent"

        document.getElementsByClassName("aboutSectionLeftPlace")[0].style.color = "#65676B"
        document.getElementsByClassName("aboutSectionLeftPlace")[0].style.backgroundColor = "transparent"

        document.getElementsByClassName("aboutSectionLeftContact")[0].style.color = "#1876F2"
        document.getElementsByClassName("aboutSectionLeftContact")[0].style.backgroundColor = "#EFF3FF"

        document.getElementsByClassName("aboutSectionLeftFamily")[0].style.color = "#65676B"
        document.getElementsByClassName("aboutSectionLeftFamily")[0].style.backgroundColor = "transparent"

        $('.aboutSectionRightFamilyDiv').addClass('hidden');
        $('.aboutSectionRightOverviewDiv').addClass('hidden');
        $('.aboutSectionRightWorkDiv').addClass('hidden');
        $('.aboutSectionRightPlaceDiv').addClass('hidden');
        $('.aboutSectionRightContactDiv').removeClass('hidden');
        $('.aboutSectionRightContactAddInput1Div').addClass('hidden');
        $('.aboutSectionRightContactAddInput2Div').addClass('hidden');

        if (myEmail != $(location).attr('href').substr(35 + location.host.length).split('#')[0]) {
            $('.aboutSectionRightContactAddDiv1').addClass('hidden');
        }
        else {
            $('.aboutSectionRightContactAddDiv1').removeClass('hidden');
        }

        var value = {
            "email": $(location).attr('href').substr(35 + location.host.length).split('#')[0]
        }
        $.ajax({
            url: 'https://' + location.host + '/Profile/GetProfileDetails',
            method: 'Post',
            data: value,
            success: function (data) {
                if (data[0].gender == "Male") {
                    $('.aboutSectionRightContactGenderMaleDiv').removeClass('hidden');
                    $('.aboutSectionRightContactGenderFemaleDiv').addClass('hidden');
                }
                else {
                    $('.aboutSectionRightContactGenderMaleDiv').addClass('hidden');
                    $('.aboutSectionRightContactGenderFemaleDiv').removeClass('hidden');
                }

                document.getElementsByClassName("aboutSectionRightContactDOB1aSpan")[0].innerHTML = data[0].dobDate + ' ' + data[0].dobMon;
            },
            error: function (xhr, status, error) {
                alert("An error occurred: " + error);
            }
        })

        var value = {
            "email": $(location).attr('href').substr(35 + location.host.length).split('#')[0]
        }
        $.ajax({
            url: 'https://' + location.host + '/Profile/GetAdditionalDetails',
            method: 'Post',
            data: value,
            success: function (data) {
                if (data[0] == undefined || data[0].phoneInfo == null) {
                    document.getElementsByClassName("aboutSectionRightContactResult1aSpan")[0].innerHTML = 'No phone number to show';
                }
                else {
                    document.getElementsByClassName("aboutSectionRightContactResult1aSpan")[0].innerHTML = '<b>' + data[0].phoneInfo + '</b>';
                }
            },
            error: function (xhr, status, error) {
                alert("An error occurred: " + error);
            }
        })
    });

    $('.aboutSectionRightContactAddDiv1').click(function () {
        $('.aboutSectionRightContactAddInput1Div').removeClass('hidden');
        $('.aboutSectionRightContactAddDiv1').addClass('hidden');
    })

    $('.aboutSectionRightContactAddInput1a').click(function () {
        $('.aboutSectionRightContactAddInput1Div').addClass('hidden');
        $('.aboutSectionRightContactAddDiv1').removeClass('hidden');
    })

    $('.aboutSectionRightContactAddInput1b').click(function () {

        var value = {
            "type": "Contact",
            "i1": $('.aboutSectionRightContactAddInput1')[0].value,
        }
        $.ajax({
            url: 'https://' + location.host + '/Profile/AddAdditionalDetailsNew',
            method: 'Post',
            data: value,
            success: function (data) {

            },
            error: function (xhr, status, error) {
                alert("An error occurred: " + error);
            }
        })
        $('.aboutSectionRightContactAddInput1')[0].value = "";
        $('.aboutSectionRightContactAddInput1Div').addClass('hidden');
        $('.aboutSectionRightContactAddDiv1').removeClass('hidden');

        setTimeout(function () {
            var value = {
                "email": $(location).attr('href').substr(35 + location.host.length).split('#')[0]
            }
            $.ajax({
                url: 'https://' + location.host + '/Profile/GetAdditionalDetails',
                method: 'Post',
                data: value,
                success: function (data) {
                    if (data[0].phoneInfo != null) {
                        document.getElementsByClassName("aboutSectionRightContactResult1aSpan")[0].innerHTML = '<b>' + data[0].phoneInfo + '</b>';
                        document.getElementsByClassName("aboutSectionRightContactResultDiv1")[0].style.display = "block";
                    }
                },
                error: function (xhr, status, error) {
                    alert("An error occurred: " + error);
                }
            })
        }, 500);
    })

    $('.aboutSectionRightContactAddDiv2').click(function () {
        $('.aboutSectionRightContactAddInput2Div').removeClass('hidden');
        $('.aboutSectionRightContactAddDiv2').addClass('hidden');
    })

    $('.aboutSectionRightContactAddInput2a').click(function () {
        $('.aboutSectionRightContactAddInput2Div').addClass('hidden');
        $('.aboutSectionRightContactAddDiv2').removeClass('hidden');
    })

    $('.aboutSectionRightContactAddInput2b').click(function () {

        var value = {
            "type": "Website",
            "i1": $('.aboutSectionRightContactAddInput2')[0].value,
        }
        $.ajax({
            url: 'https://' + location.host + '/Profile/AddAdditionalDetailsNew',
            method: 'Post',
            data: value,
            success: function (data) {

            },
            error: function (xhr, status, error) {
                alert("An error occurred: " + error);
            }
        })
        $('.aboutSectionRightContactAddInput2')[0].value = "";
    })

    //--------------------------------------------------------------------------------------------

    $('.aboutSectionLeftFamily').click(function () {
        document.getElementsByClassName("aboutSectionLeftOverview")[0].style.color = "#65676B"
        document.getElementsByClassName("aboutSectionLeftOverview")[0].style.backgroundColor = "transparent";

        document.getElementsByClassName("aboutSectionLeftWork")[0].style.color = "#65676B"
        document.getElementsByClassName("aboutSectionLeftWork")[0].style.backgroundColor = "transparent"

        document.getElementsByClassName("aboutSectionLeftPlace")[0].style.color = "#65676B"
        document.getElementsByClassName("aboutSectionLeftPlace")[0].style.backgroundColor = "transparent"

        document.getElementsByClassName("aboutSectionLeftContact")[0].style.color = "#65676B"
        document.getElementsByClassName("aboutSectionLeftContact")[0].style.backgroundColor = "transparent"

        document.getElementsByClassName("aboutSectionLeftFamily")[0].style.color = "#1876F2"
        document.getElementsByClassName("aboutSectionLeftFamily")[0].style.backgroundColor = "#EFF3FF"

        $('.aboutSectionRightOverviewDiv').addClass('hidden');
        $('.aboutSectionRightWorkDiv').addClass('hidden');
        $('.aboutSectionRightPlaceDiv').addClass('hidden');
        $('.aboutSectionRightContactDiv').addClass('hidden');
        $('.aboutSectionRightFamilyDiv').removeClass('hidden');
    });

    //------------------------------------------------------------------------------------------------

    //populates the each of the posts and its details in post tab
    var value = {
        "email": $(location).attr('href').substr(35 + location.host.length).split('#')[0]
    }
    $.ajax({
        url: 'https://' + location.host + '/Profile/GetPostsList',
        method: 'Post',
        data: value,
        success: function (data) {
            data.sort((a, b) => new Date(b.date) - new Date(a.date));
            for (var i = 0; i < data.length; i++) {
                const postDiv = document.createElement("div");
                postDiv.id = data[i].postId
                result = '<div class="myPost"><div class="myPostDetails"><div class="myPostImgDiv"><img class="myPostImg"/></div><div class="myPostNameDiv"><span class="myPostName"></span></div><div class="myPostDateDiv"><text class="myPostDate"></text></div><div class="myPostCaptionDiv"><span class="myPostCaption"></span></div></div><div class="myPost"><img class="myActualPost"/></div><div class="myLikedNamesParent"><div class="myLikedNames" runat="server" style="display: none;"></div></div><div class="myLikeCommentCount"></div><div class="myLikeComment"><div class="myLikeDiv"><img class="myLikeBtnImg"/><span class="myLike">Like</span></div><div class="myCommentDiv"><img class="myCommentBtnImg"/><span class="myComment">Comment</span></div></div><div class="myCommentSection" style="display: none;"><div class="myAddCommentDiv"><img class="myCommentProfileImg"/><input class="myAddComment" placeholder="Write a comment..." /></div><div class="myCommentsList"></div></div></div>'
                postDiv.innerHTML = result
                document.getElementsByClassName("postOptionRightDiv")[0].appendChild(postDiv);

                document.getElementsByClassName("myPostCaption")[i].textContent = data[i].caption;
                document.getElementsByClassName("myActualPost")[i].src = "http://127.0.0.1:8080/" + data[i].imagepath.split('Uploads\\')[1];
                document.getElementsByClassName("myLikeBtnImg")[i].src = "https://" + location.host + "/images/likebutton.png";
                document.getElementsByClassName("myCommentBtnImg")[i].src = "https://" + location.host + "/images/commentbutton.png";

                const val = i
                document.getElementsByClassName("myCommentDiv")[i].addEventListener("click", function () {
                    ShowComments(data[val].postId);
                    AddingComment(data[val]);
                });

                if (data[i].likes == 0) {
                    if (data[i].comments == 1)
                        document.getElementsByClassName("myLikeCommentCount")[i].innerHTML = '<img class="myPostLike" src="https://' + location.host + '/images/white-solid-color.jpg"/><h3 class="myLikeCount"></h3><h3 class="commentCount">' + data[i].comments + ' comment</h3 >'
                    else
                        document.getElementsByClassName("myLikeCommentCount")[i].innerHTML = '<img class="myPostLike" src="https://' + location.host + '/images/white-solid-color.jpg"/><h3 class="myLikeCount"></h3><h3 class="commentCount">' + data[i].comments + ' comments</h3 >'
                }
                else if (data[i].likes == 1) {
                    if (data[i].comments == 1)
                        document.getElementsByClassName("myLikeCommentCount")[i].innerHTML = '<img class="myPostLike" src="https://' + location.host + '/images/postLike.png"/><h3 class="myLikeCount">' + data[i].likes + ' other</h3><h3 class="commentCount">' + data[i].comments + ' comment</h3 >'
                    else
                        document.getElementsByClassName("myLikeCommentCount")[i].innerHTML = '<img class="myPostLike" src="https://' + location.host + '/images/postLike.png"/><h3 class="myLikeCount">' + data[i].likes + ' other</h3><h3 class="commentCount">' + data[i].comments + ' comments</h3 >'

                    const val = i
                    document.getElementsByClassName("myLikeCount")[i].addEventListener("mouseover", function () {
                        DisplayLikes(data[val].postId)
                    });
                    document.getElementsByClassName("myLikeCount")[i].addEventListener("mouseout", function () {
                        DisplayLikesHide(data[val].postId)
                    });
                }
                else if (data[i].likes > 1) {
                    if (data[i].comments == 1)
                        document.getElementsByClassName("myLikeCommentCount")[i].innerHTML = '<img class="myPostLike" src="https://' + location.host + '/images/postLike.png"/><h3 class="myLikeCount">' + data[i].likes + ' others</h3><h3 class="commentCount">' + data[i].comments + ' comment</h3 >'
                    else
                        document.getElementsByClassName("myLikeCommentCount")[i].innerHTML = '<img class="myPostLike" src="https://' + location.host + '/images/postLike.png"/><h3 class="myLikeCount">' + data[i].likes + ' others</h3><h3 class="commentCount">' + data[i].comments + ' comments</h3 >'

                    const val = i
                    document.getElementsByClassName("myLikeCount")[i].addEventListener("mouseover", function () {
                        DisplayLikes(data[val].postId)
                    });
                    document.getElementsByClassName("myLikeCount")[i].addEventListener("mouseout", function () {
                        DisplayLikesHide(data[val].postId)
                    });
                }

                $.ajax({
                    url: 'https://' + location.host + '/Profile/GetProfileDetails',
                    method: 'Post',
                    data: value,
                    success: function (data1) {
                        var date1 = moment();
                        var date2 = moment(data[i].date);

                        document.getElementsByClassName("myPostImg")[i].src = "http://127.0.0.1:8080/" + data1[0].profileImagePath.split('Uploads\\')[1];
                        document.getElementsByClassName("myPostName")[i].textContent = data1[0].firstName + " " + data1[0].surname;

                        if (date1.diff(date2, 'hours') == 0) {
                            document.getElementsByClassName("myPostDate")[i].textContent = date1.diff(date2, 'minutes') + "m"
                        }
                        else if (date1.diff(date2, 'hours') > 24) {
                            document.getElementsByClassName("myPostDate")[i].textContent = date1.diff(date2, 'days') + 'd';
                        }
                        else {
                            document.getElementsByClassName("myPostDate")[i].textContent = date1.diff(date2, 'hours') + 'h';
                        }

                        document.getElementsByClassName("myCommentProfileImg")[i].src = "http://127.0.0.1:8080/" + data1[0].profileImagePath.split('Uploads\\')[1];
                    },
                    error: function (xhr, status, error) {
                        alert("An error occurred: " + error);
                    }
                });
            }
        },
        error: function (xhr, status, error) {
            alert("An error occurred: " + error);
        }
    });

    //method to be executed when like button is clicked for a particular post
    $(".myLikeDiv").click(function () {
        var value = {
            "id": this.parentNode.parentNode.parentNode.id
        }
        $.ajax({
            url: 'https://' + location.host + '/Feed/Liked',
            method: 'Post',
            data: value,
            success: function (data) { },
            error: function (xhr, status, error) {
                alert("An error occurred: " + error);
            }
        });

        //method to be executed when like button - updates the image for liked/unliked
        var imgSrc = document.getElementById(this.parentNode.parentNode.parentNode.id);
        if (imgSrc.getElementsByClassName("myLikeBtnImg")[0].src == "https://" + location.host + "/images/likebutton.png") {
            imgSrc.getElementsByClassName("myLikeBtnImg")[0].src = "https://" + location.host + "/images/likedbutton.png"

            if (imgSrc.getElementsByClassName("myLikeCount")[0].textContent == "") {
                imgSrc.getElementsByClassName("myLikeCount")[0].textContent = "You"
                imgSrc.getElementsByClassName("myPostLike")[0].src = "https://" + location.host + "/images/postLike.png"

            }
            else if (imgSrc.getElementsByClassName("myLikeCount")[0].textContent.split(" ")[0] == "1") {
                imgSrc.getElementsByClassName("myLikeCount")[0].textContent = "You and " + imgSrc.getElementsByClassName("myLikeCount")[0].textContent.split(" ")[0] + " other";
            }
            else {
                imgSrc.getElementsByClassName("myLikeCount")[0].textContent = "You and " + imgSrc.getElementsByClassName("myLikeCount")[0].textContent.split(" ")[0] + " others";
            }
        }
        else {
            imgSrc.getElementsByClassName("myLikeBtnImg")[0].src = "https://" + location.host + "/images/likebutton.png"

            if (imgSrc.getElementsByClassName("myLikeCount")[0].textContent == "You") {
                imgSrc.getElementsByClassName("myLikeCount")[0].textContent = ""
                imgSrc.getElementsByClassName("myPostLike")[0].src = "https://" + location.host + "/images/white-solid-color.jpg"

            }
            else if (imgSrc.getElementsByClassName("myLikeCount")[0].textContent.split(" ")[2] == "1") {
                imgSrc.getElementsByClassName("myLikeCount")[0].textContent = imgSrc.getElementsByClassName("myLikeCount")[0].textContent.split(" ")[2] + " other";
            }
            else {
                imgSrc.getElementsByClassName("myLikeCount")[0].textContent = imgSrc.getElementsByClassName("myLikeCount")[0].textContent.split(" ")[2] + " others";
            }
        }
    });

    //populates the likes section (section above likes and comments)
    var value = {
    }
    $.ajax({
        url: 'https://' + location.host + '/Profile/GetPostsLikedByMe',
        method: 'Post',
        data: value,
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var op = data[i];
                var likedByMe = document.getElementById(op);
                if (likedByMe == null) {
                    continue
                }
                else {
                    likedByMe.getElementsByClassName("myLikeBtnImg")[0].src = "https://" + location.host + "/images/likedbutton.png"

                    if (likedByMe.getElementsByClassName("myLikeCount")[0].textContent.split(" ")[0] == "1") {
                        likedByMe.getElementsByClassName("myLikeCount")[0].textContent = "You"
                    }
                    else if (likedByMe.getElementsByClassName("myLikeCount")[0].textContent.split(" ")[0] == "2") {
                        likedByMe.getElementsByClassName("myLikeCount")[0].textContent = "You and " + (parseInt(likedByMe.getElementsByClassName("myLikeCount")[0].textContent.split(" ")[0]) - 1) + " other";
                    }
                    else {
                        likedByMe.getElementsByClassName("myLikeCount")[0].textContent = "You and " + (parseInt(likedByMe.getElementsByClassName("myLikeCount")[0].textContent.split(" ")[0]) - 1) + " others";
                    }
                }

            }
        },
        error: function (xhr, status, error) {
            alert("An error occurred: " + error);
        }
    });

    let currentprofileImg = document.getElementsByClassName("myProfileHeaderProfileImg")[0];
    let input = document.getElementsByClassName("myProfileHeaderProfieUpload")[0]
    let currentCoverImg = document.getElementsByClassName("myProfileHeaderCoverEditBtnDiv")[0];
    let input1 = document.getElementsByClassName("myProfileHeaderCoverUpload")[0]

    currentprofileImg.onclick = function () {
        input.click();
    }

    currentCoverImg.onclick = function () {
        input1.click();
    }

    document.getElementById("result").style.padding = "0px"

    if (document.getElementsByClassName("postOptionLeftDiv2")[0].offsetHeight == 213) {
        document.getElementsByClassName("postOptionLeftDiv3")[0].style.top = "125px"
    }
    else {
        document.getElementsByClassName("postOptionLeftDiv3")[0].style.top = "255px"
    }

    setTimeout(function () {
        document.getElementsByTagName('body')[0].style.visibility = "visible"
    }, 5)

    setTimeout(function () {
        if ($(location).attr('href').substr(35 + location.host.length).split('#').length == 2) {
            document.getElementById($(location).attr('href').substr(35 + location.host.length).split('#')[1]).scrollIntoView(true)
        }

        if ($(location).attr('href').substr(35 + location.host.length).split('#').length == 3) {
            document.getElementById($(location).attr('href').substr(35 + location.host.length).split('#')[1]).getElementsByClassName("myCommentDiv")[0].click();
        }
    }, 250)
});



