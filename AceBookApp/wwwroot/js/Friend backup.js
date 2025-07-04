﻿
//method to accept friend request
function ConfirmBtn(email) {
    var value = {
        "fromRequest": email,
        "toRequest": $(location).attr('href').substr(46)
    }
    $.ajax({
        url: 'https://' + location.host + '/Profile/AddFriend',
        method: 'Post',
        data: value,
        success: function (data) {
            var divId = email + "-Del";
            document.getElementById(divId).textContent = "Request accepted";
            document.getElementById(divId).style.cursor = "no-drop";
            document.getElementById(divId).style.color = "#BCC0C4";
            document.getElementById(divId).style.marginTop = "25px";
            document.getElementById(email).style.display = "none";

            var value = {
                "fromRequest": email,
                "toRequest": $(location).attr('href').substr(46)
            }
            $.ajax({
                url: 'https://' + location.host + '/Profile/DeleteReq',
                method: 'Post',
                data: value,
                success: function (data1) {

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

//method to delete friend request
function DeleteBtn(email) {
    var len = email.length
    var value = {
        "fromRequest": email.substr(0, len - 4),
        "toRequest": $(location).attr('href').substr(46)
    }
    $.ajax({
        url: 'https://' + location.host + '/Profile/DeleteReq',
        method: 'Post',
        data: value,
        success: function (data1) {
            document.getElementById(email).textContent = "Request deleted";
            document.getElementById(email).style.cursor = "no-drop";
            document.getElementById(email).style.color = "BCC0C4";
            document.getElementById(email).style.marginTop = "25px";
            document.getElementById(email.substr(0, len - 4)).style.display = "none";
        },
        error: function (xhr, status, error) {
            showError(error);
        }
    });
}

//display friend's' profile when clicked on account name
function FrndProfileDisplay(email) {
    var modEmail = '/Profile/ProfileData?email=' + email
    document.getElementById("profileLoader").setAttribute('data', modEmail);
    $('.FriendProfileDiv').show();

    setTimeout(function () {
        document.getElementsByClassName("FriendProfileDiv")[0].getElementsByTagName("object")[0].contentDocument.getElementsByClassName("searchDiv")[0].style.display = "none";
        document.getElementsByClassName("FriendProfileDiv")[0].getElementsByTagName("object")[0].contentDocument.getElementsByTagName("body")[0].style.position = "relative";
        document.getElementsByClassName("FriendProfileDiv")[0].getElementsByTagName("object")[0].contentDocument.getElementsByTagName("body")[0].style.top = "-55px";
        document.getElementsByClassName("FriendProfileDiv")[0].getElementsByTagName("object")[0].contentDocument.getElementsByTagName("body")[0].style.left = "-165px";
        document.getElementsByClassName("FriendProfileDiv")[0].getElementsByTagName("object")[0].contentDocument.getElementsByTagName("body")[0].style.left = "-165px";
    }, 120);
}

$(document).ready(function () {
    document.getElementsByClassName("FriendsMenuRequestsDiv")[0].style.backgroundColor = "#ECECEC";
    document.getElementsByClassName("FriendsMenuDiv")[0].style.height = document.body.scrollHeight - 55;
    $('.FriendProfileDiv').hide();
    $('.backArrow').hide();

    //loads friends page
    var value = {
        "email": $(location).attr('href').substr(46)
    }
    $.ajax({
        url: 'https://' + location.host + '/Profile/GetFriendReq',
        method: 'Post',
        data: value,
        success: function (data) {
            var result = '';
            for (var i = 0; i < data.length; i++) {
                var value = {
                    "email": data[i].fromRequest
                }
                $.ajax({
                    url: 'https://' + location.host + '/Profile/GetProfileDetails',
                    method: 'Post',
                    data: value,
                    success: function (data1) {
                        result = result + '<div class="gridItem">' + '<div class="requestedAccImgDiv' + '"><img class="requestedAccImg" src="http://127.0.0.1:8080/' + data1.profileImagePath.substr(64) + '"/></div><div class="requestedAccName' + '"><span class="requestedAccNameA' + '">' + data1.firstName + ' ' + data1.surname + '</span></div><button id="' + data1.email + '" class="confirmBtn" onclick="ConfirmBtn(this.id)">Confirm</button><br/><button class="deleteBtn" id="' + data1.email + '-Del" onclick="DeleteBtn(this.id)">Delete</button></div>'
                    },
                    error: function (xhr, status, error) {
                        showError(error);
                    }
                })
            }
            setTimeout(function () {
                if (result != '') {
                    $('.NoReq').hide();
                    document.getElementsByClassName("FriendsResult")[0].innerHTML = result;
                }
                else {
                    document.getElementsByClassName("NoReq")[0].innerHTML = "No friend requests to show";
                }
            }, 200)

            setTimeout(function () {
                document.getElementsByClassName("FriendsMenuDiv")[0].style.height = document.body.scrollHeight - 55;
            }, 100)
        },
        error: function (xhr, status, error) {
            showError(error);
        }
    })

    //method that provides functionality to friend requests button inside friends page
    $('.FriendsMenuRequestsDiv').click(function () {
        document.getElementsByClassName("FriendsMenuRequestsDiv")[0].style.backgroundColor = "#ECECEC";
        document.getElementsByClassName("FriendsMenuAllFriendsDiv")[0].style.backgroundColor = "white";
        $('.backArrow').hide();

        var value = {
            "email": $(location).attr('href').substr(46)
        }
        $.ajax({
            url: 'https://' + location.host + '/Profile/GetFriendReq',
            method: 'Post',
            data: value,
            success: function (data) {
                var result = '';
                for (var i = 0; i < data.length; i++) {
                    var value = {
                        "email": data[i].fromRequest
                    }
                    $.ajax({
                        url: 'https://' + location.host + '/Profile/GetProfileDetails',
                        method: 'Post',
                        data: value,
                        success: function (data1) {
                            result = result + '<div class="gridItem">' + '<div class="requestedAccImgDiv' + '"><img class="requestedAccImg" src="http://127.0.0.1:8080/' + data1.profileImagePath.substr(64) + '"/></div><div class="requestedAccName' + '"><span class="requestedAccNameA' + '">' + data1.firstName + ' ' + data1.surname + '</span></div><button id="' + data1.email + '" class="confirmBtn" onclick="ConfirmBtn(this.id)">Confirm</button><br/><button class="deleteBtn" id="' + data1.email + '-Del" onclick="DeleteBtn(this.id)">Delete</button></div>'
                        },
                        error: function (xhr, status, error) {
                            showError(error);
                        }
                    })
                }
                setTimeout(function () {
                    if (result != '') {
                        $('.NoReq').hide();
                        document.getElementsByClassName("FriendsResult")[0].innerHTML = result;
                    }
                    else {
                        document.getElementsByClassName("NoReq")[0].innerHTML = "No friend requests to show";
                    }
                }, 200)
            },
            error: function (xhr, status, error) {
                showError(error);
            }
        })

        $('.FriendsResultDiv').show();
    });

    //method that provides functionality to all friend button inside friends page
    $('.FriendsMenuAllFriendsDiv').click(function () {
        document.getElementsByClassName("FriendsMenuAllFriendsDiv")[0].style.backgroundColor = "#ECECEC";
        document.getElementsByClassName("FriendsMenuRequestsDiv")[0].style.backgroundColor = "white";

        $('.backArrow').show();
        $('.NoReq').hide();
        $('.FriendsResultHeader').hide();
        $('.FriendsResult').hide();
        //$('.FriendProfileDiv').hide();

        document.getElementsByClassName("FriendsMenuHeaderA")[0].textContent = "All friends";
        document.getElementsByClassName("FriendsMenuHeaderDiv")[0].style.borderBottom = "1px solid lightgray"
        $('.FriendsMenuRequestsDiv').hide();
        $('.FriendsMenuAllFriendsDiv').hide();

        var result = '';
        var value = {
            "email": $(location).attr('href').substr(46)
        }
        $.ajax({
            url: 'https://' + location.host + '/Profile/GetFriendList',
            method: 'Post',
            data: value,
            success: function (data) {
                result = '<div class="frndCountDiv"><span class="frndCount">' + data.length + " friends</span></div><br/>";
            },
            error: function (xhr, status, error) {
                showError(error);
            }
        });

        var value = {
            "email": $(location).attr('href').substr(46)
        }
        $.ajax({
            url: 'https://' + location.host + '/Profile/GetFriendList',
            method: 'Post',
            data: value,
            success: function (data) {
                for (var i = 0; i < data.length; i++) {
                    var email;
                    if (data[i].fromRequest == $(location).attr('href').substr(46)) {
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
                            result = result + '<div class="frndAcc" id="' + data1.email + '" onclick="FrndProfileDisplay(this.id)"><div class="frndAccImgDiv"><img class="frndAccImg" src="http://127.0.0.1:8080/' + data1.profileImagePath.substr(64) + '"/></div><div class="frndAccNameDiv"><span class="frndAccName">' + data1.firstName + ' ' + data1.surname + '</span></div></div>'
                        },
                        error: function (xhr, status, error) {
                            showError(error);
                        }
                    });
                }
                document.getElementsByClassName("FriendsMenuFriendListDiv")[0].innerHTML = result;

                setTimeout(function () {
                    document.getElementsByClassName("FriendsMenuDiv")[0].style.height = document.body.scrollHeight - 55;
                }, 100)
            },
            error: function (xhr, status, error) {
                showError(error);
            }
        });
    });

    //method to go back from all friends page
    $('.backArrow').click(function () {
        location.reload();
    })

    document.getElementById("result").style.padding = "0px"
});
