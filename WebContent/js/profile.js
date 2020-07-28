$(document).ready(function () {
    //init of selec field 
    $('select').formSelect();

    $("#login").show();
    $("#register").show();
    $("#apartments").show();
    $("#profile").hide();
    $("#amenities").hide();
    $("#reservations").hide();
    $("#users").hide();
    $("#logout").hide();

	$("#loginM").show();
	$("#registerM").show();
	$("#apartmentsM").show();
	$("#profileM").hide();
	$("#amenitiesM").hide();
	$("#reservationsM").hide();
	$("#usersM").hide();
	$("#logoutM").hide();




    whoIsLoggedIn();

    $("#logout").click(function () {
        logOut();
    });

    $("#editProfileForm").submit(function (event) {
        event.preventDefault();
        editUser();
    });

});

function whoIsLoggedIn() {
    $.get({
        url: 'rest/whoIsLoggedIn',
        contentType: 'application/json',
        success: function (user) {
            if (user != undefined) {
                if (user.role == "GUEST") {
                    $("#login").hide();
                    $("#register").hide();
                    $("#apartments").show();
                    $("#profile").show();
                    $("#amenities").hide();
                    $("#reservations").show();
                    $("#users").hide();
                    $("#logout").show();

                    $("#loginM").hide();
                    $("#registerM").hide();
                    $("#apartmentsM").show();
                    $("#profileM").show();
                    $("#amenitiesM").hide();
                    $("#reservationsM").show();
                    $("#usersM").hide();
                    $("#logoutM").show();

                    console.log("User logged in");
                    console.log(user);
                    setUserData(user);

                } else if (user.role == "ADMIN") {
                    $("#login").hide();
                    $("#register").hide();
                    $("#apartments").show();
                    $("#profile").show();
                    $("#amenities").show();
                    $("#reservations").show();
                    $("#users").show();
                    $("#logout").show();

                    $("#loginM").hide();
                    $("#registerM").hide();
                    $("#apartmentsM").show();
                    $("#profileM").show();
                    $("#amenitiesM").show();
                    $("#reservationsM").show();
                    $("#usersM").show();
                    $("#logoutM").show();

                    console.log("Admin logged in");
                    console.log(user);
                    setUserData(user);

                } else if (user.role == "HOST") {
                    $("#login").hide();
                    $("#register").hide();
                    $("#apartments").show();
                    $("#profile").show();
                    $("#amenities").hide();
                    $("#reservations").show();
                    $("#users").show();
                    $("#logout").show();

                    $("#loginM").hide();
                    $("#registerM").hide();
                    $("#apartmentsM").show();
                    $("#profileM").show();
                    $("#amenitiesM").hide();
                    $("#reservationsM").show();
                    $("#usersM").show();
                    $("#logoutM").show();


                    console.log("Host logged in");
                    console.log(user);
                    setUserData(user);

                } else {
                    console.log("No one is logged in");

                }
            } else {
                console.log("No one is logged in");
            }

        }
    });
}



function setUserData(user) {
    $("#usernameLi").append("Username: " + user.username);
    $("#nameLi").append("Name: " + user.name);
    $("#lastnameLi").append("Lastname: " + user.lastname);
    $("#roleLi").append("Role: " + user.role);
    $("#username").val(user.username);

    if (user.gender == "F") {
        $("#genderLi").append("Gender: Female");

    } else if (user.gender == "M") {
        $("#genderLi").append("Gender: Male");

    } else {
        $("#genderLi").append("Gender: Other");

    }
}



function logOut() {
    $.post({
        url: 'rest/logOut',
        success: function () {
            //alert("Uspešno ste se odjavili");
            window.location = "./home.html";
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.log("Error: ", errorMessage);
        }

    });
}



function editUser() {
    var username = $('input[name="username"]').val();
    var password = $('input[name="password"]').val();
    var passwordControl = $('input[name="passwordControl"]').val();
    var name = $('input[name="name"]').val();
    var lastname = $('input[name="lastname"]').val();
    var gender = $('#selectGender :selected').val();

    if(password == passwordControl){
        $.post({
            url: 'rest/editProfile',
            data: JSON.stringify({ username, password, name, lastname, gender }),
            contentType: 'application/json',
            success: function () {
                alert("Edit successful");
                location.reload();
            },
            error: function () {
                alert("Edit unsuccessful, ali radi");
                location.reload();
            }
        });
    } else {
        alert("Password and repeated passsword not matching, try again");
    }

    

}