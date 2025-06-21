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
}

$(document).ready(function () {
    //displays the settings options when profile photo from search bar is clicked
    $(".myProfilelogoImgRight").click(function () {
        if (document.getElementsByClassName("settingDiv")[0].style.visibility == "hidden") {
            document.getElementsByClassName("settingDiv")[0].style.visibility = "visible"
        } else if (document.getElementsByClassName("settingDiv")[0].style.visibility == "visible") {
            document.getElementsByClassName("settingDiv")[0].style.visibility = "hidden"
        }

        var value = {}
        $.post({
            url: 'https://' + location.host + '/Profile/GetProfileDetails',
            method: 'Post',
            data: value,
            async: false,
            success: function (data) {
                myEmail = data[0].email;
                document.getElementsByClassName("searchFeedSettingProfileName")[0].textContent = data[0].firstName + " " + data[0].surname;
                document.getElementsByClassName("searchFeedSettingProfileImg")[0].src = "http://127.0.0.1:8080/" + data[0].profileImagePath.substr(64)
            }
        })
    })

    //populates notifications
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
            //maxiumun 10 notifications showed
            else {
                if (data.length > 10) {
                    var notiLength = 10;
                }
                else {
                    var notiLength = data.length
                }

                for (var i = 0; i < notiLength; i++) {
                    //creates a notification div as per the notification type
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
                        //populate individual notification
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

                    //sets notification count
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
                }
            }

            //display notification count
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

    //$(".myProfilelogoImgRight").click(function () {
    //    console.log(document.getElementsByClassName("settingDiv")[0].style.visibility)
    //    //if (document.getElementsByClassName("settingDiv")[0].style.visibility == 'hidden') {
    //    //    document.getElementsByClassName("settingDiv")[0].style.visibility = "visible"
    //    //} else if (document.getElementsByClassName("settingDiv")[0].style.visibility == "visible") {
    //    //    document.getElementsByClassName("settingDiv")[0].style.visibility = "hidden"
    //    //}
    //})

    //when profile name is clicked under the settings option
    $(".searchFeedSettingProfileNameDiv").click(function () {
        $.post({
            url: 'https://' + location.host + '/Profile/GetProfileDetails',
            method: 'Post',
            data: value,
            async: false,
            success: function (data) {
                window.location.href = "https://" + window.location.host + "/Profile/ProfileData?email=" + data[0].email;
            }
        })
    })

    //populates profile name and image in search bar and settings option
    var value = {}
    $.post({
        url: 'https://' + location.host + '/Profile/GetProfileDetails',
        method: 'Post',
        data: value,
        async: false,
        success: function (data) {
            myEmail = data[0].email;
            document.getElementsByClassName("searchFeedSettingProfileName")[0].textContent = data[0].firstName + " " + data[0].surname;
            document.getElementsByClassName("searchFeedSettingProfileImg")[0].src = "http://127.0.0.1:8080/" + data[0].profileImagePath.substr(64)
            document.getElementsByClassName("myProfilelogoImgRight")[0].src = "http://127.0.0.1:8080/" + data[0].profileImagePath.substr(64);
        }
    })

    //redirects to settings page when settings button is clicked
    $(".searchFeedSettingOptionDiv").click(function () {
        $.post({
            url: 'https://' + location.host + '/Profile/GetProfileDetails',
            method: 'Post',
            data: value,
            async: false,
            success: function (data) {
                window.location.href = "https://" + window.location.host + "/Profile/Settings";
            }
        })
    })

    //logs out user account
    $(".searchFeedSettingLogoutOptionDiv").click(function () {
        window.location.href = "https://" + window.location.host
        $.post('https://' + location.host + '/Profile/Logout')
    })

    //displays notification
    $("#notiIconDiv").click(function () {
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

        //changes notification status to read, when notification is clicked
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
});