//validation for any blank enteries in login page
function CheckBlank() {
    var isActive = document.getElementById('password');
    if (isActive == document.activeElement) {
        var email = document.getElementById('email').value.trim();
        if (email.length == 0) {
            document.getElementById('email').style.border = "1px solid red";
            return false;
        }
        else {
            document.getElementById('email').style.border = "1px solid #dddfe2";
            document.getElementById('email').onclick = function () {
                document.getElementById('email').style.border = "1px solid #1877f2";
            }
            return false;
        }
    }
}

//validation when login button is clicked
function CheckField() {
    var email = document.getElementById('email').value.trim();
    if (email.length != 0) {
        document.getElementById('email').style.border = "1px solid #dddfe2";
    }
    else {
        document.getElementById('email').style.border = "1px solid red";
    }

    var password = document.getElementById('password').value.trim();
    if (password.length != 0) {
        document.getElementById('password').style.border = "1px solid #dddfe2";
    }
    else {
        document.getElementById('password').style.border = "1px solid red"
    }
}