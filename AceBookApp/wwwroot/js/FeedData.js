
// Show the create post modal and dim the background
function ShowCreatePost() {
    var modal = document.getElementById("createPostDialog");
    var searchOpacity = document.getElementById("searchBarDiv");
    var rightOpacity = document.getElementById("rightFeed");
    var leftOpacity = document.getElementById("leftFeed");
    var createPostFeedOpacity = document.getElementById("createPostFeed");
    var feedPostOpacity = document.getElementById("feedPostSection");

    [searchOpacity, leftOpacity, rightOpacity, createPostFeedOpacity, feedPostOpacity].forEach(function (el) {
        if (el) el.style.opacity = 0.2;
    });
    if (modal) modal.style.display = "block";
    document.body.style.overflow = 'hidden';
}

// Validate post input before submission
function CheckCreatePostInput() {
    var fileInput = document.getElementById('fileInput');
    var files = fileInput ? fileInput.files : [];
    var submitButton = document.getElementById("actualUploadbtn");
    var form = document.getElementById("createPostForm");

    if (!submitButton || !form) return;

    if (files.length === 0) {
        submitButton.style.cursor = "not-allowed";
        form.addEventListener("submit", handleFormSubmit, { once: true });
    } else {
        submitButton.style.cursor = "pointer";
        form.removeEventListener("submit", handleFormSubmit);
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    console.log("Form submission prevented because no file was selected.");
}

// Hide the create post modal and restore background
function Cancel() {
    var modal = document.getElementById("createPostDialog");
    var searchOpacity = document.getElementById("searchBarDiv");
    var rightOpacity = document.getElementById("rightFeed");
    var leftOpacity = document.getElementById("leftFeed");
    var createPostFeedOpacity = document.getElementById("createPostFeed");
    var feedPostOpacity = document.getElementById("feedPostSection");

    [searchOpacity, leftOpacity, rightOpacity, createPostFeedOpacity, feedPostOpacity].forEach(function (el) {
        if (el) el.style.opacity = 1;
    });
    if (modal) modal.style.display = "none";
    document.body.style.overflow = 'visible';
}

function showError(error) {
    alert("An error occurred: " + error);
}

// Show list of users who liked a post
function DisplayLikes(myData) {
    var value = { "id": myData };
    $.ajax({
        url: 'https://' + location.host + '/Feed/GetLikesBy',
        method: 'POST',
        data: value,
        success: function (data) {
            var result = '';
            for (var i = 0; i < data.length; i++) {
                result += '<span class="likedEmail">' + data[i].likedByName + '</span></br>';
            }
            var likedNames = document.getElementById(myData)?.getElementsByClassName("likedNames")[0];
            if (likedNames) {
                likedNames.style.display = "block";
                likedNames.innerHTML = result;
            }
        },
        error: function (xhr, status, error) {
            showError(error);
        }
    });
}

// Hide the likes list
function DisplayLikesHide(myData) {
    var likedNames = document.getElementById(myData)?.getElementsByClassName("likedNames")[0];
    if (likedNames) likedNames.style.display = "none";
}

// Fetch and display comment counts for all posts
function GetCommentsCount() {
    $.ajax({
        url: 'https://' + location.host + '/Feed/AllPostIds',
        method: 'POST',
        data: "",
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                let postId = data[i];
                let value = { "id": postId };
                $.ajax({
                    url: 'https://' + location.host + '/Feed/GetCommentsBy',
                    method: 'POST',
                    data: value,
                    success: function (comments) {
                        var postElem = document.getElementById(postId);
                        if (postElem) {
                            var countElem = postElem.getElementsByClassName("commentCountDiv")[0]?.getElementsByClassName("commentCount")[0];
                            if (countElem) {
                                countElem.innerHTML = comments.length === 1 ? "1 comment" : comments.length + " comments";
                            }
                        }
                    },
                    error: function (xhr, status, error) {
                        showError(error);
                    }
                });
            }
        },
        error: function (xhr, status, error) {
            showError(error);
        }
    });
}

