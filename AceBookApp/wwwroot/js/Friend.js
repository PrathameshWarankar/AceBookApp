
function showError(error) {
    alert("An error occurred: " + error);
}

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

            $.ajax({
                url: 'https://' + location.host + '/Profile/DeleteReq',
                method: 'Post',
                data: value,
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
            document.getElementById(email).style.color = "#BCC0C4";
            document.getElementById(email).style.marginTop = "25px";
            document.getElementById(email.substr(0, len - 4)).style.display = "none";
        },
        error: function (xhr, status, error) {
            showError(error);
        }
    });
}

//display friend's profile when clicked on account name
function FrndProfileDisplay(email) {
    var modEmail = '/Profile/ProfileData?email=' + email
    document.getElementById("profileLoader").setAttribute('data', modEmail);
    $('.FriendProfileDiv').show();

    setTimeout(function () {
        try {
            var obj = document.getElementsByClassName("FriendProfileDiv")[0].getElementsByTagName("object")[0];
            var doc = obj.contentDocument;
            doc.getElementsByClassName("searchDiv")[0].style.display = "none";
            var body = doc.getElementsByTagName("body")[0];
            body.style.position = "relative";
            body.style.top = "-55px";
            body.style.left = "-165px";
        } catch (e) {
            // ignore errors if object not loaded yet
        }
    }, 120);
}

// Helper: AJAX call returning a Promise
function ajaxPromise(options) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            ...options,
            success: resolve,
            error: function (xhr, status, error) {
                reject(error);
            }
        });
    });
}

// Loads friend requests and renders them
function loadFriendRequests() {
    var value = {
        "email": $(location).attr('href').substr(46)
    };
    ajaxPromise({
        url: 'https://' + location.host + '/Profile/GetFriendReq',
        method: 'Post',
        data: value
    }).then(function (data) {
        if (!data || !data.length) {
            $('.NoReq').show();
            document.getElementsByClassName("NoReq")[0].innerHTML = "No friend requests to show";
            document.getElementsByClassName("FriendsResult")[0].innerHTML = "";
            return;
        }
        $('.NoReq').hide();
        var requests = data.map(function (req) {
            return ajaxPromise({
                url: 'https://' + location.host + '/Profile/GetProfileDetails',
                method: 'Post',
                data: { "email": req.fromRequest }
            });
        });
        Promise.all(requests).then(function (profiles) {
            var result = '';
            profiles.forEach(function (data1) {
                result += '<div class="gridItem">' +
                    '<div class="requestedAccImgDiv"><img class="requestedAccImg" src="' + serverUrl + data1.profileImagePath.substr(64) + '"/></div>' +
                    '<div class="requestedAccName"><span class="requestedAccNameA">' + data1.firstName + ' ' + data1.surname + '</span></div>' +
                    '<button id="' + data1.email + '" class="confirmBtn" onclick="ConfirmBtn(this.id)">Confirm</button><br/>' +
                    '<button class="deleteBtn" id="' + data1.email + '-Del" onclick="DeleteBtn(this.id)">Delete</button>' +
                    '</div>';
            });
            document.getElementsByClassName("FriendsResult")[0].innerHTML = result;
            setTimeout(function () {
                document.getElementsByClassName("FriendsMenuDiv")[0].style.height = document.body.scrollHeight - 55;
            }, 100);
        }).catch(showError);
    }).catch(showError);
}

// Loads all friends and renders them
function loadAllFriends() {
    var value = {
        "email": $(location).attr('href').substr(46)
    };
    ajaxPromise({
        url: 'https://' + location.host + '/Profile/GetFriendList',
        method: 'Post',
        data: value
    }).then(function (data) {
        var result = '<div class="frndCountDiv"><span class="frndCount">' + data.length + " friends</span></div><br/>";
        if (!data || !data.length) {
            document.getElementsByClassName("FriendsMenuFriendListDiv")[0].innerHTML = result;
            return;
        }
        var requests = data.map(function (item) {
            var email = (item.fromRequest == value.email) ? item.toRequest : item.fromRequest;
            return ajaxPromise({
                url: 'https://' + location.host + '/Profile/GetProfileDetails',
                method: 'Post',
                data: { "email": email }
            });
        });
        Promise.all(requests).then(function (profiles) {
            profiles.forEach(function (data1) {
                result += '<div class="frndAcc" id="' + data1.email + '" onclick="FrndProfileDisplay(this.id)">' +
                    '<div class="frndAccImgDiv"><img class="frndAccImg" src="' + serverUrl + data1.profileImagePath.substr(64) + '"/></div>' +
                    '<div class="frndAccNameDiv"><span class="frndAccName">' + data1.firstName + ' ' + data1.surname + '</span></div>' +
                    '</div>';
            });
            document.getElementsByClassName("FriendsMenuFriendListDiv")[0].innerHTML = result;
            setTimeout(function () {
                document.getElementsByClassName("FriendsMenuDiv")[0].style.height = document.body.scrollHeight - 55;
            }, 100);
        }).catch(showError);
    }).catch(showError);
}

$(document).ready(function () {
    document.getElementsByClassName("FriendsMenuRequestsDiv")[0].style.backgroundColor = "#ECECEC";
    document.getElementsByClassName("FriendsMenuDiv")[0].style.height = document.body.scrollHeight - 55;
    $('.FriendProfileDiv').hide();
    $('.backArrow').hide();

    // Initial load of friend requests
    loadFriendRequests();

    // Friend requests button
    $('.FriendsMenuRequestsDiv').click(function () {
        document.getElementsByClassName("FriendsMenuRequestsDiv")[0].style.backgroundColor = "#ECECEC";
        document.getElementsByClassName("FriendsMenuAllFriendsDiv")[0].style.backgroundColor = "white";
        $('.backArrow').hide();
        loadFriendRequests();
        $('.FriendsResultDiv').show();
    });

    // All friends button
    $('.FriendsMenuAllFriendsDiv').click(function () {
        document.getElementsByClassName("FriendsMenuAllFriendsDiv")[0].style.backgroundColor = "#ECECEC";
        document.getElementsByClassName("FriendsMenuRequestsDiv")[0].style.backgroundColor = "white";
        $('.backArrow').show();
        $('.NoReq').hide();
        $('.FriendsResultHeader').hide();
        $('.FriendsResult').hide();
        document.getElementsByClassName("FriendsMenuHeaderA")[0].textContent = "All friends";
        document.getElementsByClassName("FriendsMenuHeaderDiv")[0].style.borderBottom = "1px solid lightgray";
        $('.FriendsMenuRequestsDiv').hide();
        $('.FriendsMenuAllFriendsDiv').hide();
        loadAllFriends();
    });

    // Back arrow
    $('.backArrow').click(function () {
        location.reload();
    });

    document.getElementById("result").style.padding = "0px";
});