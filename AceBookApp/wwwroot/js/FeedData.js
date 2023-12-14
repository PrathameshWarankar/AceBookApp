
function Search(data) {
    var value = {
        "name": data
    }
    $.post({
        url: 'https://' + location.host + '/Feed/SearchBy',
        method: 'Post',
        data: value,
        //success: function (data) {
        //    result = '<option class="emptyOutput" value = "empty">' + "" + '</option>';
        //    for (var i = 0; i < data.length; i++) {
        //        result = result + '<option class="searchOutput"  data-imagesrc="https://i.imgur.com/8ScLNnk.png" value = "' + 'https://' + location.host + '/Feed/Profile/' + data[i].email + '">' + data[i].firstName + " " + data[i].surname + '</option>'
        //        //console.log(result)
        //    }
        //    document.getElementById("result").innerHTML = '<select id="searchResultID" class="searchResult" size="' + String(Number(data.length) + 1) + '">' + result + '</select>'
        //    $('.searchResult').on('change', function () {
        //        window.location.href = $(this).val();
        //    });
        //    if (document.getElementsByClassName("searchResult")[0].size > 1) {
        //        document.getElementsByClassName("searchResult")[0].style.boxShadow = "0 1px 3px rgb(0 0 0 / 0.15)";
        //    }
        //    else if (document.getElementsByClassName("searchResult")[0].size <= 1) {
        //        document.getElementsByClassName("searchResult")[0].style.boxShadow = "none";
        //    }
        //}
        success: function (data) {
            var result = '';
;            for (var i = 0; i < data.length; i++) {
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
            //console.log(result);
        }
    })
}

function ShowCreatePost() {
    var modal = document.getElementById("createPostDialog");
    var searchOpacity = document.getElementById("searchFeed");
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

function cancel() {
    var modal = document.getElementById("createPostDialog");
    var searchOpacity = document.getElementById("searchFeed");
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
                //console.log(data[i])
                result = result + '<span class="likedEmail">' + data[i].likedByName + '</span>' + '</br>'
            }
            //console.log(document.getElementById(myData.id))
            document.getElementById(myData.id).getElementsByClassName("likedNames")[0].style.display = "block";
            document.getElementById(myData.id).getElementsByClassName("likedNames")[0].innerHTML = result
            //console.log(document.getElementById(myData.id))
        }
    })
}

function DisplayLikesHide(myData) {
    document.getElementById(myData.id).getElementsByClassName("likedNames")[0].style.display = "none";
}

function ShowComments(myData) {
    if (document.getElementById(myData.id).getElementsByClassName("commentSection")[0].style.display == "block") {
        document.getElementById(myData.id).getElementsByClassName("commentSection")[0].style.display = "none";
    }
    else {
        document.getElementById(myData.id).getElementsByClassName("commentSection")[0].style.display = "block";
    }
    
    document.getElementById(myData.id).getElementsByClassName("commentSection")[0].getElementsByClassName("addComment")[0].focus();
    /*console.log("clicked")*/
}

function getCommentList(myData) {
    var value1 = {
        "id": myData.id
    }

    $.post({
        url: 'https://' + location.host + '/Feed/GetCommentsBy',
        method: 'Post',
        data: value1,
        success: function (data) {
            var result = '';
            for (var i = 0; i < data.length; i++) {
                //console.log(data[i])
                result = result + '<div class="commentDetails"><div class="commentImgDiv"><img class="commentImg" src="' + 'http://127.0.0.1:8080/' + data[i].commentedByImagepath + '"/></div><div class="commentData"><div><a class="commentName" href="/Profile/ProfileData/' + data[i].commentedBy + '">' + data[i].commentedByName + '</a></br><span class="commentText"> ' + data[i].commentedText + '</span ></div></div></div>'
            }
            
            //console.log(document.getElementById(myData.id))
            document.getElementById(myData.id).getElementsByClassName("CommentsList")[0].innerHTML = result
            //console.log(data.length);
            //console.log(document.getElementById(myData.id))
        }
    })
}

function addingComment(myData) {

    getCommentList(myData);
    var input = document.getElementById(myData.id).getElementsByClassName("commentSection")[0].getElementsByClassName("addComment")[0];  

    input.addEventListener("keyup", (event) => {
        if (event.key == "Enter") {
            var value = {
                "id": myData.id,
                "text": input.value
            }
            //console.log(input.value)
            if (input.value !== '') {
                $.post({
                    url: 'https://' + location.host + '/Feed/Commented',
                    method: 'Post',
                    data: value,
                    success: function (data) {
                        //console.log("Success");
                        input.value = '';
                        setTimeout(getCommentList(myData), 750);
                    }                    
                })              
            }   
        }
    });
}

