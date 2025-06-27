var serverUrl = 'http://127.0.0.1:8080/';

function Search(data) {
    var value = {
        "name": data
    }
    $.ajax({
        url: 'https://' + location.host + '/Feed/SearchBy',
        method: 'Post',
        data: value,
        success: function (data) {
            var result = '';
            for (var i = 0; i < data.length; i++) {
                // Defensive: check if data[i] exists and has profileImagePath
                if (data[i] && data[i].profileImagePath) {
                    result += '<div class="searchResultNew"><div class="searchImgDiv"><img class="searchImg" src="' +
                        serverUrl + data[i].profileImagePath.substr(64) +
                        '"/></div><div class="searchText"><a class="searchTextA" href="/Profile/ProfileData?email=' +
                        data[i].email + '">' + data[i].firstName + " " + data[i].surname + '</a></div></div>';
                } else if (data[i]) {
                    // fallback/default image
                    result += '<div class="searchResultNew"><div class="searchImgDiv"><img class="searchImg" src="/images/default-profile.png"/></div><div class="searchText"><a class="searchTextA" href="/Profile/ProfileData?email=' +
                        data[i].email + '">' + data[i].firstName + " " + data[i].surname + '</a></div></div>';
                }
            }
            document.getElementById("result").innerHTML = result;

            if (data.length < 1) {
                document.getElementById("result").style.padding = "0px"
            } else if (data.length >= 1) {
                document.getElementById("result").style.paddingBottom = "15px"
                $('.searchResultNew').click(function () {
                    var anchor = $(this)[0].getElementsByClassName("searchTextA")[0];
                    if (anchor) anchor.click();
                });
            }
        },
        error: function (xhr, status, error) {
            alert("An error occurred: " + error);
        }
    })
}

