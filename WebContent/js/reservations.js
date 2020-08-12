$(document).ready(function () {
	$("#hostDiv").hide();
	$("#userDiv").show();
	$("#adminDiv").hide();

	$('select').formSelect();
	$('.datepicker').datepicker();
	$('.timepicker').timepicker();


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
	$("#logoutM").click(function () {
		logOut();
	});
	
});

function whoIsLoggedIn() {
	$.get({
		url: 'rest/whoIsLoggedIn',
		contentType: 'application/json',
		success: function (user) {
			
			if (user != undefined) {
				loggedInUser = user.username;

				if (user.role == "GUEST") {
					loadReservationsForUser();
					$("#hostDiv").hide();
					$("#userDiv").show();
					$("#adminDiv").hide();

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

				} else if (user.role == "ADMIN") {
					loadReservationsForAdmin();
					$("#hostDiv").hide();
					$("#userDiv").hide();
					$("#adminDiv").show();


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

				} else if (user.role == "HOST") {
					loadReservationsForHost();
					$("#hostDiv").show();
					$("#userDiv").hide();
					$("#adminDiv").hide();

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

				} else {
					loadApartmentsForUser();
					//$("#hostDiv").hide();
					//$("#userDiv").show();
					//$("#adminDiv").hide();
					console.log("No one is logged in");

				}
			} else {
				console.log("No one is logged in");
					//$("#hostDiv").hide();
					//$("#userDiv").show();
					//$("#adminDiv").hide();
			}

		}
	});
}

function logOut() {
	$.post({
		url: 'rest/logOut',
		success: function () {
			alert("Log out successful");
			window.location = "./login.html";
		},
		error: function (jqXhr, textStatus, errorMessage) {
			console.log("Error: ", errorMessage);
		}

	});
}

function loadReservationsForAdmin() {

    $.get({
		url: 'rest/getAllReservations',
		contentType: 'application/json',
		success: function (reservations) {
            var allReservations = reservations;

            for (let i = 0; i < allReservations.length; i++) {
                let reservation = allReservations[i];
        
                $("#allReservationsAdmin").append('<div class="col s6"><ul class="collection with-header" >'
                + '<li class="collection-item grey-text text-darken-3" >Dates: ' + reservation.startDate+ ', ' + reservation.endDate + '</li>'
                + '<li class="collection-item grey-text text-darken-3" >Guest: ' + reservation.guest + '</li>'
                + '<li class="collection-item grey-text text-darken-3" >Apartment id: ' + reservation.apartmentId + '</li>'
                + '<li class="collection-item grey-text text-darken-3" >Message: ' + reservation.message + '</li>'
                + '<li class="collection-item grey-text text-darken-3" >Stays: ' + reservation.stays + '</li>'
                + '<li class="collection-item grey-text text-darken-3" >Cost: ' + reservation.cost + '</li>' 
                + '<li class="collection-item grey-text text-darken-3" >Status: ' + reservation.status + '</li>'
                + '</ul></div>');

            }

		},
		error: function (jqXhr, textStatus, errorMessage) {
			console.log(errorMessage);
		}
	});

	
}

function loadReservationsForUser() {

    $.get({
		url: 'rest/getAllReservationsUser',
		contentType: 'application/json',
		success: function (reservations) {
            var allReservations = reservations;

            for (let i = 0; i < allReservations.length; i++) {
                let reservation = allReservations[i];
                var htmlCode = '<div style="margin-top: 50px" class="col s12"><ul class="collection with-header" >'
                + '<li class="collection-item grey-text text-darken-3" >Dates: ' + reservation.startDate+ ', ' + reservation.endDate + '</li>'
                + '<li class="collection-item grey-text text-darken-3" >Apartment id: ' + reservation.apartmentId + '</li>'
                + '<li class="collection-item grey-text text-darken-3" >Message: ' + reservation.message + '</li>'
                + '<li class="collection-item grey-text text-darken-3" >Stays: ' + reservation.stays + '</li>'
                + '<li class="collection-item grey-text text-darken-3" >Cost: ' + reservation.cost + '</li>' 
                + '<li class="collection-item grey-text text-darken-3" >Status: ' + reservation.status + '</li></ul>';

                if(reservation.status == "CREATED" || reservation.status == "ACCEPTED"){
                    var btnCancel = $('</div><div class="col s12"><button id="cancelReservation" class="btn waves-effect waves-light light-blue ">Cancel<i class="material-icons right">send</i></button></div>');
                    btnCancel.click(cancelReservation(reservation));
                    $("#allReservationsUser").append(htmlCode).append(btnCancel).append('</div>');
                    //$("#allReservationsUser").append(btnCancel);
                   // $("#allReservationsUser").append('</ul></div>');
                } else {
                    $("#allReservationsUser").append(htmlCode).append('</div>');
                }
            }

		},
		error: function (jqXhr, textStatus, errorMessage) {
			console.log(errorMessage);
		}
	});

	
}

