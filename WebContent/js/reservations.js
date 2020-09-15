var allReservations = [];
var loggedInUser = "";
var loggedInUserRole = "";

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

	$("#searchDiv").hide();
	$("#searchDivHeaderDiv").hide();
	
	$("#showSearchDiv").click(function () {
		$("#searchDiv").toggle();
	});
	whoIsLoggedIn();

	$("#logout").click(function () {
		logOut();
	});
	$("#logoutM").click(function () {
		logOut();
	});

	$("#sortAsc").click(function () {
		sortReservations("ASC");
	});

	$("#sortDesc").click(function () {
		sortReservations("DESC");
	});
	$("#searchForm").submit(function (event) {
		event.preventDefault();
		searchReservations();

	});
});

function whoIsLoggedIn() {
	$.get({
		url: 'rest/whoIsLoggedIn',
		contentType: 'application/json',
		success: function (user) {
			
			if (user != undefined) {
				loggedInUser = user.username;
				loggedInUserRole = user.role;
				if (user.role == "GUEST") {
					loadReservationsForUser("RAND");
					$("#searchDivHeaderDiv").hide();


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
					loadReservationsForAdmin("RAND");
					$("#searchDivHeaderDiv").show();


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
					loadReservationsForHost("RAND");
					$("#searchDivHeaderDiv").show();


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
					$("#searchDivHeaderDiv").hide();

					//loadApartmentsForUser("RAND");
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

function loadReservationsForAdmin(sortType) {

    $.get({
		url: 'rest/getAllReservations/' + sortType,
		contentType: 'application/json',
		success: function (reservations) {
             allReservations = reservations;
			 fillInReservationsAdmin();

		},
		error: function (jqXhr, textStatus, errorMessage) {
			console.log(errorMessage);
		}
	});

	
}

function loadReservationsForUser(sortType) {

    $.get({
		url: 'rest/getAllReservationsUser/' + sortType,
		contentType: 'application/json',
		success: function (reservations) {
             allReservations = reservations;
			 fillInReservationsUser();

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

function commentReservation(reservation) { 
	return function() {
	var commentText = $("#commentText" + reservation.apartmentId).val();
	var commentRate = $("#commentRate" + reservation.apartmentId).val();
	$.post({
        url: 'rest/commentReservation/' + reservation.apartmentId  + "/" + reservation.startDate  + "/" + reservation.endDate + "/" + commentText + "/" + commentRate,
        success: function () {
            alert("Reservation commented");
            location.reload();
        },
        error: function () {
            alert("Reservation not commented");
            location.reload();
        }
    });
}
}


function loadReservationsForHost(sortType) {

    $.get({
		url: 'rest/getAllReservationsHost/' + sortType,
		contentType: 'application/json',
		success: function (reservations) {
             allReservations = reservations;
			fillInReservationsHost();

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


function sortReservations(sortType) {
	if (loggedInUser != undefined) {
			
		if (loggedInUserRole == "GUEST") {
			loadReservationsForUser(sortType);
		} else if (loggedInUserRole == "ADMIN") {
			loadReservationsForAdmin(sortType);
		} else if (loggedInUserRole == "HOST") {
			loadReservationsForHost(sortType);
		} else {
			loadReservationsForUser(sortType);
		}
	}

}

function searchReservations() {
	var guestUsername = $('input[name="guestUsername"]').val();
	if (!guestUsername) {
		guestUsername = "all";
	}
	$.get({
		url: 'rest/searchReservations/' + guestUsername,
		contentType: 'application/json',
		success: function (reservations) {
			allReservations = reservations;
			console.log(allReservations);
			if (loggedInUser != undefined) {
			
				if (loggedInUserRole == "GUEST") {
					fillInReservationsUser();
				} else if (loggedInUserRole == "ADMIN") {
					fillInReservationsAdmin();
				} else if (loggedInUserRole == "HOST") {
					fillInReservationsHost();
				} else {
					fillInReservationsUser();
				}
			}
		},
		error: function (jqXhr, textStatus, errorMessage) {
			console.log(errorMessage);
		}
	});


}

function fillInReservationsUser() {
	$("#allReservationsUser").empty();
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
		} else if((reservation.status == "REJECTED" || reservation.status == "ENDED") && reservation.commented == false){
			var commentText = $('</div><div class="col s12"><input id="commentText'+ reservation.apartmentId + '" name="commentText" type="text" class="validate" required><label for="commentText">Comment</label></div>');
			var commentRate = $('<div class="col s12"><input id="commentRate'+ reservation.apartmentId + '" name="commentRate" type="number" class="validate" required><label for="commentRate">Rate</label></div>');
			var btnComment = $('<div class="col s12"><button id="commentReservation" class="btn waves-effect waves-light light-blue ">Comment<i class="material-icons right">send</i></button></div>');
			btnComment.click(commentReservation(reservation, commentText, commentRate));
			$("#allReservationsUser").append(htmlCode).append(commentText).append(commentRate).append(btnComment).append('</div>');
		} else {
			$("#allReservationsUser").append(htmlCode).append('</div>');
		}
	}

}


function fillInReservationsHost() {
	$("#allReservationsHost").empty();
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
	
}

function fillInReservationsAdmin() {
	$("#allReservationsAdmin").empty();
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
}	
