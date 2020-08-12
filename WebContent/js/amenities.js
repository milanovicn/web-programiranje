$(document).ready(function () {
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


    $('select').formSelect();
    
    whoIsLoggedIn();
    deleteAmenity();


    $("#logout").click(function () {
        logOut();
    });
    $("#logoutM").click(function () {
        logOut();
    });    
    $("#addAmenityForm").submit(function (event) {
        addAmenity();
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
                    allAmenities();
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
            window.location = "./login.html";
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.log("Error: ", errorMessage);
        }

    });
    
}

function addAmenity() {
    event.preventDefault();

    var name = $('input[name="name"]').val();
   
   
        $.post({
            url: 'rest/addAmenities',
            data: JSON.stringify({ name }),
            contentType: 'application/json',
            success: function () {
                alert("amenity created");
                location.reload();
            },
            error: function () {
                alert("Amenity already exists");
            }
        });
}

function allAmenities() {
    $.get({
        url: 'rest/getAllAmenities',
        contentType: 'application/json',
        success: function (amenities) {

            for (var amenity of amenities) {
                if (amenity.deleted == false) {
                $("#allAmenitiesList").append('<div class="row"><ul class="collection with-header" ><li class="collection-item"> <h6 class="grey-text text-darken-3" id="nameLi">Name: ' + amenity.name + '  </h6></li></ul></div>');
             }
             }

            var Options="<option value=\"NAME\" disabled selected>Choose name</option>";

            for (var a of amenities) {
                if (a.deleted == false) {
                    Options=Options+"<option value='" + a.name + "'>" + a.name + "</option>";
                }
            }

            
            $('#selectAmenity').empty();
            $('#selectAmenity').append(Options);
            $("#selectAmenity").formSelect();

        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.log(errorMessage);
        }
    });
}


function deleteAmenity () {
    $("#deleteAmenity").click(function () {
        var name = $('#selectAmenity :selected').text();
 
        $.ajax({
            url: 'rest/deleteAmenities/' + name,
            type: 'DELETE',
            success: function () {
                alert("Amenity deleted.");
                location.reload();
            },
            error: function (jqXhr, textStatus, errorThrown) {
                alert("Amenity not deleted.");
                console.log(errorThrown);
            }
        });
    });
}