function cancelReservation(reservation) { 
    return function() {
    $.ajax({
        url: 'rest/cancelReservation/' + reservation.apartmentId  + "/" + reservation.startDate  + "/" + reservation.endDate,
        type: 'PUT',
        success: function () {
            alert("Reservation canceled");
            location.reload();
        },
        error: function () {
            alert("Reservation not canceled");
            location.reload();
        }
    });
    }
}


function loadReservationsForHost() {

    $.get({
		url: 'rest/getAllReservationsHost',
		contentType: 'application/json',
		success: function (reservations) {
            var allReservations = reservations;

            for (let i = 0; i < allReservations.length; i++) {
                let reservation = allReservations[i];
                var htmlCode = '<div style="margin-top: 50px" class="col s12"><ul class="collection with-header" >'
                + '<li class="collection-item grey-text text-darken-3" >Dates: ' + reservation.startDate+ ', ' + reservation.endDate + '</li>'
				+ '<li class="collection-item grey-text text-darken-3" >Apartment id: ' + reservation.apartmentId + '</li>'
				+ '<li class="collection-item grey-text text-darken-3" >Guest: ' + reservation.guest + '</li>'
                + '<li class="collection-item grey-text text-darken-3" >Message: ' + reservation.message + '</li>'
                + '<li class="collection-item grey-text text-darken-3" >Stays: ' + reservation.stays + '</li>'
                + '<li class="collection-item grey-text text-darken-3" >Cost: ' + reservation.cost + '</li>' 
                + '<li class="collection-item grey-text text-darken-3" >Status: ' + reservation.status + '</li></ul>';

                if(reservation.status == "CREATED"){
                    var btnAccept = $('</div><div class="col s6"><button id="acceptReservation" class="btn waves-effect waves-light light-blue ">Accept<i class="material-icons right">send</i></button></div>');
					btnAccept.click(acceptReservation(reservation));
					var btnReject = $('</div><div class="col s6"><button id="rejectReservation" class="btn waves-effect waves-light light-blue ">Reject<i class="material-icons right">send</i></button></div>');
                    btnReject.click(rejectReservation(reservation));
					
					$("#allReservationsHost").append(htmlCode).append(btnAccept).append(btnReject).append('</div>');
                } else if(reservation.status == "ACCEPTED"){
                    var btnEnd= $('</div><div class="col s12"><button id="endReservation" class="btn waves-effect waves-light light-blue ">End<i class="material-icons right">send</i></button></div>');
					btnEnd.click(endReservation(reservation));
					
					$("#allReservationsHost").append(htmlCode).append(btnEnd).append('</div>');
                } else {
                    $("#allReservationsHost").append(htmlCode).append('</div>');
                }
            }

		},
		error: function (jqXhr, textStatus, errorMessage) {
			console.log(errorMessage);
		}
	});
}

function acceptReservation(reservation) { 
    return function() {
    $.ajax({
        url: 'rest/acceptReservation/' + reservation.apartmentId  + "/" + reservation.startDate  + "/" + reservation.endDate,
        type: 'PUT',
        success: function () {
            alert("Reservation accepted");
            location.reload();
        },
        error: function () {
            alert("Reservation not accepted");
            location.reload();
        }
    });
    }
}

function rejectReservation(reservation) { 
    return function() {
    $.ajax({
        url: 'rest/rejectReservation/' + reservation.apartmentId  + "/" + reservation.startDate  + "/" + reservation.endDate,
        type: 'PUT',
        success: function () {
            alert("Reservation rejected");
            location.reload();
        },
        error: function () {
            alert("Reservation not rejected");
            location.reload();
        }
    });
    }
}

function endReservation(reservation) { 
    return function() {
    $.ajax({
        url: 'rest/endReservation/' + reservation.apartmentId  + "/" + reservation.startDate  + "/" + reservation.endDate,
        type: 'PUT',
        success: function () {
            alert("Reservation ended");
            location.reload();
        },
        error: function () {
            alert("Reservation not ended, reservation time has to finish!");
            location.reload();
        }
    });
    }
}

