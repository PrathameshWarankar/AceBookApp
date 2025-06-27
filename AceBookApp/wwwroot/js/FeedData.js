//function executed when creating a new post
function ShowCreatePost() {
    var modal = document.getElementById("createPostDialog");
    var searchOpacity = document.getElementById("searchBarDiv");
    var rightOpacity = document.getElementById("rightFeed");
    var leftOpacity = document.getElementById("leftFeed");
    var createPostFeedOpacity = document.getElementById("createPostFeed");
    var feedPostOpacity = document.getElementById("feedPostSection");

    searchOpacity.style.opacity = 0.2;
    leftOpacity.style.opacity = 0.2;
    rightOpacity.style.opacity = 0.2;
    createPostFeedOpacity.style.opacity = 0.2;
    feedPostOpacity.style.opacity = 0.2;
    modal.style.display = "block";
    document.body.style.overflow = 'hidden';
}

//method to check if photo/caption is present when creating post
function CheckCreatePostInput() {
    var fileInput = document.getElementById('fileInput');
    var files = fileInput.files;
    var submitButton = document.getElementById("actualUploadbtn");
    var form = document.getElementById("createPostForm");

    if (files.length === 0) {
        submitButton.style.cursor = "not-allowed";
        // Prevent form submission if no file is selected
        form.addEventListener("submit", handleFormSubmit, { once: true });
    } else {
        submitButton.style.cursor = "pointer";
        // Remove any previously added submit listener if a file is selected
        form.removeEventListener("submit", handleFormSubmit);
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    console.log("Form submission prevented because no file was selected.");
}

//function executed when cancel button clicked in new post window
function Cancel() {
    var modal = document.getElementById("createPostDialog");
    var searchOpacity = document.getElementById("searchBarDiv");
    var rightOpacity = document.getElementById("rightFeed");
    var leftOpacity = document.getElementById("leftFeed");
    var createPostFeedOpacity = document.getElementById("createPostFeed");
    var feedPostOpacity = document.getElementById("feedPostSection");

    searchOpacity.style.opacity = 1;
    leftOpacity.style.opacity = 1;
    rightOpacity.style.opacity = 1;
    createPostFeedOpacity.style.opacity = 1;
    feedPostOpacity.style.opacity = 1;
    modal.style.display = "none";
    document.body.style.overflow = 'visible';
}

function showError(error) {
    alert("An error occurred: " + error);
}

//function executed when hovered over likes count
function DisplayLikes(myData) {
    var value = {
        "id": myData.id
    }
    $.ajax({
        url: 'https://' + location.host + '/Feed/GetLikesBy',
        method: 'Post',
        data: value,
        success: function (data) {
            var result = '';
            for (var i = 0; i < data.length; i++) {
                //generates names of accounts which liked the post
                result = result + '<span class="likedEmail">' + data[i].likedByName + '</span>' + '</br>'
            }
            document.getElementById(myData.id).getElementsByClassName("likedNames")[0].style.display = "block";
            document.getElementById(myData.id).getElementsByClassName("likedNames")[0].innerHTML = result
        },
        error: function (xhr, status, error) {
            showError(error);
        }
    })
}

//function executed when removed hover from likes count
function DisplayLikesHide(myData) {
    document.getElementById(myData.id).getElementsByClassName("likedNames")[0].style.display = "none";
}

//function executed to display comments count
function GetCommentsCount() {
    $.ajax({
        //populates the comments count
        url: 'https://' + location.host + '/Feed/AllPostIds',
        method: 'Post',
        data: "",
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                let postId = data[i];

                let value = {
                    "id": data[i]
                }
                $.ajax({
                    url: 'https://' + location.host + '/Feed/GetCommentsBy',
                    method: 'Post',
                    data: value,
                    success: function (data) {
                        if (data.length == 1) {
                            document.getElementById(postId).getElementsByClassName("commentCountDiv")[0].getElementsByClassName("commentCount")[0].innerHTML = data.length + " comment";
                        } else {
                            document.getElementById(postId).getElementsByClassName("commentCountDiv")[0].getElementsByClassName("commentCount")[0].innerHTML = data.length + " comments";
                        }
                    },
                    error: function (xhr, status, error) {
                        showError(error);
                    }
                })
            }
        },
        error: function (xhr, status, error) {
            showError(error);
        }
    })
}