// Toggle comment section visibility and focus input
function ShowComments(myData) {
    var commentSection = document.getElementById(myData)?.getElementsByClassName("commentSection")[0];
    if (!commentSection) return;
    commentSection.style.display = commentSection.style.display === "block" ? "none" : "block";
    var addComment = commentSection.getElementsByClassName("addComment")[0];
    if (addComment) addComment.focus();
}

// Fetch and display all comments for a post
function GetCommentList(myData) {
    var value1 = { "id": myData };
    $.ajax({
        url: 'https://' + location.host + '/Feed/GetCommentsBy',
        method: 'POST',
        data: value1,
        success: function (data) {
            var result = '';
            for (var i = 0; i < data.length; i++) {
                result += '<div class="commentDetails"><div class="commentImgDiv"><img class="commentImg" src="' + serverUrl + data[i].commentedByImagepath + '"/></div><div class="commentData"><div><a class="commentName" href="/Profile/ProfileData/' + data[i].commentedBy + '">' + data[i].commentedByName + '</a></br><span class="commentText"> ' + data[i].commentedText + '</span ></div></div></div>';
            }
            var commentsList = document.getElementById(myData)?.getElementsByClassName("CommentsList")[0];
            if (commentsList) commentsList.innerHTML = result;
            UpdateCommentCount(myData);
        },
        error: function (xhr, status, error) {
            showError(error);
        }
    });
}

