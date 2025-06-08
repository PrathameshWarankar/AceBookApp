/*search functionality
function Search(data) {
    var value = {
        "name": data
    }
    $.post({
        url: 'https://' + location.host + '/Feed/SearchBy',
        method: 'Post',
        data: value,
        success: function (data) {
            var result = '';
            ; for (var i = 0; i < data.length; i++) {
                //generates search results
                result = result + '<div class="searchResultNew"><div class="searchImgDiv"><img class="searchImg" src="' + 'http://127.0.0.1:8080/' + data[i].profileImagePath.substr(64) + '"/></div><div class="searchText"><a class="searchTextA" href="/Profile/ProfileData?email=' + data[i].email + '">' + data[i].firstName + " " + data[i].surname + '</a></div></div>'
            }
            document.getElementById("result").innerHTML = result;

            if (data.length < 1) {
                document.getElementById("result").style.padding = "0px"
            } else if (data.length >= 1) {
                document.getElementById("result").style.paddingBottom = "15px"
                $('.searchResultNew').click(function () {
                    $(this)[0].getElementsByClassName("searchTextA")[0].click();
                });
            }
        }
    })
}*/

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

//function executed when hovered over likes count
function DisplayLikes(myData) {
    var value = {
        "id": myData.id
    }
    $.post({
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
        }
    })
}

//function executed when removed hover from likes count
function DisplayLikesHide(myData) {
    document.getElementById(myData.id).getElementsByClassName("likedNames")[0].style.display = "none";
}

//function executed to display comments count
function GetCommentsCount() {
    $.post({
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
                $.post({
                    url: 'https://' + location.host + '/Feed/GetCommentsBy',
                    method: 'Post',
                    data: value,
                    success: function (data) {
                        if (data.length == 1) {
                            document.getElementById(postId).getElementsByClassName("commentCountDiv")[0].getElementsByClassName("commentCount")[0].innerHTML = data.length + " comment";
                        } else {
                            document.getElementById(postId).getElementsByClassName("commentCountDiv")[0].getElementsByClassName("commentCount")[0].innerHTML = data.length + " comments";
                        }
                    }
                })
            }
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
    $.post({
        url: 'https://' + location.host + '/Feed/GetCommentsBy',
        method: 'Post',
        data: value1,
        success: function (data) {
            var result = '';
            for (var i = 0; i < data.length; i++) {
                result = result + '<div class="commentDetails"><div class="commentImgDiv"><img class="commentImg" src="' + 'http://127.0.0.1:8080/' + data[i].commentedByImagepath + '"/></div><div class="commentData"><div><a class="commentName" href="/Profile/ProfileData/' + data[i].commentedBy + '">' + data[i].commentedByName + '</a></br><span class="commentText"> ' + data[i].commentedText + '</span ></div></div></div>'
            }
            document.getElementById(myData).getElementsByClassName("CommentsList")[0].innerHTML = result
            GetCommentsCount();
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

    input.addEventListener("keyup", (event) => {
        if (event.key == "Enter") {
            var value = {
                "id": val,
                "text": input.value
            }
            if (input.value !== '') {
                $.post({
                    url: 'https://' + location.host + '/Feed/Commented',
                    method: 'Post',
                    data: value,
                    success: function (data) {
                        input.value = '';
                        setTimeout(() => GetCommentList(val), 750);
                    }
                })
            }
        }
    });
}

$(document).ready(function () {
    $.post({
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
                $.post({
                    url: 'https://' + location.host + '/Profile/GetProfileDetails',
                    method: 'Post',
                    data: value,
                    async: false,
                    success: function (data1) {
                        if (data1[0].status == "Online") {
                            result = result + '<div class="contactDiv"><div class="contactImg"><img class="contactImg" src="' + 'http://127.0.0.1:8080/' + data1[0].profileImagePath.substr(64) + '"/><div class="onlineMarkerBG"><div class="onlineMarker"></div></div></div><a class="contactData" href="/Profile/ProfileData?email=' + data1[0].email + '">' + data1[0].firstName + " " + data1[0].surname + '</a></div>'
                        }
                        else {
                            result = result + '<div class="contactDiv"><div class="contactImg"><img class="contactImg" src="' + 'http://127.0.0.1:8080/' + data1[0].profileImagePath.substr(64) + '"/></div><a class="contactData" href="/Profile/ProfileData?email=' + data1[0].email + '">' + data1[0].firstName + " " + data1[0].surname + '</a></div>'
                        }
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