//function executed to show comment section
function ShowComments(myData) {
    if (document.getElementById(myData.id).getElementsByClassName("commentSection")[0].style.display == "block") {
        document.getElementById(myData.id).getElementsByClassName("commentSection")[0].style.display = "none";
    }
    else {
        document.getElementById(myData.id).getElementsByClassName("commentSection")[0].style.display = "block";
    }

    document.getElementById(myData.id).getElementsByClassName("commentSection")[0].getElementsByClassName("addComment")[0].focus();
}

//function executed to fetech all the comments on a post
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
            document.getElementById(myData).getElementsByClassName("CommentsList")[0].innerHTML = result
            UpdateCommentCount(myData);
        },
        error: function (xhr, status, error) {
            showError(error);
        }
    })
}

//function used to add new comment
function AddingComment(myData) {
    var val;

    if (myData.postId == undefined) {
        val = myData.id
    } else {
        val = myData.postId
    }

    GetCommentList(val);
    var input = document.getElementById(val).getElementsByClassName("commentSection")[0].getElementsByClassName("addComment")[0];

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
                    setTimeout(() => GetCommentList(val), 750);
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

function UpdateCommentCount(postId) {
    var value = { "id": postId };
    $.ajax({
        url: 'https://' + location.host + '/Feed/GetCommentsBy',
        method: 'Post',
        data: value,
        success: function (data) {
            var countText = data.length === 1 ? "1 comment" : data.length + " comments";
            var postElem = document.getElementById(postId);
            if (postElem) {
                var countElem = postElem.getElementsByClassName("commentCount")[0];
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

$(document).ready(function () {
    let btn = document.getElementById("inputAreaSpan");
    let input = document.getElementById("fileInput")

    btn.onclick = function () {
        input.click();
    }

    let file;

    input.addEventListener('change', function () {
        file = this.files[0];

        let fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            let fileURL = fileReader.result;
            let imgTag = `<img class="img1" src="${fileURL}">`
            btn.innerHTML = imgTag;
        }
    })

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
                    likedByMe.getElementsByClassName("likeBtnImg")[0].src = "https://" + location.host + "/images/likedbutton.png"

                    if (likedByMe.getElementsByClassName("likeCount")[0].textContent.split(" ")[0] == "1") {
                        likedByMe.getElementsByClassName("likeCount")[0].textContent = "You"
                    }
                    else if (likedByMe.getElementsByClassName("likeCount")[0].textContent.split(" ")[0] == "2") {
                        likedByMe.getElementsByClassName("likeCount")[0].textContent = "You and " + (parseInt(likedByMe.getElementsByClassName("likeCount")[0].textContent.split(" ")[0]) - 1) + " other";
                    }
                    else {
                        likedByMe.getElementsByClassName("likeCount")[0].textContent = "You and " + (parseInt(likedByMe.getElementsByClassName("likeCount")[0].textContent.split(" ")[0]) - 1) + " others";
                    }
                }

            }
        },
        error: function (xhr, status, error) {
            showError(error);
        }
    });

    $(document).on("click", ".likeDiv", function () {
        $.ajax('https://' + location.host + likedUrl + '?id=' + this.parentNode.parentNode.id);

        var imgSrc = document.getElementById(this.parentNode.parentNode.id);
        if (imgSrc.getElementsByClassName("likeBtnImg")[0].src == "https://" + location.host + "/images/likebutton.png") {
            imgSrc.getElementsByClassName("likeBtnImg")[0].src = "https://" + location.host + "/images/likedbutton.png"

            if (imgSrc.getElementsByClassName("likeCount")[0].textContent == "") {
                imgSrc.getElementsByClassName("likeCount")[0].textContent = "You"
                imgSrc.getElementsByClassName("postLike")[0].src = "https://" + location.host + "/images/postLike.png"

            }
            else if (imgSrc.getElementsByClassName("likeCount")[0].textContent.split(" ")[0] == "1") {
                imgSrc.getElementsByClassName("likeCount")[0].textContent = "You and " + imgSrc.getElementsByClassName("likeCount")[0].textContent.split(" ")[0] + " other";
            }
            else {
                imgSrc.getElementsByClassName("likeCount")[0].textContent = "You and " + imgSrc.getElementsByClassName("likeCount")[0].textContent.split(" ")[0] + " others";
            }
        }
        else {
            imgSrc.getElementsByClassName("likeBtnImg")[0].src = "https://" + location.host + "/images/likebutton.png"

            if (imgSrc.getElementsByClassName("likeCount")[0].textContent == "You") {
                imgSrc.getElementsByClassName("likeCount")[0].textContent = ""
                imgSrc.getElementsByClassName("postLike")[0].src = "https://" + location.host + "/images/white-solid-color.jpg"

            }
            else if (imgSrc.getElementsByClassName("likeCount")[0].textContent.split(" ")[2] == "1") {
                imgSrc.getElementsByClassName("likeCount")[0].textContent = imgSrc.getElementsByClassName("likeCount")[0].textContent.split(" ")[2] + " other";
            }
            else {
                imgSrc.getElementsByClassName("likeCount")[0].textContent = imgSrc.getElementsByClassName("likeCount")[0].textContent.split(" ")[2] + " others";
            }
        }
    });

    $.ajax({
        //populates the contacts section
        url: 'https://' + location.host + '/Feed/GetContacts',
        method: 'Post',
        data: "",
        success: function (data) {
            var result = '';
            for (var i = 0; i < data.length; i++) {
                var value = {
                    "email": data[i]
                }
                $.ajax({
                    url: 'https://' + location.host + '/Profile/GetProfileDetails',
                    method: 'Post',
                    data: value,
                    success: function (data1) {
                        if (data1[0].status == "Online") {
                            result = result + '<div class="contactDiv"><div class="contactImg"><img class="contactImg" src="' + 'http://127.0.0.1:8080/' + data1[0].profileImagePath.substr(64) + '"/><div class="onlineMarkerBG"><div class="onlineMarker"></div></div></div><a class="contactData" href="/Profile/ProfileData?email=' + data1[0].email + '">' + data1[0].firstName + " " + data1[0].surname + '</a></div>'
                        }
                        else {
                            result = result + '<div class="contactDiv"><div class="contactImg"><img class="contactImg" src="' + 'http://127.0.0.1:8080/' + data1[0].profileImagePath.substr(64) + '"/></div><a class="contactData" href="/Profile/ProfileData?email=' + data1[0].email + '">' + data1[0].firstName + " " + data1[0].surname + '</a></div>'
                        }
                    },
                    error: function (xhr, status, error) {
                        showError(error);
                    }
                })
            }
            document.getElementsByClassName("conatctList")[0].innerHTML = result;

            $('.contactDiv').click(function () {
                $(this)[0].getElementsByClassName("contactData")[0].click();
            });

            $('#myProfile').click(function () {
                $(this)[0].getElementsByClassName("myProfileText")[0].getElementsByClassName("myProfileTextA")[0].click();
            });
        },
        error: function (xhr, status, error) {
            showError(error);
        }
    })

    //loads comments count
    GetCommentsCount();

    document.getElementById("result").style.padding = "0px"

    //redirect to friends page
    $('#friends').click(function () {
        document.getElementsByClassName("friendsTextA")[0].click();
    })
});