// Add a new comment to a post
function AddingComment(myData) {
    GetCommentList(myData);
    var commentSection = document.getElementById(myData)?.getElementsByClassName("commentSection")[0];
    if (!commentSection) return;
    var input = commentSection.getElementsByClassName("addComment")[0];
    if (!input) return;

    // Remove any existing event listener by cloning the node
    var newInput = input.cloneNode(true);
    input.parentNode.replaceChild(newInput, input);
    input = newInput;

    let isSubmitting = false;

    input.addEventListener("keyup", function (event) {
        if (event.key === "Enter" && input.value.trim() !== '' && !isSubmitting) {
            isSubmitting = true;
            var value = { "id": myData, "text": input.value };
            $.ajax({
                url: 'https://' + location.host + '/Feed/Commented',
                method: 'POST',
                data: value,
                success: function () {
                    input.value = '';
                    setTimeout(() => GetCommentList(myData), 750);
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

// Update the comment count for a post
function UpdateCommentCount(postId) {
    var value = { "id": postId };
    $.ajax({
        url: 'https://' + location.host + '/Feed/GetCommentsBy',
        method: 'POST',
        data: value,
        success: function (data) {
            var postElem = document.getElementById(postId);
            if (postElem) {
                var countElem = postElem.getElementsByClassName("commentCount")[0];
                if (countElem) {
                    countElem.innerHTML = data.length === 1 ? "1 comment" : data.length + " comments";
                }
            }
        },
        error: function (xhr, status, error) {
            showError(error);
        }
    });
}

$(document).ready(function () {
    var btn = document.getElementById("inputAreaSpan");
    var input = document.getElementById("fileInput");

    if (btn && input) {
        btn.onclick = function () {
            input.click();
        };

        input.addEventListener('change', function () {
            var file = this.files[0];
            if (!file) return;
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function () {
                var fileURL = fileReader.result;
                btn.innerHTML = `<img class="img1" src="${fileURL}">`;
            };
        });
    }

    // Populate likes section
    $.ajax({
        url: 'https://' + location.host + '/Profile/GetPostsLikedByMe',
        method: 'POST',
        data: {},
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var op = data[i];
                var likedByMe = document.getElementById(op);
                if (!likedByMe) continue;
                var likeBtnImg = likedByMe.getElementsByClassName("likeBtnImg")[0];
                var likeCountElem = likedByMe.getElementsByClassName("likeCount")[0];
                if (likeBtnImg) likeBtnImg.src = "https://" + location.host + "/images/likedbutton.png";
                if (likeCountElem) {
                    var count = likeCountElem.textContent.split(" ")[0];
                    if (count == "1") {
                        likeCountElem.textContent = "You";
                    } else if (count == "2") {
                        likeCountElem.textContent = "You and 1 other";
                    } else {
                        likeCountElem.textContent = "You and " + (parseInt(count) - 1) + " others";
                    }
                }
            }
        },
        error: function (xhr, status, error) {
            showError(error);
        }
    });

    // Like button click handler
    $(document).on("click", ".likeDiv", function () {
        var postElem = this.parentNode.parentNode;
        var postId = postElem.id;
        $.ajax('https://' + location.host + likedUrl + '?id=' + postId);

        var likeBtnImg = postElem.getElementsByClassName("likeBtnImg")[0];
        var likeCountElem = postElem.getElementsByClassName("likeCount")[0];
        var postLike = postElem.getElementsByClassName("postLike")[0];

        if (likeBtnImg && likeBtnImg.src == "https://" + location.host + "/images/likebutton.png") {
            likeBtnImg.src = "https://" + location.host + "/images/likedbutton.png";
            if (likeCountElem) {
                if (likeCountElem.textContent == "") {
                    likeCountElem.textContent = "You";
                    if (postLike) postLike.src = "https://" + location.host + "/images/postLike.png";
                } else if (likeCountElem.textContent.split(" ")[0] == "1") {
                    likeCountElem.textContent = "You and 1 other";
                } else {
                    likeCountElem.textContent = "You and " + likeCountElem.textContent.split(" ")[0] + " others";
                }
            }
        } else if (likeBtnImg) {
            likeBtnImg.src = "https://" + location.host + "/images/likebutton.png";
            if (likeCountElem) {
                if (likeCountElem.textContent == "You") {
                    likeCountElem.textContent = "";
                    if (postLike) postLike.src = "https://" + location.host + "/images/white-solid-color.jpg";
                } else if (likeCountElem.textContent.split(" ")[2] == "1") {
                    likeCountElem.textContent = "1 other";
                } else {
                    likeCountElem.textContent = likeCountElem.textContent.split(" ")[2] + " others";
                }
            }
        }
    });

    // Populate contacts section
    $.ajax({
        url: 'https://' + location.host + '/Feed/GetContacts',
        method: 'POST',
        data: "",
        success: function (data) {
            var result = '';
            var pending = data.length;
            if (pending === 0) {
                document.getElementsByClassName("conatctList")[0].innerHTML = result;
                return;
            }
            for (var i = 0; i < data.length; i++) {
                (function (email) {
                    var value = { "email": email };
                    $.ajax({
                        url: 'https://' + location.host + '/Profile/GetProfileDetails',
                        method: 'POST',
                        data: value,
                        success: function (data1) {
                            if (data1.status == "Online") {
                                result += '<div class="contactDiv"><div class="contactImg"><img class="contactImg" src="' + serverUrl + data1.profileImagePath.substr(64) + '"/><div class="onlineMarkerBG"><div class="onlineMarker"></div></div></div><a class="contactData" href="/Profile/ProfileData?email=' + data1.email + '">' + data1.firstName + " " + data1.surname + '</a></div>';
                            } else {
                                result += '<div class="contactDiv"><div class="contactImg"><img class="contactImg" src="' + serverUrl + data1.profileImagePath.substr(64) + '"/></div><a class="contactData" href="/Profile/ProfileData?email=' + data1.email + '">' + data1.firstName + " " + data1.surname + '</a></div>';
                            }
                        },
                        complete: function () {
                            pending--;
                            if (pending === 0) {
                                document.getElementsByClassName("conatctList")[0].innerHTML = result;
                                $('.contactDiv').click(function () {
                                    $(this)[0].getElementsByClassName("contactData")[0].click();
                                });
                                $('#myProfile').click(function () {
                                    $(this)[0].getElementsByClassName("myProfileText")[0].getElementsByClassName("myProfileTextA")[0].click();
                                });
                            }
                        },
                        error: function (xhr, status, error) {
                            showError(error);
                        }
                    });
                })(data[i]);
            }
        },
        error: function (xhr, status, error) {
            showError(error);
        }
    });

    // Load comments count
    GetCommentsCount();

    var resultElem = document.getElementById("result");
    if (resultElem) resultElem.style.padding = "0px";

    // Redirect to friends page
    $('#friends').click(function () {
        var friendsTextA = document.getElementsByClassName("friendsTextA")[0];
        if (friendsTextA) friendsTextA.click();
    });
});