$(document).ready(function () {

    $.post({
        url: 'https://' + location.host + '/Feed/GetContacts',
        method: 'Post',
        data: "",
        success: function (data) {
            //console.log("success")
            var result = '';
            for (var i = 0; i < data.length; i++) {
                console.log(data[i])

                var value = {
                    "email": data[i]
                }
                $.post({
                    url: 'https://' + location.host + '/Profile/GetProfileDetails',
                    method: 'Post',
                    data: value,
                    async: false,
                    success: function (data1) {
                        console.log(data1[0])
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

    document.getElementById("result").style.padding = "0px"

    var value = {
        "email": $(location).attr('href').substr(50)
    }
    $.post({
        url: 'https://' + location.host + '/Profile/GetProfileDetails',
        method: 'Post',
        data: value,
        async: false,
        success: function (data) {
            document.getElementsByClassName("myProfilelogoImgRight")[0].src = "http://127.0.0.1:8080/" + data[0].profileImagePath.substr(64);
        }
    })

    $(".myProfilelogoImgRight").click(function () {
        if (document.getElementsByClassName("searchFeedSettingDiv")[0].style.visibility == "hidden") {
            document.getElementsByClassName("searchFeedSettingDiv")[0].style.visibility = "visible"
        } else if (document.getElementsByClassName("searchFeedSettingDiv")[0].style.visibility == "visible") {
            document.getElementsByClassName("searchFeedSettingDiv")[0].style.visibility = "hidden"
        }
    })

    $(".searchFeedSettingProfileNameDiv").click(function () {
        $.post({
            url: 'https://' + location.host + '/Profile/GetMyProfileDetails',
            method: 'Post',
            data: value,
            async: false,
            success: function (data) {
                window.location.href = "https://" + window.location.host + "/Profile/ProfileData?email=" + data[0].email;
            }
        })
    })

    var value = {}
    $.post({
        url: 'https://' + location.host + '/Profile/GetMyProfileDetails',
        method: 'Post',
        data: value,
        async: false,
        success: function (data) {
            myEmail = data[0].email;
            document.getElementsByClassName("searchFeedSettingProfileName")[0].textContent = data[0].firstName + " " + data[0].surname;
            document.getElementsByClassName("searchFeedSettingProfileImg")[0].src = "http://127.0.0.1:8080/" + data[0].profileImagePath.substr(64)
        }
    })

    $(".searchFeedSettingOptionDiv").click(function () {
        $.post({
            url: 'https://' + location.host + '/Profile/GetMyProfileDetails',
            method: 'Post',
            data: value,
            async: false,
            success: function (data) {
                window.location.href = "https://" + window.location.host + "/Profile/Settings";
            }
        })
    })

    $(".searchFeedSettingLogoutOptionDiv").click(function () {
        window.location.href = "https://" + window.location.host
        $.post('https://' + location.host + '/Profile/Logout')
    })

    $.post({
        url: 'https://' + location.host + '/Feed/GetMyNotifications',
        method: 'Post',
        data: "",
        async: false,
        success: function (data) {
            document.getElementsByClassName("searchFeedNotiDiv")[0].innerHTML = "";
            var notiCount = 0;

            if (data.length == 0) {
                var notiDiv = document.createElement("div");
                notiDiv.innerHTML = "No notifications";
                notiDiv.className = "notiContent";
                document.getElementsByClassName("searchFeedNotiDiv")[0].appendChild(notiDiv);
            }
            else {
                if (data.length > 10) {
                    var notiLength = 10;
                }
                else {
                    var notiLength = data.length
                }
                for (var i = 0; i < notiLength; i++) {

                    var notiDiv = document.createElement("div");
                    if (data[i].notiType == "Like") {
                        notiDiv.id = data[i].postId + "#Like";
                    }
                    else if (data[i].notiType == "Comment") {
                        notiDiv.id = data[i].postId + "#Comment";
                    }
                    else {
                        notiDiv.id = data[i].notifiedBy + "#Add Friend";
                    }

                    notiDiv.className = "notiContent";

                    var value = {
                        "email": data[i].notifiedBy
                    }
                    $.post({
                        url: 'https://' + location.host + '/Profile/GetProfileDetails',
                        method: 'Post',
                        data: value,
                        async: false,
                        success: function (data1) {
                            if (data[i].notiType == "Like") {
                                notiDiv.innerHTML = '<a href="' + 'https://' + location.host + '/Profile/ProfileData?email=' + data[i].notifiedTo + '#' + data[i].postId + '"><img class="notifiedByImg" src="' + "http://127.0.0.1:8080/" + data1[0].profileImagePath.substr(64) + '"/><div class="notifiedByName"><text><b>' + data1[0].firstName + ' ' + data1[0].surname + '</b> liked your photo</text></div><div class="notiMarker"></div></a>'
                            }
                            else if (data[i].notiType == "Comment") {
                                notiDiv.innerHTML = '<a href="' + 'https://' + location.host + '/Profile/ProfileData?email=' + data[i].notifiedTo + '#' + data[i].postId + '#comment"><img class="notifiedByImg" src = "' + "http://127.0.0.1:8080/" + data1[0].profileImagePath.substr(64) + '"/><div class="notifiedByName"><text><b>' + data1[0].firstName + ' ' + data1[0].surname + '</b> commented on your photo</text></div><div class="notiMarker"></a>'
                            }
                            else if (data[i].notiType == "Add Friend") {
                                notiDiv.innerHTML = '<a href="' + 'https://' + location.host + '/Profile/Friends?email=' + data[i].notifiedTo + '"><img class="notifiedByImg" src = "' + "http://127.0.0.1:8080/" + data1[0].profileImagePath.substr(64) + '"/><div class="notifiedByName"><text><b>' + data1[0].firstName + ' ' + data1[0].surname + '</b> sent you friend request</text></div><div class="notiMarker"></a>'
                            }
                        }
                    });

                    document.getElementsByClassName("searchFeedNotiDiv")[0].appendChild(notiDiv);

                    if (data[i].notiStatus == "Unread") {
                        notiCount += 1;
                    }
                    else {
                        document.getElementsByClassName("notiContent")[i].getElementsByClassName("notiMarker")[0].style.visibility = "hidden";
                    }

                    if (document.getElementsByClassName("notifiedByName")[i].offsetHeight == 20) {
                        document.getElementsByClassName("notiMarker")[i].style.top = "-52px"
                        document.getElementsByClassName("notiContent")[i].style.height = document.getElementsByClassName("notifiedByName")[i].offsetHeight + 18;
                    } else {
                        document.getElementsByClassName("notiMarker")[i].style.top = "-68px"
                        document.getElementsByClassName("notiContent")[i].style.height = document.getElementsByClassName("notifiedByName")[i].offsetHeight + 5;
                    }
                    //    console.log(document.getElementsByClassName("notiContent")[i].style.height);
                }
            }   

            if (notiCount == 0) {
                document.getElementsByClassName("searchFeedNotiMarkerDiv")[0].style.visibility = "hidden";
            }
            else {
                document.getElementsByClassName("searchFeedNotiMarkerDiv")[0].style.visibility = "visible";
                document.getElementsByClassName("searchFeedNotiMarkerCountDiv")[0].textContent = notiCount;
                if (notiCount < 10) {
                    document.getElementsByClassName("searchFeedNotiMarkerCountDiv")[0].style.left = "5px"
                }
                else {
                    document.getElementsByClassName("searchFeedNotiMarkerCountDiv")[0].style.left = "1px"
                    document.getElementsByClassName("searchFeedNotiMarkerCountDiv")[0].textContent = 10;
                }
            }
        }

    });

    $(".notiIcon").click(function () {

        if (document.getElementsByClassName("searchFeedNotiDiv")[0].style.visibility == "hidden") {
            document.getElementsByClassName("searchFeedNotiDiv")[0].style.visibility = "visible"
            $(".notiMarker").show();
        }
        else if (document.getElementsByClassName("searchFeedNotiDiv")[0].style.visibility == "visible") {
            document.getElementsByClassName("searchFeedNotiDiv")[0].style.visibility = "hidden"
            $(".notiMarker").hide();
        }

        if (document.getElementsByClassName("searchFeedNotiDiv")[0].style.paddingBottom == "0px" || document.getElementsByClassName("searchFeedNotiDiv")[0].style.paddingBottom.length == 0) {
            document.getElementsByClassName("searchFeedNotiDiv")[0].style.paddingBottom = "8px"
            document.getElementsByClassName("searchFeedNotiDiv")[0].style.paddingTop = "8px"
        } else if (document.getElementsByClassName("searchFeedNotiDiv")[0].style.paddingBottom == "8px") {
            document.getElementsByClassName("searchFeedNotiDiv")[0].style.paddingBottom = "0px"
            document.getElementsByClassName("searchFeedNotiDiv")[0].style.paddingTop = "0px"
        }

        $(".notiContent").click(function () {
            var value = {
                "id": this.id.split('#')[0],
                "type": this.id.split('#')[1]
            }
            $.post({
                url: 'https://' + location.host + '/Feed/UpdateNotificatioStatus',
                method: 'Post',
                data: value,
                async: false,
                success: function (data) { }
            })
        })

    })

    $('#friends').click(function () {
        console.log("Clicked")
        document.getElementsByClassName("friendsTextA")[0].click();
    })
});
