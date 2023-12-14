function Search(data) {
    var value = {
        "name": data
    }
    $.post({
        url: 'https://' + location.host + '/Feed/SearchBy',
        method: 'Post',
        data: value,
        async: false,
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

function CheckPassword1(val) {

    if (document.getElementsByClassName("rightSettingPassword3Edit")[0].value == "" || document.getElementsByClassName("rightSettingPassword2Edit")[0].value == "") {
        document.getElementsByClassName("rightSettingPasswordErrorDiv")[0].textContent = "";
        document.getElementsByClassName("rightSettingPasswordSaveBtn")[0].style.cursor = "no-drop"
    }
    else if (document.getElementsByClassName("rightSettingPassword3Edit")[0].value != val) {
        document.getElementsByClassName("rightSettingPasswordErrorDiv")[0].textContent = "Passwords does not match";
        document.getElementsByClassName("rightSettingPasswordErrorDiv")[0].style.color = "red";
        document.getElementsByClassName("rightSettingPasswordSaveBtn")[0].style.cursor = "no-drop"
    }
    else if (document.getElementsByClassName("rightSettingPassword3Edit")[0].value == val) {
        document.getElementsByClassName("rightSettingPasswordErrorDiv")[0].textContent = "Passwords match";
        document.getElementsByClassName("rightSettingPasswordErrorDiv")[0].style.color = "green";
        document.getElementsByClassName("rightSettingPasswordSaveBtn")[0].style.cursor = "pointer"
    }
}

function CheckPassword2(val) {

    if (document.getElementsByClassName("rightSettingPassword3Edit")[0].value == "" || document.getElementsByClassName("rightSettingPassword2Edit")[0].value == "") {
        document.getElementsByClassName("rightSettingPasswordErrorDiv")[0].textContent = "";
        document.getElementsByClassName("rightSettingPasswordSaveBtn")[0].style.cursor = "no-drop"
    }
    else if (document.getElementsByClassName("rightSettingPassword2Edit")[0].value != val) {
        document.getElementsByClassName("rightSettingPasswordErrorDiv")[0].textContent = "Passwords does not match";
        document.getElementsByClassName("rightSettingPasswordErrorDiv")[0].style.color = "red";
        document.getElementsByClassName("rightSettingPasswordSaveBtn")[0].style.cursor = "no-drop"
    }
    else if (document.getElementsByClassName("rightSettingPassword2Edit")[0].value == val) {
        document.getElementsByClassName("rightSettingPasswordErrorDiv")[0].textContent = "Passwords match";
        document.getElementsByClassName("rightSettingPasswordErrorDiv")[0].style.color = "green";
        document.getElementsByClassName("rightSettingPasswordSaveBtn")[0].style.cursor = "pointer"
    }
}

$(document).ready(function () {

    
    $(".rightSettingName1EditDiv").hide();
    $(".rightSettingName2EditDiv").hide();
    $(".rightSettingNameEditBtnDiv").show();
    $(".rightSettingNameCancelSaveBtnDiv").hide();

    $(".rightSettingContact1EditDiv").hide();
    $(".rightSettingContactEditBtnDiv").show();
    $(".rightSettingContactCancelSaveBtnDiv").hide();

    $(".rightSettingPassword1EditDiv").hide();
    $(".rightSettingPassword2EditDiv").hide();
    $(".rightSettingPassword3EditDiv").hide();
    $(".rightSettingPasswordEditBtnDiv").show();
    $(".rightSettingPasswordCancelSaveBtnDiv").hide();

    //GetMyProfileDetails
    var value = {
        "email": $(location).attr('href').substr(50)
    }
    $.post({
        url: 'https://' + location.host + '/Profile/GetMyProfileDetails',
        method: 'Post',
        data: value,
        async: false,
        success: function (data) {
            document.getElementsByClassName("myProfilelogoImgRight")[0].src = "http://127.0.0.1:8080/" + data[0].profileImagePath.substr(64);
            document.getElementsByClassName("searchFeedSettingProfileName")[0].textContent = data[0].firstName + " " + data[0].surname;
            document.getElementsByClassName("searchFeedSettingProfileImg")[0].src = "http://127.0.0.1:8080/" + data[0].profileImagePath.substr(64)
        }
    })

    $(".rightSettingNameEditBtn").click(function () {
        $(".rightSettingNameValueDiv").hide();
        $(".rightSettingNameEditBtnDiv").hide();
        $(".rightSettingName1EditDiv").show();
        $(".rightSettingName2EditDiv").show();
        $(".rightSettingNameCancelSaveBtnDiv").show();
    })

    $(".rightSettingNameCancelBtn").click(function () {
        $(".rightSettingNameValueDiv").show();
        $(".rightSettingNameEditBtnDiv").show();
        $(".rightSettingName1EditDiv").hide();
        $(".rightSettingName2EditDiv").hide();
        $(".rightSettingNameCancelSaveBtnDiv").hide();
    })

    $(".rightSettingContactEditBtn").click(function () {
        $(".rightSettingContactValueDiv").hide();
        $(".rightSettingContactEditBtnDiv").hide();
        $(".rightSettingContact1EditDiv").show();
        $(".rightSettingContactCancelSaveBtnDiv").show();
    })

    $(".rightSettingContactCancelBtn").click(function () {
        $(".rightSettingContactValueDiv").show();
        $(".rightSettingContactEditBtnDiv").show();
        $(".rightSettingContact1EditDiv").hide();
        $(".rightSettingContactCancelSaveBtnDiv").hide();
    })

    $(".rightSettingPasswordEditBtn").click(function () {
        $(".rightSettingPasswordValueDiv").hide();
        $(".rightSettingPasswordEditBtnDiv").hide();
        $(".rightSettingPassword1EditDiv").show();
        $(".rightSettingPassword2EditDiv").show();
        $(".rightSettingPassword3EditDiv").show();
        $(".rightSettingPasswordCancelSaveBtnDiv").show();
    })

    $(".rightSettingPasswordCancelBtn").click(function () {
        $(".rightSettingPasswordValueDiv").show();
        $(".rightSettingPasswordEditBtnDiv").show();
        $(".rightSettingPassword1EditDiv").hide();
        $(".rightSettingPassword2EditDiv").hide();
        $(".rightSettingPassword3EditDiv").hide();
        $(".rightSettingPasswordCancelSaveBtnDiv").hide();
    })

    $(".rightSettingNameSaveBtn").click(function () {
        var value = {
            "type": "name",
            "value1": document.getElementsByClassName("rightSettingName1Edit")[0].value,
            "value2": document.getElementsByClassName("rightSettingName2Edit")[0].value
        }
        $.post({
            url: 'https://' + location.host + '/Profile/EditAccountDetails',
            method: 'Post',
            data: value,
            async: false,
            success: function (data) {
            }
        })

        location.reload();
    })

    $(".rightSettingContactSaveBtn").click(function () {
        var value = {
            "type": "contact",
            "value1": document.getElementsByClassName("rightSettingContact1Edit")[0].value,
            "value2": "null"
        }
        $.post({
            url: 'https://' + location.host + '/Profile/EditAccountDetails',
            method: 'Post',
            data: value,
            async: false,
            success: function (data) {
            }
        })

        location.reload();
    })

    $(".rightSettingPasswordSaveBtn").click(function () {
        console.log(document.getElementsByClassName("rightSettingPasswordSaveBtn")[0].style.cursor)
        if (document.getElementsByClassName("rightSettingPassword1Edit")[0].value == "" || document.getElementsByClassName("rightSettingPassword3Edit")[0].value == "" || document.getElementsByClassName("rightSettingPassword2Edit")[0].value == "") {
            document.getElementsByClassName("rightSettingPasswordErrorDiv")[0].textContent = "All fields should be filled";
            document.getElementsByClassName("rightSettingPasswordErrorDiv")[0].style.color = "red";
        }
        if (document.getElementsByClassName("rightSettingPasswordSaveBtn")[0].style.cursor == "pointer") {
            var value = {
                "currPass": document.getElementsByClassName("rightSettingPassword1Edit")[0].value,
                "newPass": document.getElementsByClassName("rightSettingPassword2Edit")[0].value
            }
            $.post({
                url: 'https://' + location.host + '/Profile/UpdatePassword',
                method: 'Post',
                data: value,
                async: false,
                success: function (data) {
                    if (data == "Wrong Password") {
                        alert ("Password is incorrect")
                    }
                    else if (data == "Success") {
                        alert("Password changed successfully")
                        $(".rightSettingPasswordCancelBtn").click()
                    }
                }
            })
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
        //window.location.href = 
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

    $(".searchFeedSettingLogoutOptionDiv").click(function () {
        window.location.href = "https://" + window.location.host
    })

    document.getElementsByClassName("leftDiv")[0].style.height = document.body.scrollHeight - 55;
    document.getElementById("result").style.padding = "0px"

    setTimeout(function () {
        document.getElementsByTagName('body')[0].style.visibility = "visible"
    }, 5)
})
