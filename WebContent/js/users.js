$(document).ready(function () {
    $("#login").show();
    $("#register").show();
    $("#apartments").show();
    $("#profile").hide();
    $("#amenities").hide();
    $("#reservations").hide();
    $("#users").hide();
    $("#logout").hide();
    $("#adminDiv").hide();


    $("#loginM").show();
    $("#registerM").show();
    $("#apartmentsM").show();
    $("#profileM").hide();
    $("#amenitiesM").hide();
    $("#reservationsM").hide();
    $("#usersM").hide();
    $("#logoutM").hide();


    $('select').formSelect();
    
    whoIsLoggedIn();
    blockUser();

    $("#logout").click(function () {
        logOut();
    });

   
    
    $("#registrationForm").submit(function (event) {
        registerHost();
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

                    $("#adminDiv").hide();

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

                } else if (user.role == "ADMIN") {
                    allUsers();
                    $("#login").hide();
                    $("#register").hide();
                    $("#apartments").show();
                    $("#profile").show();
                    $("#amenities").show();
                    $("#reservations").show();
                    $("#users").show();
                    $("#logout").show();

                    $("#adminDiv").show();

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

                } else if (user.role == "HOST") {
                    $("#login").hide();
                    $("#register").hide();
                    $("#apartments").show();
                    $("#profile").show();
                    $("#amenities").hide();
                    $("#reservations").show();
                    $("#users").show();
                    $("#logout").show();

                    $("#adminDiv").hide();

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

                } else {
                    console.log("No one is logged in");

                }
            } else {
                console.log("No one is logged in");
            }

        }
    });
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

function registerHost() {
    event.preventDefault();

    var username = $('input[name="username"]').val();
    var password = $('input[name="password"]').val();
    var name = $('input[name="name"]').val();
    var lastname = $('input[name="lastname"]').val();
    var gender = $('#selectGender :selected').val();
    var passwordControl = $('input[name="passwordControl"]').val();

    console.log("Password: ");
    console.log(password);
    console.log("PasswordControl: ");
    console.log(passwordControl);

    if (password == passwordControl) {
        $.post({
            url: 'rest/registerHost',
            data: JSON.stringify({ username, password, name, lastname, gender }),
            contentType: 'application/json',
            success: function () {
                alert("Registration successful");
                location.reload();
            },
            error: function () {
                alert("Username already registered");
            }
        });
    } else {
        alert("Password and repeated passsword not matching, try again");
    }

}

function allUsers() {
    $.get({
        url: 'rest/getAllUsers',
        contentType: 'application/json',
        success: function (users) {

            for (var user of users) {
                $("#allUsersList").append('<div class="row"><ul class="collection with-header" ><li class="collection-header"> <h5 class="grey-text" id="usernameLi">Username: ' + user.username + '  </h5></li>'
                    + '<li class="collection-item grey-text" >Role: ' + user.role + '</li>'
                    + '<li class="collection-item grey-text" >Gender: ' + user.gender + '</li>'
                    + '<li class="collection-item grey-text" >Name: ' + user.name + '</li>'
                    + '<li class="collection-item grey-text" >Lastname: ' + user.lastname + '</li>' + '</ul></div>');

            }

            //POPRAVITI STO NE UCITAVA USERNAMES U SELECTUSER
            for (var u of users) {
                if (u.blocked == false) {
                    console.log("User: ");
                    console.log(u);
                    $("#selectUser").append('<option value="' + u.username + '">' + u.username + '</option>');
                }
            }



        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.log(errorMessage);
        }
    });
}

function blockUser() {
    $("#blockUser").click(function () {
        var username = $('#selectUser :selected').text();
    
        console.log("USERNAME ZA BLOCK: ");
        console.log(username);
        $.ajax({
            url: 'rest/blockUser/' + username,
            type: 'PUT',
            success: function () {
                alert("UserBlocked");
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });
    });
}