$(document).ready(function () {
    //displays the settings options when profile photo from search bar is clicked
    $(".myProfilelogoImgRight").click(function () {
        var settingDiv = document.getElementsByClassName("settingDiv")[0];
        if (settingDiv) {
            if (settingDiv.style.visibility == "hidden") {
                settingDiv.style.visibility = "visible"
            } else if (settingDiv.style.visibility == "visible") {
                settingDiv.style.visibility = "hidden"
            }
        }

        var value = {}
        $.ajax({
            url: 'https://' + location.host + '/Profile/GetProfileDetails',
            method: 'Post',
            data: value,
            success: function (data) {
                if (!data) return;
                myEmail = data.email;
                var nameElem = document.getElementsByClassName("searchFeedSettingProfileName")[0];
                var imgElem = document.getElementsByClassName("searchFeedSettingProfileImg")[0];
                if (nameElem) nameElem.textContent = data.firstName + " " + data.surname;
                if (imgElem && data.profileImagePath) imgElem.src = serverUrl + data.profileImagePath.substr(64)
            },
            error: function (xhr, status, error) {
                alert("An error occurred: " + error);
            }
        })
    })

    //populates notifications
    $.ajax({
        url: 'https://' + location.host + '/Feed/GetMyNotifications',
        method: 'Post',
        data: "",
        success: function (data) {
            var notiDivParent = document.getElementsByClassName("searchFeedNotiDiv")[0];
            if (!notiDivParent) return;
            notiDivParent.innerHTML = "";
            var notiCount = 0;

            if (!data || data.length == 0) {
                var notiDiv = document.createElement("div");
                notiDiv.innerHTML = "No notifications";
                notiDiv.className = "notiContent";
                notiDivParent.appendChild(notiDiv);
            } else {
                var notiLength = Math.min(data.length, 10);
                for (var i = 0; i < notiLength; i++) {
                    (function (notiData) {
                        var notiDiv = document.createElement("div");
                        if (notiData.notiType == "Like") {
                            notiDiv.id = notiData.postId + "#Like";
                        } else if (notiData.notiType == "Comment") {
                            notiDiv.id = notiData.postId + "#Comment";
                        } else {
                            notiDiv.id = notiData.notifiedBy + "#Add Friend";
                        }
                        notiDiv.className = "notiContent";
                        // Fetch profile details and render notification
                        $.ajax({
                            url: 'https://' + location.host + '/Profile/GetProfileDetails',
                            method: 'Post',
                            data: { "email": notiData.notifiedBy },
                            success: function (data1) {
                                var profile = Array.isArray(data1) ? data1[0] : data1;
                                var imgSrc = (profile && profile.profileImagePath) ? serverUrl + profile.profileImagePath.substr(64) : "/images/default-profile.png";
                                var name = (profile && profile.firstName && profile.surname) ? profile.firstName + ' ' + profile.surname : "Unknown";
                                if (notiData.notiType == "Like") {
                                    notiDiv.innerHTML = '<a href="' + 'https://' + location.host + '/Profile/ProfileData?email=' + notiData.notifiedTo + '#' + notiData.postId + '"><img class="notifiedByImg" src="' + imgSrc + '"/><div class="notifiedByName"><text><b>' + name + '</b> liked your photo</text></div><div class="notiMarker"></div></a>';
                                } else if (notiData.notiType == "Comment") {
                                    notiDiv.innerHTML = '<a href="' + 'https://' + location.host + '/Profile/ProfileData?email=' + notiData.notifiedTo + '#' + notiData.postId + '#comment"><img class="notifiedByImg" src="' + imgSrc + '"/><div class="notifiedByName"><text><b>' + name + '</b> commented on your photo</text></div><div class="notiMarker"></div></a>';
                                } else if (notiData.notiType == "Add Friend") {
                                    notiDiv.innerHTML = '<a href="' + 'https://' + location.host + '/Profile/Friends?email=' + notiData.notifiedTo + '"><img class="notifiedByImg" src="' + imgSrc + '"/><div class="notifiedByName"><text><b>' + name + '</b> sent you friend request</text></div><div class="notiMarker"></div></a>';
                                }
                                // Set marker visibility and sizing
                                var notifiedByNameElem = notiDiv.getElementsByClassName("notifiedByName")[0];
                                var notiMarkerElem = notiDiv.getElementsByClassName("notiMarker")[0];
                                if (notifiedByNameElem && notiMarkerElem) {
                                    if (notiData.notiStatus !== "Unread") {
                                        notiMarkerElem.style.visibility = "hidden";
                                    }
                                    if (notifiedByNameElem.offsetHeight == 20) {
                                        notiMarkerElem.style.top = "-52px";
                                        notiDiv.style.height = (notifiedByNameElem.offsetHeight + 18) + "px";
                                    } else {
                                        notiMarkerElem.style.top = "-68px";
                                        notiDiv.style.height = (notifiedByNameElem.offsetHeight + 5) + "px";
                                    }
                                }
                            }
                        });
                        notiDivParent.appendChild(notiDiv);
                        if (notiData.notiStatus == "Unread") {
                            notiCount += 1;
                        }
                    })(data[i]);
                }
            }

            //display notification count
            var markerDiv = document.getElementsByClassName("searchFeedNotiMarkerDiv")[0];
            var markerCountDiv = document.getElementsByClassName("searchFeedNotiMarkerCountDiv")[0];
            if (markerDiv && markerCountDiv) {
                if (notiCount == 0) {
                    markerDiv.style.visibility = "hidden";
                } else {
                    markerDiv.style.visibility = "visible";
                    markerCountDiv.textContent = notiCount < 10 ? notiCount : 10;
                    markerCountDiv.style.left = notiCount < 10 ? "5px" : "1px";
                }
            }
        },
        error: function (xhr, status, error) {
            alert("An error occurred: " + error);
        }
    });

    //when profile name is clicked under the settings option
    $(".searchFeedSettingProfileNameDiv").click(function () {
        $.ajax({
            url: 'https://' + location.host + '/Profile/GetProfileDetails',
            method: 'Post',
            data: {},
            success: function (data) {
                if (data && data.email)
                    window.location.href = "https://" + window.location.host + "/Profile/ProfileData?email=" + data.email;
            },
            error: function (xhr, status, error) {
                alert("An error occurred: " + error);
            }
        })
    })

    //populates profile name and image in search bar and settings option
    var value = {}
    $.ajax({
        url: 'https://' + location.host + '/Profile/GetProfileDetails',
        method: 'Post',
        data: value,
        success: function (data) {
            if (!data) return;
            myEmail = data.email;
            var nameElem = document.getElementsByClassName("searchFeedSettingProfileName")[0];
            var imgElem = document.getElementsByClassName("searchFeedSettingProfileImg")[0];
            var rightImgElem = document.getElementsByClassName("myProfilelogoImgRight")[0];
            if (nameElem) nameElem.textContent = data.firstName + " " + data.surname;
            if (imgElem && data.profileImagePath) imgElem.src = serverUrl + data.profileImagePath.substr(64);
            if (rightImgElem && data.profileImagePath) rightImgElem.src = serverUrl + data.profileImagePath.substr(64);
        },
        error: function (xhr, status, error) {
            alert("An error occurred: " + error);
        }
    })

    //redirects to settings page when settings button is clicked
    $(".searchFeedSettingOptionDiv").click(function () {
        $.ajax({
            url: 'https://' + location.host + '/Profile/GetProfileDetails',
            method: 'Post',
            data: value,
            success: function (data) {
                window.location.href = "https://" + window.location.host + "/Profile/Settings";
            },
            error: function (xhr, status, error) {
                alert("An error occurred: " + error);
            }
        })
    })

    //logs out user account
    $(".searchFeedSettingLogoutOptionDiv").click(function () {
        $.ajax({
            url: 'https://' + location.host + '/Profile/Logout',
            method: 'POST', 
            success: function () {
                window.location.href = "https://" + window.location.host + "/Home/Login";
            }
        });
    });

    //displays notification
    $("#notiIconDiv").click(function () {
        var notiDiv = document.getElementsByClassName("searchFeedNotiDiv")[0];
        if (!notiDiv) return;
        if (notiDiv.style.visibility == "hidden") {
            notiDiv.style.visibility = "visible"
            $(".notiMarker").show();
        }
        else if (notiDiv.style.visibility == "visible") {
            notiDiv.style.visibility = "hidden"
            $(".notiMarker").hide();
        }

        if (notiDiv.style.paddingBottom == "0px" || notiDiv.style.paddingBottom.length == 0) {
            notiDiv.style.paddingBottom = "8px"
            notiDiv.style.paddingTop = "8px"
        } else if (notiDiv.style.paddingBottom == "8px") {
            notiDiv.style.paddingBottom = "0px"
            notiDiv.style.paddingTop = "0px"
        }

        //changes notification status to read, when notification is clicked
        $(".notiContent").click(function () {
            var value = {
                "id": this.id.split('#')[0],
                "type": this.id.split('#')[1]
            }
            $.ajax({
                url: 'https://' + location.host + '/Feed/UpdateNotificatioStatus',
                method: 'Post',
                data: value,
                success: function (data) { },
                error: function (xhr, status, error) {
                    alert("An error occurred: " + error);
                }
            })
        })
    })
});