
//validation for password field
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

//validation for confirm password field
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

    //methods to be executed when each of the button is clicked
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
        $.ajax({
            url: 'https://' + location.host + '/Profile/EditAccountDetails',
            method: 'Post',
            data: value,
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
        $.ajax({
            url: 'https://' + location.host + '/Profile/EditAccountDetails',
            method: 'Post',
            data: value,
            success: function (data) {
                alert('Please re-login to the application')
                $.post('https://' + location.host + '/Profile/Logout', function () {
                    window.location.href = "https://" + window.location.host + "/Home/Login";
                });
            }
        })
    })

    $(".rightSettingPasswordSaveBtn").click(function () {
        if (document.getElementsByClassName("rightSettingPassword1Edit")[0].value == "" || document.getElementsByClassName("rightSettingPassword3Edit")[0].value == "" || document.getElementsByClassName("rightSettingPassword2Edit")[0].value == "") {
            document.getElementsByClassName("rightSettingPasswordErrorDiv")[0].textContent = "All fields should be filled";
            document.getElementsByClassName("rightSettingPasswordErrorDiv")[0].style.color = "red";
        }
        if (document.getElementsByClassName("rightSettingPasswordSaveBtn")[0].style.cursor == "pointer") {
            var value = {
                "currPass": document.getElementsByClassName("rightSettingPassword1Edit")[0].value,
                "newPass": document.getElementsByClassName("rightSettingPassword2Edit")[0].value
            }
            $.ajax({
                url: 'https://' + location.host + '/Profile/UpdatePassword',
                method: 'Post',
                data: value,
                success: function (data) {
                    if (data == "Wrong Password") {
                        alert("Password is incorrect")
                    }
                    else if (data == "Success") {
                        alert("Password changed successfully")
                        $(".rightSettingPasswordCancelBtn").click()
                    }
                }
            })
        }
    })

    document.getElementsByClassName("leftDiv")[0].style.height = document.body.scrollHeight - 55;
    document.getElementById("result").style.padding = "0px"

    setTimeout(function () {
        document.getElementsByTagName('body')[0].style.visibility = "visible"
    }, 5)
})
