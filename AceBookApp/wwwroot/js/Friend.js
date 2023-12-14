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
            for (var i = 0; i < data.length; i++) {
                result = result + '<div class="searchResultNew"><div class="searchImgDiv"><img class="searchImg" src="' + 'http://127.0.0.1:8080/' + data[i].profileImagePath.substr(64) + '"/></div><div class="searchText"><a class="searchTextA" href="/Profile/ProfileData/' + data[i].email + '">' + data[i].firstName + " " + data[i].surname + '</a></div></div>'
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

function ConfirmBtn(email) {

    var value = {
        "fromRequest": email,
        "toRequest": $(location).attr('href').substr(46)
    }
    $.post({
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
            $.post({
                url: 'https://' + location.host + '/Profile/DeleteReq',
                method: 'Post',
                data: value,
                success: function (data1) {

                }
            });
        }
    });
}

function DeleteBtn(email) {
    var len = email.length
    var value = {
        "fromRequest": email.substr(0,len-4),
        "toRequest": $(location).attr('href').substr(46)
    }
    $.post({
        url: 'https://' + location.host + '/Profile/DeleteReq',
        method: 'Post',
        data: value,
        success: function (data1) {
            document.getElementById(email).textContent = "Request deleted";
            document.getElementById(email).style.cursor = "no-drop";
            document.getElementById(email).style.color = "BCC0C4";
            document.getElementById(email).style.marginTop = "25px";
            document.getElementById(email.substr(0, len - 4)).style.display = "none";
        }
    });
}

function frndProfileDisplay(email) {
    
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

    var value = {
        "email": $(location).attr('href').substr(46)
    }
    $.post({
        url: 'https://' + location.host + '/Profile/GetFriendReq',
        method: 'Post',
        data: value,
        async: false,
        success: function (data) {
            var result = '';
            for (var i = 0; i < data.length; i++) {
                var value = {
                    "email": data[i].fromRequest
                }
                $.post({
                    url: 'https://' + location.host + '/Profile/GetProfileDetails',
                    method: 'Post',
                    data: value,
                    async: false,
                    success: function (data1) {
                        result = result + '<div class="gridItem">' + '<div class="requestedAccImgDiv' + '"><img class="requestedAccImg" src="http://127.0.0.1:8080/' + data1[0].profileImagePath.substr(64) + '"/></div><div class="requestedAccName' + '"><span class="requestedAccNameA' + '">' + data1[0].firstName + ' ' + data1[0].surname + '</span></div><button id="' + data1[0].email + '" class="confirmBtn" onclick="ConfirmBtn(this.id)">Confirm</button><br/><button class="deleteBtn" id="' + data1[0].email + '-Del" onclick="DeleteBtn(this.id)">Delete</button></div>'
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
        }
    })

    $('.FriendsMenuRequestsDiv').click(function () {
        document.getElementsByClassName("FriendsMenuRequestsDiv")[0].style.backgroundColor = "#ECECEC";
        document.getElementsByClassName("FriendsMenuAllFriendsDiv")[0].style.backgroundColor = "white";
        $('.backArrow').hide();
        
        var value = {
            "email": $(location).attr('href').substr(46)
        }
        $.post({
            url: 'https://' + location.host + '/Profile/GetFriendReq',
            method: 'Post',
            data: value,
            async: false,
            success: function (data) {
                var result = '';
                for (var i = 0; i < data.length; i++){
                    var value = {
                        "email": data[i].fromRequest
                    }
                    $.post({
                        url: 'https://' + location.host + '/Profile/GetProfileDetails',
                        method: 'Post',
                        data: value,
                        async: false,
                        success: function (data1) {
                            result = result + '<div class="gridItem">' + '<div class="requestedAccImgDiv' + '"><img class="requestedAccImg" src="http://127.0.0.1:8080/' + data1[0].profileImagePath.substr(64) + '"/></div><div class="requestedAccName' + '"><span class="requestedAccNameA' + '">' + data1[0].firstName + ' ' + data1[0].surname + '</span></div><button id="' + data1[0].email + '" class="confirmBtn" onclick="ConfirmBtn(this.id)">Confirm</button><br/><button class="deleteBtn" id="' + data1[0].email + '-Del" onclick="DeleteBtn(this.id)">Delete</button></div>'
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
            }
        })

        $('.FriendsResultDiv').show();
    });

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
        $.post({
            url: 'https://' + location.host + '/Profile/GetFriendList',
            method: 'Post',
            data: value,
            async: false,
            success: function (data) {
                result = '<div class="frndCountDiv"><span class="frndCount">' + data.length + " friends</span></div><br/>";
            }
        });

        var value = {
            "email": $(location).attr('href').substr(46)
        }
        $.post({
            url: 'https://' + location.host + '/Profile/GetFriendList',
            method: 'Post',
            data: value,
            async: false,
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
                    $.post({
                        url: 'https://' + location.host + '/Profile/GetProfileDetails',
                        method: 'Post',
                        data: value,
                        async: false,
                        success: function (data1) {
                            result = result + '<div class="frndAcc" id="' + data1[0].email + '" onclick="frndProfileDisplay(this.id)"><div class="frndAccImgDiv"><img class="frndAccImg" src="http://127.0.0.1:8080/' + data1[0].profileImagePath.substr(64) +'"/></div><div class="frndAccNameDiv"><span class="frndAccName">' + data1[0].firstName + ' ' + data1[0].surname + '</span></div></div>'
                        }
                    });
                }
                document.getElementsByClassName("FriendsMenuFriendListDiv")[0].innerHTML = result;

                setTimeout(function () {
                    document.getElementsByClassName("FriendsMenuDiv")[0].style.height = document.body.scrollHeight - 55;
                }, 100)
            }
        });
    });

    $('.backArrow').click(function () {
        location.reload();
    })

    document.getElementById("result").style.padding = "0px"
});
