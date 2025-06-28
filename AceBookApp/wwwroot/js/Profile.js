
// Read the anti-forgery token from the hidden input
const antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();

// Set up jQuery to include the token in all AJAX requests
$.ajaxSetup({
    headers: { 'RequestVerificationToken': antiForgeryToken }
});

// Utility functions
const baseUrl = `https://${location.host}`;

function getProfileEmailFromUrl() {
    return $(location).attr('href').substr(35 + location.host.length).split('#')[0];
}

function showError(error) {
    alert("An error occurred: " + error);
}

// Display all likes for a particular post when mouse hovered over likes
function DisplayLikes(postId) {
    $.ajax({
        url: `${baseUrl}/Feed/GetLikesBy`,
        method: 'POST',
        data: { id: postId },
        success: function (data) {
            let result = '';
            for (let i = 0; i < data.length; i++) {
                result += `<span class="myLikedEmail">${data[i].likedByName}</span></br>`;
            }
            const likedNames = document.getElementById(postId).getElementsByClassName("myLikedNames")[0];
            likedNames.style.display = "block";
            likedNames.innerHTML = result;
        },
        error: function (xhr, status, error) {
            showError(error);
        }
    });
}

// Hide all likes for a particular post when mouse removed over likes
function DisplayLikesHide(postId) {
    document.getElementById(postId).getElementsByClassName("myLikedNames")[0].style.display = "none";
}

// Show/hide comments section
function ShowComments(postId) {
    const commentSection = document.getElementById(postId).getElementsByClassName("myCommentSection")[0];
    commentSection.style.display = (commentSection.style.display === "block") ? "none" : "block";
    commentSection.getElementsByClassName("myAddComment")[0].focus();
}

// Display all previous comments for a particular post
function GetCommentList(postId) {
    $.ajax({
        url: `${baseUrl}/Feed/GetCommentsBy`,
        method: 'POST',
        data: { id: postId },
        success: function (data) {
            let result = '';
            for (let i = 0; i < data.length; i++) {
                result += '<div class="commentDetails"><div class="commentImgDiv"><img class="commentImg" src="' + data[i].commentedByImagepath + '"/></div><div class="commentData"><div><a class="commentName" href="/Profile/ProfileData?email=' + data[i].commentedBy + '">' + data[i].commentedByName + '</a></br><span class="commentText">' + data[i].commentedText + '</span ></div></div></div>';
            }
            document.getElementById(postId).getElementsByClassName("myCommentsList")[0].innerHTML = result;
        },
        error: function (xhr, status, error) {
            showError(error);
        }
    });
}

// Update comment count for a post
function UpdateCommentCount(postId) {
    $.ajax({
        url: `${baseUrl}/Feed/GetCommentsBy`,
        method: 'POST',
        data: { id: postId },
        success: function (data) {
            const countText = data.length === 1 ? "1 comment" : `${data.length} comments`;
            const postElem = document.getElementById(postId);
            if (postElem) {
                const countElem = postElem.getElementsByClassName("commentCount")[0];
                if (countElem) {
                    countElem.innerHTML = countText;
                }
            }
        },
        error: function (xhr, status, error) {
            showError(error);
        }
    });
}

// Display previous comments and add new comment when entered by user
function AddingComment(myData) {
    let postId = myData.postId !== undefined ? myData.postId : myData.id;
    GetCommentList(postId);
    const input = document.getElementById(postId).getElementsByClassName("myCommentSection")[0].getElementsByClassName("myAddComment")[0];

    // Prevent multiple event bindings
    if (input.dataset.handlerAttached) return;
    input.dataset.handlerAttached = "true";

    let isSubmitting = false;
    input.addEventListener("keyup", (event) => {
        if (event.key === "Enter" && input.value.trim() !== '' && !isSubmitting) {
            isSubmitting = true;
            $.ajax({
                url: `${baseUrl}/Feed/Commented`,
                method: 'POST',
                data: { id: postId, text: input.value },
                success: function () {
                    input.value = '';
                    setTimeout(function () {
                        GetCommentList(postId);
                        UpdateCommentCount(postId);
                    }, 150);
                },
                complete: function () {
                    isSubmitting = false;
                },
                error: function (xhr, status, error) {
                    showError(error);
                }
            });
        }
    });
}

// Update profile photo
function Submit() {
    var uploadImg = document.getElementsByClassName("myProfileHeaderProfieUploadImg")[0];
    if (uploadImg && uploadImg.style.visibility !== "hidden" && uploadImg.offsetParent !== null) {
        document.getElementsByClassName("profileImgForm")[0].submit();
    }
}

// Update cover photo
function Submit1() {
    document.getElementsByClassName("coverImgForm")[0].submit();
}

