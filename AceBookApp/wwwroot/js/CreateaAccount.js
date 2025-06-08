//validation for blank fields
function CheckBlank() {
    //name validation
    var isActive = document.getElementById('sname');
    if (isActive == document.activeElement) {
        var fname = document.getElementById('fname').value.trim();
        if (fname.length == 0) {
            document.getElementById('fname').style.border = "1px solid red";
            return false;
        }
        else {
            document.getElementById('fname').style.border = "1px solid #dddfe2";
            return false;
        }
    }

    //email validation
    isActive = document.getElementById('email');
    if (isActive == document.activeElement) {
        var fname = document.getElementById('fname').value.trim();
        if (fname.length == 0) {
            document.getElementById('fname').style.border = "1px solid red";
        }
        else {
            document.getElementById('fname').style.border = "1px solid #dddfe2";
        }

        var sname = document.getElementById('sname').value.trim();
        if (sname.length == 0) {
            document.getElementById('sname').style.border = "1px solid red";
        }
        else {
            document.getElementById('sname').style.border = "1px solid #dddfe2";
            return false;
        }
    }

    //passowrd validation
    isActive = document.getElementById('pass');
    if (isActive == document.activeElement) {
        var fname = document.getElementById('fname').value.trim();
        if (fname.length == 0) {
            document.getElementById('fname').style.border = "1px solid red";
        }
        else {
            document.getElementById('fname').style.border = "1px solid #dddfe2";
        }

        var sname = document.getElementById('sname').value.trim();
        if (sname.length == 0) {
            document.getElementById('sname').style.border = "1px solid red";
        }
        else {
            document.getElementById('sname').style.border = "1px solid #dddfe2";
        }

        var email = document.getElementById('email').value.trim();
        if (email.length == 0) {
            document.getElementById('email').style.border = "1px solid red";
        }
        else {
            document.getElementById('email').style.border = "1px solid #dddfe2";
            return false;
        }
    }

    //date validation
    isActive = document.getElementById('date');
    if (isActive == document.activeElement) {
        var fname = document.getElementById('fname').value.trim();
        if (fname.length == 0) {
            document.getElementById('fname').style.border = "1px solid red";
        }
        else {
            document.getElementById('fname').style.border = "1px solid #dddfe2";
        }

        var sname = document.getElementById('sname').value.trim();
        if (sname.length == 0) {
            document.getElementById('sname').style.border = "1px solid red";
        }
        else {
            document.getElementById('sname').style.border = "1px solid #dddfe2";
        }

        var email = document.getElementById('email').value.trim();
        if (email.length == 0) {
            document.getElementById('email').style.border = "1px solid red";
        }
        else {
            document.getElementById('email').style.border = "1px solid #dddfe2";
        }

        var pass = document.getElementById('pass').value.trim();
        if (pass.length == 0) {
            document.getElementById('pass').style.border = "1px solid red";
        }
        else {
            document.getElementById('pass').style.border = "1px solid #dddfe2";
            return false;
        }
    }
}

//validation on submit button is clicked
function CheckField() {
    var fname = document.getElementById('fname').value.trim();
    if (fname.length != 0) {
        document.getElementById('fname').style.border = "1px solid #dddfe2";
    }
    else {
        document.getElementById('fname').style.border = "1px solid red"
    }

    var sname = document.getElementById('sname').value.trim();
    if (sname.length != 0) {
        document.getElementById('sname').style.border = "1px solid #dddfe2";
    }
    else {
        document.getElementById('sname').style.border = "1px solid red"
    }

    var email = document.getElementById('email').value.trim();
    if (email.length != 0) {
        document.getElementById('email').style.border = "1px solid #dddfe2";
    }
    else {
        document.getElementById('email').style.border = "1px solid red"
    }

    var pass = document.getElementById('pass').value.trim();
    if (pass.length != 0) {
        document.getElementById('pass').style.border = "1px solid #dddfe2";
    }
    else {
        document.getElementById('pass').style.border = "1px solid red"
    }

    if (document.getElementById('maleradio').checked == false && document.getElementById('femaleradio').checked == false) {
        document.getElementById('male').style.border = "1px solid red";
        document.getElementById('female').style.border = "1px solid red";
    }
}