$(document).ready(function () {
    let myEmail;
    const profileEmail = getProfileEmailFromUrl();

    // Hide all profile action divs initially
    $('.myProfileHeaderProfileAddEditDiv, .myProfileHeaderProfileEditDiv, .myProfileHeaderProfileCancelReqDiv, .myProfileHeaderProfileFrndAcceptedDiv, .myProfileHeaderProfileAddFriendDiv').addClass('hidden');
    $(".myProfileHeaderCoverEditBtnDiv")[0].style.visibility = "hidden";
    $(".myProfileHeaderOptionsPostsOuterDiv")[0].style.borderBottom = "3px solid #1876F2";
    $(".myProfileHeaderOptionsPosts")[0].style.color = "#1876F2";
    $('.aboutOptionDiv').addClass('hidden');

    // Tab click handlers
    $('.myProfileHeaderOptionsAboutDiv').click(function () {
        $('.aboutOptionDiv').removeClass('hidden');
        $('.aboutSectionDiv').removeClass('hidden');
        $('.aboutSectionRightFriendsDiv, .aboutSectionRightPhotosDiv').removeClass('hidden');
        $('.postOptionDiv').addClass('hidden');
        $(".myProfileHeaderOptionsAbout")[0].style.color = "#1876F2";
        $(".myProfileHeaderOptionsFriends, .myProfileHeaderOptionsPosts, .myProfileHeaderOptionsPhotos").css("color", "#65676B");
        $(".aboutSectionLeftOverview")[0].style.color = "#1876F2";
        $(".aboutSectionLeftOverview")[0].style.backgroundColor = "#EFF3FF";
        $('.aboutSectionRightWorkDiv, .aboutSectionRightPlaceDiv, .aboutSectionRightContactDiv, .aboutSectionRightFamilyDiv').addClass('hidden');
        $('.aboutSectionRightOverviewDiv').removeClass('hidden');
        $(".myProfileHeaderOptionsAboutOuterDiv")[0].style.borderBottom = "3px solid #1876F2";
        $(".myProfileHeaderOptionsPostsOuterDiv, .myProfileHeaderOptionsFriendsOuterDiv, .myProfileHeaderOptionsPhotosOuterDiv").css("borderBottom", "none");
    });

    $('.myProfileHeaderOptionsFriendsDiv').click(function () {
        $(".myProfileHeaderOptionsAbout, .myProfileHeaderOptionsPosts, .myProfileHeaderOptionsPhotos").css("color", "#65676B");
        $(".myProfileHeaderOptionsFriends")[0].style.color = "#1876F2";
        $('.aboutOptionDiv').removeClass('hidden');
        $('.aboutSectionDiv').addClass('hidden');
        $('.aboutSectionRightFriendsDiv').removeClass('hidden');
        $('.aboutSectionRightPhotosDiv').addClass('hidden');
        $(".myProfileHeaderOptionsAboutOuterDiv, .myProfileHeaderOptionsPostsOuterDiv, .myProfileHeaderOptionsPhotosOuterDiv").css("borderBottom", "none");
        $(".myProfileHeaderOptionsFriendsOuterDiv")[0].style.borderBottom = "3px solid #1876F2";
        $('.postOptionDiv').addClass('hidden');
    });

    $('.myProfileHeaderOptionsPhotosDiv').click(function () {
        $(".myProfileHeaderOptionsAbout, .myProfileHeaderOptionsFriends, .myProfileHeaderOptionsPosts").css("color", "#65676B");
        $(".myProfileHeaderOptionsPhotos")[0].style.color = "#1876F2";
        $('.aboutOptionDiv').removeClass('hidden');
        $('.aboutSectionDiv').addClass('hidden');
        $('.aboutSectionRightFriendsDiv').addClass('hidden');
        $('.aboutSectionRightPhotosDiv').removeClass('hidden');
        $(".myProfileHeaderOptionsAboutOuterDiv, .myProfileHeaderOptionsPostsOuterDiv, .myProfileHeaderOptionsFriendsOuterDiv").css("borderBottom", "none");
        $(".myProfileHeaderOptionsPhotosOuterDiv")[0].style.borderBottom = "3px solid #1876F2";
        $('.postOptionDiv').addClass('hidden');
    });

    $('.myProfileHeaderOptionsPostsDiv').click(function () {
        $('.postOptionDiv').removeClass('hidden');
        $(".myProfileHeaderOptionsAbout, .myProfileHeaderOptionsFriends, .myProfileHeaderOptionsPhotos").css("color", "#65676B");
        $(".myProfileHeaderOptionsPosts")[0].style.color = "#1876F2";
        $('.aboutOptionDiv').addClass('hidden');
        $(".myProfileHeaderOptionsAboutOuterDiv, .myProfileHeaderOptionsFriendsOuterDiv, .myProfileHeaderOptionsPhotosOuterDiv").css("borderBottom", "none");
        $(".myProfileHeaderOptionsPostsOuterDiv")[0].style.borderBottom = "3px solid #1876F2";
    });

    // About section left tab click handlers

    $('.aboutSectionLeftOverview').click(function () {
        $(".aboutSectionLeftOverview")[0].style.color = "#1876F2";
        $(".aboutSectionLeftOverview")[0].style.backgroundColor = "#EFF3FF";
        $(".aboutSectionLeftWork, .aboutSectionLeftPlace, .aboutSectionLeftContact, .aboutSectionLeftFamily")
            .css("color", "#65676B").css("backgroundColor", "transparent");
        $('.aboutSectionRightWorkDiv, .aboutSectionRightPlaceDiv, .aboutSectionRightContactDiv, .aboutSectionRightFamilyDiv')
            .addClass('hidden');
        $('.aboutSectionRightOverviewDiv').removeClass('hidden');

        $.ajax({
            url: `${baseUrl}/Profile/GetAdditionalDetails`,
            method: 'POST',
            data: { email: getProfileEmailFromUrl() },
            success: function (data) {
                if (!data || data.workInfo1 == null) {
                    $(".aboutSectionRightOverviewWork1aSpan").html('No workplace to show');
                    $('.aboutSectionRightOverviewWork1bSpan').addClass('hidden');
                    $(".aboutSectionRightOverviewWorkDiv")[0].style.height = "37px";
                } else {
                    $(".aboutSectionRightOverviewWork1aSpan").html('Worked at <b>' + data.workInfo1 + '<b>');
                    $(".aboutSectionRightOverviewWork1bSpan").text(data.workInfo2);
                }
                if (!data || data.collegeInfo == null) {
                    $(".aboutSectionRightOverviewCollegeSpan").html('No college to show');
                    $(".aboutSectionRightOverviewCollegeDiv")[0].style.height = "37px";
                } else {
                    $(".aboutSectionRightOverviewCollegeSpan").html('Studied at <b>' + data.collegeInfo + '<b>');
                }
                if (!data || data.placeInfo == null) {
                    $(".aboutSectionRightOverviewPlaceSpan").html('No city to show');
                    $(".aboutSectionRightOverviewPlaceDiv")[0].style.height = "37px";
                } else {
                    $(".aboutSectionRightOverviewPlaceSpan").html('From <b>' + data.placeInfo + '<b>');
                }
                if (!data || data.phoneInfo == null) {
                    $(".aboutSectionRightOverviewContactSpan").html('No phone number to show');
                    $(".aboutSectionRightOverviewContactDiv")[0].style.height = "37px";
                } else {
                    $(".aboutSectionRightOverviewContactSpan").html('<b>' + data.phoneInfo + '</b>');
                }
            },
            error: function (xhr, status, error) {
                showError(error);
            }
        });
    });

    $('.aboutSectionLeftWork').click(function () {
        $(".aboutSectionLeftOverview, .aboutSectionLeftPlace, .aboutSectionLeftContact, .aboutSectionLeftFamily")
            .css("color", "#65676B").css("backgroundColor", "transparent");
        $(".aboutSectionLeftWork")[0].style.color = "#1876F2";
        $(".aboutSectionLeftWork")[0].style.backgroundColor = "#EFF3FF";
        $('.aboutSectionRightPlaceDiv, .aboutSectionRightContactDiv, .aboutSectionRightFamilyDiv, .aboutSectionRightOverviewDiv')
            .addClass('hidden');
        $('.aboutSectionRightWorkDiv').removeClass('hidden');
        $('.aboutSectionRightWorkAddInput1Div, .aboutSectionRightWorkAddInput2Div, .aboutSectionRightWorkAddInput3Div')
            .addClass('hidden');

        if (typeof myEmail !== "undefined" && myEmail !== getProfileEmailFromUrl()) {
            $('.aboutSectionRightWorkAddDiv1, .aboutSectionRightWorkAddDiv2, .aboutSectionRightWorkAddDiv3').addClass('hidden');
        } else {
            $('.aboutSectionRightWorkAddDiv1').removeClass('hidden');
        }

        $.ajax({
            url: `${baseUrl}/Profile/GetAdditionalDetails`,
            method: 'POST',
            data: { email: getProfileEmailFromUrl() },
            success: function (data) {
                if (!data || data.workInfo1 == null) {
                    $(".aboutSectionRightWorkResult1aSpan").html('No workplace to show');
                    $('.aboutSectionRightWorkResult1bSpan').addClass('hidden');
                    $(".aboutSectionRightWorkResultDiv1")[0].style.height = "35px";
                } else {
                    $(".aboutSectionRightWorkResult1aSpan").html('Worked at <b>' + data.workInfo1 + '<b>');
                    $(".aboutSectionRightWorkResult1bSpan").text(data.workInfo2);
                }
                if (!data || data.collegeInfo == null) {
                    $(".aboutSectionRightWorkResult2aSpan").html('No college to show');
                } else {
                    $(".aboutSectionRightWorkResult2aSpan").html('Studied at <b>' + data.collegeInfo + '<b>');
                }
                if (!data || data.schoolInfo == null) {
                    $(".aboutSectionRightWorkResult3aSpan").html('No school to show');
                } else {
                    $(".aboutSectionRightWorkResult3aSpan").html('Went at <b>' + data.schoolInfo + '<b>');
                }
            },
            error: function (xhr, status, error) {
                showError(error);
            }
        });
    });

    $('.aboutSectionLeftPlace').click(function () {
        $(".aboutSectionLeftOverview, .aboutSectionLeftWork, .aboutSectionLeftContact, .aboutSectionLeftFamily")
            .css("color", "#65676B").css("backgroundColor", "transparent");
        $(".aboutSectionLeftPlace")[0].style.color = "#1876F2";
        $(".aboutSectionLeftPlace")[0].style.backgroundColor = "#EFF3FF";
        $('.aboutSectionRightContactDiv, .aboutSectionRightFamilyDiv, .aboutSectionRightOverviewDiv, .aboutSectionRightWorkDiv')
            .addClass('hidden');
        $('.aboutSectionRightPlaceDiv').removeClass('hidden');
        $('.aboutSectionRightPlaceAddInput1Div').addClass('hidden');

        if (typeof myEmail !== "undefined" && myEmail !== getProfileEmailFromUrl()) {
            $('.aboutSectionRightPlaceAddDiv').addClass('hidden');
        } else {
            $('.aboutSectionRightPlaceAddDiv').removeClass('hidden');
        }

        $.ajax({
            url: `${baseUrl}/Profile/GetAdditionalDetails`,
            method: 'POST',
            data: { email: getProfileEmailFromUrl() },
            success: function (data) {
                if (!data || data.placeInfo == null) {
                    $(".aboutSectionRightPlaceResult1aSpan").html('No city to show');
                } else {
                    $(".aboutSectionRightPlaceResult1aSpan").html('From <b>' + data.placeInfo + '<b>');
                }
            },
            error: function (xhr, status, error) {
                showError(error);
            }
        });
    });

    $('.aboutSectionLeftContact').click(function () {
        $(".aboutSectionLeftOverview, .aboutSectionLeftWork, .aboutSectionLeftPlace, .aboutSectionLeftFamily")
            .css("color", "#65676B").css("backgroundColor", "transparent");
        $(".aboutSectionLeftContact")[0].style.color = "#1876F2";
        $(".aboutSectionLeftContact")[0].style.backgroundColor = "#EFF3FF";
        $('.aboutSectionRightFamilyDiv, .aboutSectionRightOverviewDiv, .aboutSectionRightWorkDiv, .aboutSectionRightPlaceDiv')
            .addClass('hidden');
        $('.aboutSectionRightContactDiv').removeClass('hidden');
        $('.aboutSectionRightContactAddInput1Div, .aboutSectionRightContactAddInput2Div').addClass('hidden');

        if (typeof myEmail !== "undefined" && myEmail !== getProfileEmailFromUrl()) {
            $('.aboutSectionRightContactAddDiv1').addClass('hidden');
        } else {
            $('.aboutSectionRightContactAddDiv1').removeClass('hidden');
        }

        $.ajax({
            url: `${baseUrl}/Profile/GetProfileDetails`,
            method: 'POST',
            data: { email: getProfileEmailFromUrl() },
            success: function (data) {
                if (data.gender === "Male") {
                    $('.aboutSectionRightContactGenderMaleDiv').removeClass('hidden');
                    $('.aboutSectionRightContactGenderFemaleDiv').addClass('hidden');
                } else {
                    $('.aboutSectionRightContactGenderMaleDiv').addClass('hidden');
                    $('.aboutSectionRightContactGenderFemaleDiv').removeClass('hidden');
                }
                $(".aboutSectionRightContactDOB1aSpan").html(data.dobDate + ' ' + data.dobMon);
            },
            error: function (xhr, status, error) {
                showError(error);
            }
        });

        $.ajax({
            url: `${baseUrl}/Profile/GetAdditionalDetails`,
            method: 'POST',
            data: { email: getProfileEmailFromUrl() },
            success: function (data) {
                if (!data || data.phoneInfo == null) {
                    $(".aboutSectionRightContactResult1aSpan").html('No phone number to show');
                } else {
                    $(".aboutSectionRightContactResult1aSpan").html('<b>' + data.phoneInfo + '</b>');
                }
            },
            error: function (xhr, status, error) {
                showError(error);
            }
        });
    });

    $('.aboutSectionLeftFamily').click(function () {
        $(".aboutSectionLeftOverview, .aboutSectionLeftWork, .aboutSectionLeftPlace, .aboutSectionLeftContact")
            .css("color", "#65676B").css("backgroundColor", "transparent");
        $(".aboutSectionLeftFamily")[0].style.color = "#1876F2";
        $(".aboutSectionLeftFamily")[0].style.backgroundColor = "#EFF3FF";
        $('.aboutSectionRightOverviewDiv, .aboutSectionRightWorkDiv, .aboutSectionRightPlaceDiv, .aboutSectionRightContactDiv')
            .addClass('hidden');
        $('.aboutSectionRightFamilyDiv').removeClass('hidden');
    });

    $('.aboutSectionRightWorkAddDiv1').click(function () {
        $('.aboutSectionRightWorkAddInput1Div').removeClass('hidden');
    });
    $('.aboutSectionRightWorkAddInput1a').click(function () {
        $('.aboutSectionRightWorkAddInput1Div').addClass('hidden');
    });

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
                    if (data.workInfo1 != null) {
                        document.getElementsByClassName("aboutSectionRightWorkResult1aSpan")[0].innerHTML = 'Worked at ' + '<b>' + data.workInfo1 + '<b>';
                        document.getElementsByClassName("aboutSectionRightWorkResult1bSpan")[0].textContent = data.workInfo2;
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

    // College
    $('.aboutSectionRightWorkAddDiv2').click(function () {
        $('.aboutSectionRightWorkAddInput2Div').removeClass('hidden');
    });
    $('.aboutSectionRightWorkAddInput2a').click(function () {
        $('.aboutSectionRightWorkAddInput2Div').addClass('hidden');
    });

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
                    if (data.collegeInfo != null) {
                        document.getElementsByClassName("aboutSectionRightWorkResult2aSpan")[0].innerHTML = 'Studied at ' + '<b>' + data.collegeInfo + '<b>';
                        document.getElementsByClassName("aboutSectionRightWorkResultDiv2")[0].style.display = "block";
                    }
                },
                error: function (xhr, status, error) {
                    alert("An error occurred: " + error);
                }
            })
        }, 500);
    })

    // High School
    $('.aboutSectionRightWorkAddDiv3').click(function () {
        $('.aboutSectionRightWorkAddInput3Div').removeClass('hidden');
    });
    $('.aboutSectionRightWorkAddInput3a').click(function () {
        $('.aboutSectionRightWorkAddInput3Div').addClass('hidden');
    });

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
                    if (data.schoolInfo != null) {
                        document.getElementsByClassName("aboutSectionRightWorkResult3aSpan")[0].innerHTML = 'Went at ' + '<b>' + data.schoolInfo + '<b>';
                        document.getElementsByClassName("aboutSectionRightWorkResultDiv3")[0].style.display = "block";
                    }
                },
                error: function (xhr, status, error) {
                    alert("An error occurred: " + error);
                }
            })
        }, 500);
    })

    // Place
    $('.aboutSectionRightPlaceAddDiv').click(function () {
        $('.aboutSectionRightPlaceAddInput1Div').removeClass('hidden');
    });
    $('.aboutSectionRightPlaceAddInput1a').click(function () {
        $('.aboutSectionRightPlaceAddInput1Div').addClass('hidden');
    });

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
                    if (data.placeInfo != null) {
                        document.getElementsByClassName("aboutSectionRightPlaceResult1aSpan")[0].innerHTML = 'From ' + '<b>' + data.placeInfo + '<b>';
                        document.getElementsByClassName("aboutSectionRightPlaceResultDiv1")[0].style.display = "block";
                    }
                },
                error: function (xhr, status, error) {
                    alert("An error occurred: " + error);
                }
            })
        }, 500);
    })

    // Contact
    $('.aboutSectionRightContactAddDiv1').click(function () {
        $('.aboutSectionRightContactAddInput1Div').removeClass('hidden');
    });
    $('.aboutSectionRightContactAddInput1a').click(function () {
        $('.aboutSectionRightContactAddInput1Div').addClass('hidden');
    });

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
                    if (data.phoneInfo != null) {
                        document.getElementsByClassName("aboutSectionRightContactResult1aSpan")[0].innerHTML = '<b>' + data.phoneInfo + '</b>';
                        document.getElementsByClassName("aboutSectionRightContactResultDiv1")[0].style.display = "block";
                    }
                },
                error: function (xhr, status, error) {
                    alert("An error occurred: " + error);
                }
            })
        }, 500);
    })

    // Get logged user details and display on profile page
    $.ajax({
        url: `${baseUrl}/Profile/GetProfileDetails`,
        method: 'POST',
        data: { email: profileEmail },
        success: function (data) {
            $(".myProfileHeaderCoverImg")[0].src = data.coverImagePath;
            $(".myProfileHeaderProfileImg")[0].src = data.profileImagePath;
            $(".myProfileHeaderMyDetailsName")[0].textContent = data.firstName + " " + data.surname;
        },
        error: function (xhr, status, error) {
            showError(error);
        }
    });

    // Display friends count on profile page and inside friends section
    function updateFriendsCount(selector) {
        $.ajax({
            url: `${baseUrl}/Profile/GetFriendList`,
            method: 'POST',
            data: { email: profileEmail },
            success: function (data) {
                $(selector).text(`${data.length} friends`);
            },
            error: function (xhr, status, error) {
                showError(error);
            }
        });
    }
    updateFriendsCount(".myProfileHeaderMyDetailsFriendsCount");
    updateFriendsCount(".postOptionLeftFriendsCount");

    // Get logged user details to populate multiple fields
    $.ajax({
        url: `${baseUrl}/Profile/GetProfileDetails`,
        method: 'POST',
        data: {},
        success: function (data) {
            myEmail = data.email;
            if (myEmail !== profileEmail) {
                $('.myProfileHeaderProfileEditDiv, .myProfileHeaderProfileFrndAcceptedDiv').addClass('hidden');
                $(".myProfileHeaderCoverEditBtnDiv, .myProfileHeaderProfieUploadImg, .myProfileHeaderProfieUpload").css("visibility", "hidden");
            } else {
                $('.myProfileHeaderProfileCancelReqDiv, .myProfileHeaderProfileAddFriendDiv, .myProfileHeaderProfileFrndAcceptedDiv').addClass('hidden');
                $('.myProfileHeaderProfileEditDiv').removeClass('hidden');
                setTimeout(function () {
                    $(".myProfileHeaderCoverEditBtnDiv, .myProfileHeaderProfieUploadImg").css("visibility", "visible");
                }, 10);
                $(".myProfileHeaderProfieUpload")[0].style.visibility = "visible";
                $(".myProfileHeaderProfileImg")[0].style.cursor = "pointer";
            }
        },
        error: function (xhr, status, error) {
            showError(error);
        }
    });

    // Populate additional details (Overview) of user
    function populateAdditionalDetails(workSelectors, collegeSelectors, placeSelectors, contactSelectors, data) {
        if (!data || data.workInfo1 == null) {
            $(workSelectors.span).html('No workplace to show');
            $(workSelectors.bspan).addClass('hidden');
            $(workSelectors.div)[0].style.height = "37px";
        } else {
            $(workSelectors.span).html(`Worked at <b>${data.workInfo1}<b>`);
            $(workSelectors.bspan).text(data.workInfo2);
        }
        if (!data || data.collegeInfo == null) {
            $(collegeSelectors.span).html('No college to show');
            $(collegeSelectors.div)[0].style.height = "37px";
        } else {
            $(collegeSelectors.span).html(`Studied at <b>${data.collegeInfo}<b>`);
        }
        if (!data || data.placeInfo == null) {
            $(placeSelectors.span).html('No city to show');
            $(placeSelectors.div)[0].style.height = "37px";
        } else {
            $(placeSelectors.span).html(`From <b>${data.placeInfo}<b>`);
        }
        if (!data || data.phoneInfo == null) {
            $(contactSelectors.span).html('No phone number to show');
            $(contactSelectors.div)[0].style.height = "37px";
        } else {
            $(contactSelectors.span).html(`<b>${data.phoneInfo}</b>`);
        }
    }
    $.ajax({
        url: `${baseUrl}/Profile/GetAdditionalDetails`,
        method: 'POST',
        data: { email: profileEmail },
        success: function (data) {
            populateAdditionalDetails(
                { span: ".aboutSectionRightOverviewWork1aSpan", bspan: ".aboutSectionRightOverviewWork1bSpan", div: ".aboutSectionRightOverviewWorkDiv" },
                { span: ".aboutSectionRightOverviewCollegeSpan", div: ".aboutSectionRightOverviewCollegeDiv" },
                { span: ".aboutSectionRightOverviewPlaceSpan", div: ".aboutSectionRightOverviewPlaceDiv" },
                { span: ".aboutSectionRightOverviewContactSpan", div: ".aboutSectionRightOverviewContactDiv" },
                data
            );
        },
        error: function (xhr, status, error) {
            showError(error);
        }
    });
    $.ajax({
        url: `${baseUrl}/Profile/GetAdditionalDetails`,
        method: 'POST',
        data: { email: profileEmail },
        success: function (data) {
            populateAdditionalDetails(
                { span: ".postOptionLeftWork1aSpan", bspan: ".postOptionLeftWork1bSpan", div: ".postOptionLeftWorkDiv" },
                { span: ".postOptionLeftCollegeSpan", div: ".postOptionLeftCollegeDiv" },
                { span: ".postOptionLeftPlaceSpan", div: ".postOptionLeftPlaceDiv" },
                { span: ".postOptionLeftContactSpan", div: ".postOptionLeftContactDiv" },
                data
            );
        },
        error: function (xhr, status, error) {
            showError(error);
        }
    });

    // Request/friendship status
    function updateFriendRequestStatus() {
        $.ajax({
            url: `${baseUrl}/Profile/IsReqSent`,
            method: 'POST',
            data: { toRequest: profileEmail },
            success: function (data) {
                if (data === "Yes") {
                    $('.myProfileHeaderProfileAddEditDiv, .myProfileHeaderProfileCancelReqDiv').removeClass('hidden');
                    $('.myProfileHeaderProfileAddFriendDiv, .myProfileHeaderProfileFrndAcceptedDiv, .myProfileHeaderProfileEditDiv').addClass('hidden');
                } else if (myEmail === profileEmail) {
                    $('.myProfileHeaderProfileCancelReqDiv, .myProfileHeaderProfileAddFriendDiv, .myProfileHeaderProfileFrndAcceptedDiv').addClass('hidden');
                    $('.myProfileHeaderProfileEditDiv').removeClass('hidden');
                } else {
                    $('.myProfileHeaderProfileCancelReqDiv').addClass('hidden');
                    $('.myProfileHeaderProfileAddEditDiv, .myProfileHeaderProfileAddFriendDiv').removeClass('hidden');
                    $('.myProfileHeaderProfileFrndAcceptedDiv, .myProfileHeaderProfileEditDiv').addClass('hidden');
                }

                $.ajax({
                    url: `${baseUrl}/Profile/IsFriend`,
                    method: 'POST',
                    data: { toRequest: profileEmail },
                    success: function (data) {
                        if (data === "Yes") {
                            $('.myProfileHeaderProfileCancelReqDiv, .myProfileHeaderProfileAddFriendDiv').addClass('hidden');
                            $('.myProfileHeaderProfileAddEditDiv, .myProfileHeaderProfileFrndAcceptedDiv').removeClass('hidden');
                            $('.myProfileHeaderProfileEditDiv').addClass('hidden');
                        } else if (myEmail === profileEmail) {
                            $('.myProfileHeaderProfileCancelReqDiv, .myProfileHeaderProfileAddFriendDiv, .myProfileHeaderProfileFrndAcceptedDiv').addClass('hidden');
                            $('.myProfileHeaderProfileEditDiv').removeClass('hidden');
                        } else {
                            $('.myProfileHeaderProfileFrndAcceptedDiv').addClass('hidden');
                        }
                    },
                    error: function (xhr, status, error) {
                        showError(error);
                    }
                });
            },
            error: function (xhr, status, error) {
                showError(error);
            }
        });
    }

    setTimeout(updateFriendRequestStatus, 200);

    // Populate friends for friends and posts tab
    function populateFriendsList(selector, limit) {
        $.ajax({
            url: `${baseUrl}/Profile/GetFriendList`,
            method: 'POST',
            data: { email: profileEmail },
            success: function (data) {
                let result = '';
                let len = limit ? Math.min(data.length, limit) : data.length;
                for (let i = 0; i < len; i++) {
                    let email = (data[i].fromRequest === profileEmail) ? data[i].toRequest : data[i].fromRequest;
                    $.ajax({
                        url: `${baseUrl}/Profile/GetProfileDetails`,
                        method: 'POST',
                        data: { email: email },
                        async: false,
                        success: function (data1) {
                            if (selector === ".aboutSectionRightFriendsListDiv") {
                                result += '<div class="frndAcc" id="' + data1.email + '" onclick="window.location.href=\'/Profile/ProfileData?email=' + email + '\'"><div class="frndAccImgDiv"><img class="frndAccImg" src="' + data1.profileImagePath + '"/></div><div class="frndAccNameDiv"><span class="frndAccName">' + data1.firstName + ' ' + data1.surname + '</span></div></div>';
                            } else {
                                result += '<div class="frndAccPost" id="' + data1.email + '" onclick="window.location.href=\'/Profile/ProfileData?email=' + email + '\'"><div class="frndAccPostImgDiv"><img class="frndAccPostImg" src="' + data1.profileImagePath + '"/></div><div class="frndAccPostNameDiv"><span class="frndAccPostName">' + data1.firstName + ' ' + data1.surname + '</span></div></div>';                            }
                        },
                        error: function (xhr, status, error) {
                            showError(error);
                        }
                    });
                }
                $(selector).html(result);
            },
            error: function (xhr, status, error) {
                showError(error);
            }
        });
    }
    populateFriendsList(".aboutSectionRightFriendsListDiv");
    populateFriendsList(".postOptionLeftFriendsListDiv", 6);

    $(".aboutSectionRightFriendsHeaderFrndReqDiv").click(function () {
        window.location.href = `/Profile/Friends?email=${profileEmail}`;
    });

    // Populate posts for about and photos tab
    function populatePhotos(selector, limit) {
        $.ajax({
            url: `${baseUrl}/Profile/GetPostsList`,
            method: 'POST',
            data: { email: profileEmail },
            success: function (data) {
                let result = '';
                let len = limit ? Math.min(data.length, limit) : data.length;
                for (let i = 0; i < len; i++) {
                    if (selector === ".aboutSectionRightPhotosListDiv") {
                        result += '<div class="ImgDiv"><img class="myPhotos" src="' + data[i].imagepath + '"/></div>';
                    } else {
                        result += '<div class="ImgDiv"><img class="myPhotosPost" src="' + data[i].imagepath + '"/></div>';
                    }
                }
                $(selector).html(result);
            },
            error: function (xhr, status, error) {
                showError(error);
            }
        });
    }
    populatePhotos(".aboutSectionRightPhotosListDiv");
    populatePhotos(".postOptionLeftPhotosListDiv", 6);

    // Add/cancel friend request
    $('.myProfileHeaderProfileAddFriendDiv, .myProfileHeaderProfileCancelReqDiv').click(function () {
        $.ajax({
            url: `${baseUrl}/Profile/SendRequest`,
            method: 'POST',
            data: { fromRequest: myEmail, toRequest: profileEmail },
            success: function () {
                if ($('.myProfileHeaderProfileCancelReqDiv').hasClass('hidden')) {
                    $('.myProfileHeaderProfileAddEditDiv, .myProfileHeaderProfileCancelReqDiv').removeClass('hidden');
                    $('.myProfileHeaderProfileAddFriendDiv').addClass('hidden');
                } else {
                    $('.myProfileHeaderProfileCancelReqDiv').addClass('hidden');
                    $('.myProfileHeaderProfileAddEditDiv, .myProfileHeaderProfileAddFriendDiv').removeClass('hidden');
                }
            },
            error: function (xhr, status, error) {
                showError(error);
            }
        });
    });

    // Tab navigation for all photos/friends
    $('.postOptionLeftPhotosHeaderAllPhotosDiv').click(function () {
        $(".myProfileHeaderOptionsPhotosDiv")[0].click();
    });
    $('.postOptionLeftFriendsHeaderAllFrndDiv').click(function () {
        $(".myProfileHeaderOptionsFriendsDiv")[0].click();
    });

    // Populate posts and their details in post tab
    $.ajax({
        url: `${baseUrl}/Profile/GetPostsList`,
        method: 'POST',
        data: { email: profileEmail },
        success: function (data) {
            data.sort((a, b) => new Date(b.date) - new Date(a.date));
            for (let i = 0; i < data.length; i++) {
                const postDiv = document.createElement("div");
                postDiv.id = data[i].postId;
                let postResult = `<div class="myPost"><div class="myPostDetails"><div class="myPostImgDiv"><img class="myPostImg"/></div><div class="myPostNameDiv"><span class="myPostName"></span></div><div class="myPostDateDiv"><text class="myPostDate"></text></div><div class="myPostCaptionDiv"><span class="myPostCaption"></span></div></div><div class="myPost"><img class="myActualPost"/></div><div class="myLikedNamesParent"><div class="myLikedNames" runat="server" style="display: none;"></div></div><div class="myLikeCommentCount"></div><div class="myLikeComment"><div class="myLikeDiv"><img class="myLikeBtnImg"/><span class="myLike">Like</span></div><div class="myCommentDiv"><img class="myCommentBtnImg"/><span class="myComment">Comment</span></div></div><div class="myCommentSection" style="display: none;"><div class="myAddCommentDiv"><img class="myCommentProfileImg"/><input class="myAddComment" placeholder="Write a comment..." /></div><div class="myCommentsList"></div></div></div>`;
                postDiv.innerHTML = postResult;
                $(".postOptionRightDiv")[0].appendChild(postDiv);

                postDiv.querySelector(".myPostCaption").textContent = data[i].caption;
                postDiv.querySelector(".myActualPost").src = data[i].imagepath;
                postDiv.querySelector(".myLikeBtnImg").src = `${baseUrl}/images/likebutton.png`;
                postDiv.querySelector(".myCommentBtnImg").src = `${baseUrl}/images/commentbutton.png`;

                postDiv.querySelector(".myCommentDiv").addEventListener("click", function () {
                    ShowComments(data[i].postId);
                    AddingComment(data[i]);
                });

                if (data[i].likes == 0) {
                    postDiv.querySelector(".myLikeCommentCount").innerHTML = `<img class="myPostLike" src="${baseUrl}/images/white-solid-color.jpg"/><h3 class="myLikeCount"></h3><h3 class="commentCount">${data[i].comments} comment${data[i].comments === 1 ? '' : 's'}</h3>`;
                } else {
                    let likeText = data[i].likes === 1 ? "other" : "others";
                    postDiv.querySelector(".myLikeCommentCount").innerHTML = `<img class="myPostLike" src="${baseUrl}/images/postLike.png"/><h3 class="myLikeCount">${data[i].likes} ${likeText}</h3><h3 class="commentCount">${data[i].comments} comment${data[i].comments === 1 ? '' : 's'}</h3>`;
                    const val = i;
                    document.getElementsByClassName("myLikeCount")[i].addEventListener("mouseover", function () {
                        DisplayLikes(data[val].postId);
                    });
                    document.getElementsByClassName("myLikeCount")[i].addEventListener("mouseout", function () {
                        DisplayLikesHide(data[val].postId);
                    });
                }

                // Profile AJAX call for each post
                (function (post, idx) {
                    $.ajax({
                        url: `${baseUrl}/Profile/GetProfileDetails`,
                        method: 'POST',
                        data: { email: post.email },
                        success: function (data1) {
                            postDiv.querySelector(".myPostImg").src = data1.profileImagePath;
                            postDiv.querySelector(".myPostName").textContent = data1.firstName + " " + data1.surname;
                            let date1 = moment();
                            let date2 = moment(post.date);
                            if (date1.diff(date2, 'hours') == 0) {
                                postDiv.querySelector(".myPostDate").textContent = date1.diff(date2, 'minutes') + "m";
                            } else if (date1.diff(date2, 'hours') > 24) {
                                postDiv.querySelector(".myPostDate").textContent = date1.diff(date2, 'days') + 'd';
                            } else {
                                postDiv.querySelector(".myPostDate").textContent = date1.diff(date2, 'hours') + 'h';
                            }
                            postDiv.querySelector(".myCommentProfileImg").src = data1.profileImagePath;
                        },
                        error: function (xhr, status, error) {
                            showError(error);
                        }
                    });
                })(data[i], i);
            }

            // Populate likes section (above likes and comments)
            $.ajax({
                url: `${baseUrl}/Profile/GetPostsLikedByMe`,
                method: 'POST',
                data: { email: profileEmail },
                success: function (likedPosts) {
                    for (let i = 0; i < likedPosts.length; i++) {
                        let op = likedPosts[i];
                        let likedByMe = document.getElementById(op);
                        if (!likedByMe) continue;
                        likedByMe.getElementsByClassName("myLikeBtnImg")[0].src = `${baseUrl}/images/likedbutton.png`;
                        let likeCountElem = likedByMe.getElementsByClassName("myLikeCount")[0];
                        let count = likeCountElem.textContent.split(" ")[0];
                        if (count === "1") {
                            likeCountElem.textContent = "You";
                        } else if (count === "2") {
                            likeCountElem.textContent = `You and 1 other`;
                        } else {
                            likeCountElem.textContent = `You and ${parseInt(count) - 1} others`;
                        }
                    }
                },
                error: function (xhr, status, error) {
                    showError(error);
                }
            });
        },
        error: function (xhr, status, error) {
            showError(error);
        }
    });

    // Like button click handler
    $(document).on("click", ".myLikeDiv", function () {
        let postId = this.parentNode.parentNode.parentNode.id;
        $.ajax({
            url: `${baseUrl}/Feed/Liked`,
            method: 'POST',
            data: { id: postId },
            error: function (xhr, status, error) {
                showError(error);
            }
        });

        let imgSrc = document.getElementById(postId);
        let likeBtnImg = imgSrc.getElementsByClassName("myLikeBtnImg")[0];
        let likeCountElem = imgSrc.getElementsByClassName("myLikeCount")[0];
        let postLikeImg = imgSrc.getElementsByClassName("myPostLike")[0];

        if (likeBtnImg.src === `${baseUrl}/images/likebutton.png`) {
            likeBtnImg.src = `${baseUrl}/images/likedbutton.png`;
            if (likeCountElem.textContent === "") {
                likeCountElem.textContent = "You";
                postLikeImg.src = `${baseUrl}/images/postLike.png`;
            } else if (likeCountElem.textContent.split(" ")[0] === "1") {
                likeCountElem.textContent = "You and 1 other";
            } else {
                likeCountElem.textContent = `You and ${likeCountElem.textContent.split(" ")[0]} others`;
            }
        } else {
            likeBtnImg.src = `${baseUrl}/images/likebutton.png`;
            if (likeCountElem.textContent === "You") {
                likeCountElem.textContent = "";
                postLikeImg.src = `${baseUrl}/images/white-solid-color.jpg`;
            } else if (likeCountElem.textContent.split(" ")[2] === "1") {
                likeCountElem.textContent = "1 other";
            } else {
                likeCountElem.textContent = `${likeCountElem.textContent.split(" ")[2]} others`;
            }
        }
    });

    // Profile/cover image upload triggers
    let currentprofileImg = $(".myProfileHeaderProfileImg")[0];
    let input = $(".myProfileHeaderProfieUpload")[0];
    let currentCoverImg = $(".myProfileHeaderCoverEditBtnDiv")[0];
    let input1 = $(".myProfileHeaderCoverUpload")[0];

    currentprofileImg.onclick = function () {
        var uploadImg = document.getElementsByClassName("myProfileHeaderProfieUploadImg")[0];
        if (uploadImg && uploadImg.style.visibility !== "hidden" && uploadImg.offsetParent !== null) {
            input.click();
        }
    };

    currentCoverImg.onclick = function () {
        input1.click();
    };

    $("#result")[0].style.padding = "0px";
    if ($(".postOptionLeftDiv2")[0].offsetHeight == 213) {
        $(".postOptionLeftDiv3")[0].style.top = "125px";
    } else {
        $(".postOptionLeftDiv3")[0].style.top = "255px";
    }

    setTimeout(function () {
        document.getElementsByTagName('body')[0].style.visibility = "visible";
    }, 5);

    setTimeout(function () {
        let urlParts = $(location).attr('href').substr(35 + location.host.length).split('#');
        if (urlParts.length == 2) {
            document.getElementById(urlParts[1]).scrollIntoView(true);
        }
        if (urlParts.length == 3) {
            document.getElementById(urlParts[1]).getElementsByClassName("myCommentDiv")[0].click();
        }
    }, 250);
});