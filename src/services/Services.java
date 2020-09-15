package services;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import beans.Amenities;
import beans.Apartment;
import beans.Comment;
import beans.Reservation;
import beans.User;
import beans.enums.ReservationStatus;
import beans.enums.SortType;
import beans.enums.UserRole;
import dao.AmenitiesDAO;
import dao.ApartmentDAO;
import dao.ReservationDAO;
import dao.UserDAO;
import utils.ApartmentFilter;
import utils.ApartmentSearch;
import utils.TimeInterval;
import utils.UserSearch;

@Path("")
public class Services {

	@Context
	ServletContext ctx;

	public Services() {
	}

	@PostConstruct
	// ctx polje je null u konstruktoru, mora se pozvati nakon konstruktora
	// (@PostConstruct anotacija)
	public void init() {
		// Ovaj objekat se instancira više puta u toku rada aplikacije
		// Inicijalizacija treba da se obavi samo jednom
		if (ctx.getAttribute("userDAO") == null) {
			String contextPath1 = ctx.getRealPath("");
			ctx.setAttribute("userDAO", new UserDAO(contextPath1));

			UserDAO users = (UserDAO) ctx.getAttribute("userDAO");
			System.out.println("USER-DAO: " + users.toString());
		}

		if (ctx.getAttribute("apartmentDAO") == null) {
			String contextPath2 = ctx.getRealPath("");
			ctx.setAttribute("apartmentDAO", new ApartmentDAO(contextPath2));
		}

		if (ctx.getAttribute("amenitiesDAO") == null) {
			String contextPath3 = ctx.getRealPath("");
			ctx.setAttribute("amenitiesDAO", new AmenitiesDAO(contextPath3));
		}

		if (ctx.getAttribute("reservationDAO") == null) {
			String contextPath4 = ctx.getRealPath("");
			ctx.setAttribute("reservationDAO", new ReservationDAO(contextPath4));
		}

	}

	@POST
	@Path("/login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response login(User u, @Context HttpServletRequest request) {

		UserDAO users = (UserDAO) ctx.getAttribute("userDAO");
		System.out.println("USER-DAO: " + users.toString());
		User user = users.login(u);

		if (user == null) {
			return Response.status(400).entity("Wrong password and/or username").build();
		} else if (user.isBlocked()) {
			return Response.status(400).entity("Your account is blocked").build();
		}

		HttpSession session = request.getSession();
		session.setAttribute("user", user);

		return Response.status(200).build();
	}

	@POST
	@Path("/registration")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response register(User u) {
		UserDAO users = (UserDAO) ctx.getAttribute("userDAO");

		User user = users.findUsername(u);

		if (user == null) {
			return Response.status(400).entity("Username already exists").build();
		}

		u.setRole(UserRole.GUEST);
		u.setMyApartments(new ArrayList<Apartment>());
		u.setMyReservations(new ArrayList<Reservation>());
		u.setRentedApartments(new ArrayList<Apartment>());

		users.addUser(u);
		return Response.status(200).build();
	}

	@GET
	@Path("/whoIsLoggedIn")
	@Produces(MediaType.APPLICATION_JSON)
	public User whoIsLoggedIn(@Context HttpServletRequest request) {

		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");

		if (user == null) {
			return null;
		}

		return user;
	}

	@POST
	@Path("/logOut")
	@Produces(MediaType.APPLICATION_JSON)
	public Response logOut(@Context HttpServletRequest request) {
		HttpSession session = request.getSession();
		session.invalidate();

		return Response.status(200).build();
	}

	@POST
	@Path("/editProfile")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response editProfile(User u) {
		UserDAO users = (UserDAO) ctx.getAttribute("userDAO");
		User user = users.editProfile(u);

		if (user == null) {
			return Response.status(400).entity("Error editing profile").build();
		}

		return Response.status(200).build();
	}

	@GET
	@Path("/getAllUsers")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<User> getAllUsers(@Context HttpServletRequest request) {

		UserDAO users = (UserDAO) ctx.getAttribute("userDAO");

		return users.findAll();
	}

	@POST
	@Path("/registerHost")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response registerHost(User u) {

		UserDAO users = (UserDAO) ctx.getAttribute("userDAO");

		User host = users.addHost(u);

		if (host == null) {
			return Response.status(400).entity("Username already exists").build();
		}

		u.setRole(UserRole.HOST);
		u.setMyApartments(new ArrayList<Apartment>());
		u.setMyReservations(new ArrayList<Reservation>());
		u.setRentedApartments(new ArrayList<Apartment>());

		return Response.status(200).build();
	}

	@PUT
	@Path("/blockUser/{usernameBlock}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response blockUser(@PathParam("usernameBlock") String usernameBlock) {

		UserDAO users = (UserDAO) ctx.getAttribute("userDAO");

		users.blockUser(usernameBlock);

		return Response.status(200).build();
	}

	@POST
	@Path("/createApartment")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createApartment(Apartment a, @Context HttpServletRequest request) {
		ApartmentDAO apartments = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		AmenitiesDAO amenities = (AmenitiesDAO) ctx.getAttribute("amenitiesDAO");

		// find host that created apartment
		UserDAO users = (UserDAO) ctx.getAttribute("userDAO");
		HttpSession session = request.getSession();
		User host = (User) session.getAttribute("user");

		// adding amenities to list
		a.setAmenities(new ArrayList<Amenities>());
		String splitAm[] = a.getAmenitiesString().split(",");
		for (int i = 0; i < splitAm.length; i++) {
			Amenities foundAmenity = amenities.findById(Long.parseLong(splitAm[i]));
			a.getAmenities().add(foundAmenity);
		}

		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		Date endDate = new Date();
		Date startDate = new Date();

		try {
			startDate = formatter.parse(a.getStartDate());
		} catch (ParseException e) {
			e.printStackTrace();
		}
		try {
			endDate = formatter.parse(a.getEndDate());
		} catch (ParseException e) {
			e.printStackTrace();
		}

		a.getFreeDates().add(new TimeInterval(startDate, endDate));

		// formating images strings
		for (int i = 0; i < a.getImages().size(); i++) {
			String img = a.getImages().get(i);
			String split[] = img.split(",");
			img = split[1];
			a.getImages().set(i, img);
		}

		// creating apartment
		if (a != null && host != null) {
			a.setHost(host.getUsername());
			Apartment apt = apartments.addApartment(a);
			users.addToMyApartments(apt.getHost(), apt);

		} else {
			Response.status(400).entity("Apartment is null").build();
		}

		return Response.status(200).entity("Apartment created" + a).build();
	}

	@POST
	@Path("/editApartment")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response editApartment(Apartment a, @Context HttpServletRequest request) {

		ApartmentDAO apartments = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		AmenitiesDAO amenities = (AmenitiesDAO) ctx.getAttribute("amenitiesDAO");

		// adding amenities to list
		a.setAmenities(new ArrayList<Amenities>());
		String splitAm[] = a.getAmenitiesString().split(",");
		for (int i = 0; i < splitAm.length; i++) {
			Amenities foundAmenity = amenities.findById(Long.parseLong(splitAm[i]));
			a.getAmenities().add(foundAmenity);
		}

		// formating images strings
		for (int i = 0; i < a.getImages().size(); i++) {
			String img = a.getImages().get(i);
			String split[] = img.split(",");
			img = split[1];
			a.getImages().set(i, img);
		}

		Apartment ap = apartments.editApartment(a);

		return Response.status(200).entity("Apartment changed" + ap).build();

	}

	@GET
	@Path("/getAllApartments")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Apartment> getAllApartments(@Context HttpServletRequest request) {

		ApartmentDAO apartments = (ApartmentDAO) ctx.getAttribute("apartmentDAO");

		return apartments.findAll();
	}

	@GET
	@Path("/getApartmentById/{apartmentId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Apartment getApartmentById(@PathParam("apartmentId") Long apartmentId) {

		ApartmentDAO apartments = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		Apartment ret = apartments.findById(apartmentId);

		return ret;
	}

	@DELETE
	@Path("/deleteApartment/{apartmentId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteApartment(@PathParam("apartmentId") Long apartmentId) {

		ApartmentDAO apartment = (ApartmentDAO) ctx.getAttribute("apartmentDAO");

		Apartment ap = apartment.deleteApartment(apartmentId);

		return Response.status(200).entity("Apartment deleted" + ap).build();
	}

	@PUT
	@Path("changeApartmentStatus/{apartmentId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response changeApartmentStatus(@PathParam("apartmentId") Long apartmentId) {

		ApartmentDAO apartment = (ApartmentDAO) ctx.getAttribute("apartmentDAO");

		Apartment ap = apartment.changeApartmentStatus(apartmentId);

		return Response.status(200).entity("Apartment status changed" + ap).build();
	}

	@GET
	@Path("/getAllAmenities")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Amenities> getAllAmenities(@Context HttpServletRequest request) {

		AmenitiesDAO amenities = (AmenitiesDAO) ctx.getAttribute("amenitiesDAO");

		return amenities.findAll();
	}

	@POST
	@Path("/addAmenities")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)

	public Response addAmenities(Amenities a) {

		AmenitiesDAO amenities = (AmenitiesDAO) ctx.getAttribute("amenitiesDAO");

		Amenities amenity = amenities.addAmenities(a);

		if (amenity == null) {
			return Response.status(400).entity("Amenity already exists").build();
		}

		return Response.status(200).build();
	}

	@DELETE
	@Path("/deleteAmenities/{amenityDelete}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteAmenities(@PathParam("amenityDelete") String amenityDelete) {

		AmenitiesDAO amenities = (AmenitiesDAO) ctx.getAttribute("amenitiesDAO");

		Amenities am = amenities.deleteAmenities(amenityDelete);

		return Response.status(200).entity("Amenity deleted" + am).build();
	}

	// PROVERI
	@PUT
	@Path("changeAmenityName/{oldName}/{newName}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response changeAmenityName(@PathParam("oldName") String oldName, @PathParam("newName") String newName) {

		AmenitiesDAO amenities = (AmenitiesDAO) ctx.getAttribute("amenitiesDAO");

		Amenities am = amenities.changeAmenityName(oldName, newName);

		return Response.status(200).entity("Amenity changed" + am).build();
	}

	@GET
	@Path("/getAllReservations/{sortType}")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Reservation> getAllReservations(@PathParam("sortType") SortType sortType,
			@Context HttpServletRequest request) {

		ReservationDAO reservationsDAO = (ReservationDAO) ctx.getAttribute("reservationDAO");
		HashMap<String, Reservation> reservations = reservationsDAO.getReservations();

		ArrayList<Reservation> ret = new ArrayList<Reservation>();

		// getting all reservations
		for (Reservation r : reservations.values()) {
			ret.add(r);
		}

		// RAND means there is no need for sorting
		if (sortType != SortType.RAND) {
			// sorting reservations ascending order
			ret.sort(Comparator.comparingDouble(Reservation::getCost));
			if (sortType == SortType.DESC) {
				// reversing sorted reservations for descending order
				Collections.reverse(ret);
			}
		}
		return ret;
	}

	@POST
	@Path("/addReservation")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response addReservation(Reservation res, @Context HttpServletRequest request) {

		ReservationDAO reservationsDAO = (ReservationDAO) ctx.getAttribute("reservationDAO");

		ApartmentDAO apartments = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		Apartment apartment = apartments.findById(res.getApartmentId());

		UserDAO users = (UserDAO) ctx.getAttribute("userDAO");
		HttpSession session = request.getSession();
		User guest = (User) session.getAttribute("user");

		res.setCost(res.getStays() * apartment.getPrice());
		res.setGuest(guest.getUsername());
		res.setStatus(ReservationStatus.CREATED);

		// setting end date
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

		Calendar c = Calendar.getInstance();
		try {
			c.setTime(formatter.parse(res.getStartDate()));
		} catch (ParseException e) {
			e.printStackTrace();
		}
		c.add(Calendar.DAY_OF_MONTH, res.getStays());
		String endDateString = formatter.format(c.getTime());
		res.setEndDate(endDateString);

		// saving reservation
		Date endDate = new Date();
		Date startDate = new Date();

		try {
			startDate = formatter.parse(res.getStartDate());
		} catch (ParseException e) {
			e.printStackTrace();
		}
		try {
			endDate = formatter.parse(res.getEndDate());
		} catch (ParseException e) {
			e.printStackTrace();
		}

		// check if end date of reservation is not greater than end date of apartment
		Date endDateApartment = new Date();
		Date startDateApartment = new Date();
		try {
			endDateApartment = formatter.parse(apartment.getEndDate());
		} catch (ParseException e) {
			e.printStackTrace();
		}
		try {
			startDateApartment = formatter.parse(apartment.getStartDate());
		} catch (ParseException e) {
			e.printStackTrace();
		}

		if (endDate.after(endDateApartment)) {
			return Response.status(400).entity("Reservation exceeding apartment rent time!").build();
		}
		if (startDate.before(startDateApartment)) {
			return Response.status(400).entity("Reservation exceeding apartment rent time!").build();
		}

		TimeInterval resInterval = new TimeInterval(startDate, endDate);
		Reservation ret = reservationsDAO.addReservation(res, resInterval, apartment.getReservedDates());
		System.out.println("RET:" + ret);
		if (ret == null) {
			return Response.status(400).entity("Reservation couldn't be created, choose valid time!").build();
		}

		// adding reservation to apartment
		apartments.addReservation(ret, resInterval);

		// adding reservation to guest user
		users.addToMyReservations(guest.getUsername(), ret);

		return Response.status(200).entity("Reservation created").build();
	}

	@GET
	@Path("/getAllReservationsUser/{sortType}")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Reservation> getAllReservationsUser(@PathParam("sortType") SortType sortType,
			@Context HttpServletRequest request) {

		UserDAO users = (UserDAO) ctx.getAttribute("userDAO");
		HttpSession session = request.getSession();
		User guest = (User) session.getAttribute("user");
		ArrayList<Reservation> ret = guest.getMyReservations();
		if (sortType != SortType.RAND) {
			ret.sort(Comparator.comparingDouble(Reservation::getCost));
			if (sortType == SortType.DESC) {
				Collections.reverse(ret);
			}
		}

		return ret;
	}

	@PUT
	@Path("/cancelReservation/{apartmentId}/{startDate}/{endDate}")
	@Produces(MediaType.APPLICATION_JSON)
	public Reservation getAllReservationsUser(@PathParam("apartmentId") Long apartmentId,
			@PathParam("startDate") String startDate, @PathParam("endDate") String endDate,
			@Context HttpServletRequest request) {

		ReservationDAO reservationsDAO = (ReservationDAO) ctx.getAttribute("reservationDAO");
		Reservation ret = reservationsDAO.cancelReservation(apartmentId, startDate, endDate);

		// update status in guest list of reservations
		UserDAO users = (UserDAO) ctx.getAttribute("userDAO");
		HttpSession session = request.getSession();
		User guest = (User) session.getAttribute("user");
		users.updateReservationStatus(guest.getUsername(), ret);

		return ret;
	}

	@GET
	@Path("/getAllReservationsHost/{sortType}")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Reservation> getAllReservationsHost(@PathParam("sortType") SortType sortType,
			@Context HttpServletRequest request) {

		UserDAO users = (UserDAO) ctx.getAttribute("userDAO");
		HttpSession session = request.getSession();
		User host = (User) session.getAttribute("user");

		ApartmentDAO apartmentsDAO = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		ArrayList<Long> idsByHost = apartmentsDAO.findApartmentsByHost(host.getUsername());

		ReservationDAO reservationsDAO = (ReservationDAO) ctx.getAttribute("reservationDAO");

		ArrayList<Reservation> ret = new ArrayList<Reservation>();
		for (Long id : idsByHost) {
			// getting reservations that are for apartment with id
			ArrayList<Reservation> retById = reservationsDAO.findReservationsByApartmentId(id);
			// adding them to final list to return
			for (Reservation r : retById) {
				ret.add(r);
			}
		}

		if (sortType != SortType.RAND) {
			ret.sort(Comparator.comparingDouble(Reservation::getCost));
			if (sortType == SortType.DESC) {
				Collections.reverse(ret);
			}
		}

		return ret;
	}

	@PUT
	@Path("/acceptReservation/{apartmentId}/{startDate}/{endDate}")
	@Produces(MediaType.APPLICATION_JSON)
	public Reservation acceptReservation(@PathParam("apartmentId") Long apartmentId,
			@PathParam("startDate") String startDate, @PathParam("endDate") String endDate,
			@Context HttpServletRequest request) {

		ReservationDAO reservationsDAO = (ReservationDAO) ctx.getAttribute("reservationDAO");
		Reservation ret = reservationsDAO.acceptReservation(apartmentId, startDate, endDate);

		// update status in guest list of reservations
		UserDAO users = (UserDAO) ctx.getAttribute("userDAO");
		users.updateReservationStatus(ret.getGuest(), ret);

		return ret;
	}

	@PUT
	@Path("/rejectReservation/{apartmentId}/{startDate}/{endDate}")
	@Produces(MediaType.APPLICATION_JSON)
	public Reservation rejectReservation(@PathParam("apartmentId") Long apartmentId,
			@PathParam("startDate") String startDate, @PathParam("endDate") String endDate,
			@Context HttpServletRequest request) {

		ReservationDAO reservationsDAO = (ReservationDAO) ctx.getAttribute("reservationDAO");
		Reservation ret = reservationsDAO.rejectReservation(apartmentId, startDate, endDate);

		// update status in guest list of reservations
		UserDAO users = (UserDAO) ctx.getAttribute("userDAO");
		users.updateReservationStatus(ret.getGuest(), ret);

		return ret;
	}

	@PUT
	@Path("/endReservation/{apartmentId}/{startDate}/{endDate}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response endReservation(@PathParam("apartmentId") Long apartmentId, @PathParam("startDate") String startDate,
			@PathParam("endDate") String endDate, @Context HttpServletRequest request) {

		ReservationDAO reservationsDAO = (ReservationDAO) ctx.getAttribute("reservationDAO");

		Date endDateParsed = new Date();
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		try {
			// Setting the date to the given date
			endDateParsed = formatter.parse(endDate);
		} catch (ParseException e) {
			e.printStackTrace();
		}

		// is reservation really finished?
		Date now = new Date();
		if (endDateParsed.after(now)) {
			return Response.status(400).entity("Reservation couldn't be ended, reservation time has to expire!")
					.build();
		}

		// if it is update status to ENDED
		Reservation ret = reservationsDAO.endReservation(apartmentId, startDate, endDate);

		// update status in guest list of reservations
		UserDAO users = (UserDAO) ctx.getAttribute("userDAO");
		users.updateReservationStatus(ret.getGuest(), ret);

		return Response.status(200).entity("Reservation ended: " + ret).build();
	}

	@GET
	@Path("/getAllUsersHost")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<User> getAllUsersHost(@Context HttpServletRequest request) {

		ReservationDAO reservationsDAO = (ReservationDAO) ctx.getAttribute("reservationDAO");
		ApartmentDAO apartmentsDAO = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		UserDAO usersDAO = (UserDAO) ctx.getAttribute("userDAO");

		HttpSession session = request.getSession();
		User host = (User) session.getAttribute("user");

		// returns apartments ids that are created by host
		ArrayList<Long> idsByHost = apartmentsDAO.findApartmentsByHost(host.getUsername());

		// ret holds all the reservations that are created for this host's apartments
		ArrayList<Reservation> reservationsByHost = new ArrayList<Reservation>();
		for (Long id : idsByHost) {
			// getting resertvations that are for apartment with id
			ArrayList<Reservation> retById = reservationsDAO.findReservationsByApartmentId(id);
			// adding them to final list to return
			for (Reservation r : retById) {
				reservationsByHost.add(r);
			}
		}

		ArrayList<User> usersByHost = new ArrayList<User>();
		for (Reservation r : reservationsByHost) {
			User foundUser = usersDAO.findByUsername(r.getGuest());
			if (!usersByHost.contains(foundUser))
				usersByHost.add(foundUser);
		}

		return usersByHost;
	}

	@POST
	@Path("/commentReservation/{apartmentId}/{startDate}/{endDate}/{commentText}/{commentRate}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response commentReservation(@PathParam("apartmentId") Long apartmentId,
			@PathParam("startDate") String startDate, @PathParam("endDate") String endDate,
			@PathParam("commentText") String commentText, @PathParam("commentRate") int commentRate,
			@Context HttpServletRequest request) {

		UserDAO users = (UserDAO) ctx.getAttribute("userDAO");
		HttpSession session = request.getSession();
		User guest = (User) session.getAttribute("user");

		Comment newComment = new Comment(apartmentId, guest.getUsername(), commentText, commentRate);

		// add new comment to apartment
		ApartmentDAO apartments = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		Apartment apt = apartments.findById(apartmentId);
		apartments.addComment(apt, newComment);

		// set reservation to commented
		ReservationDAO reservationsDAO = (ReservationDAO) ctx.getAttribute("reservationDAO");
		Reservation ret = reservationsDAO.commentReservation(apartmentId, startDate, endDate);

		// update commented status in guest list of reservations
		users.updateReservationCommentStatus(ret.getGuest(), ret);

		return Response.status(200).entity("Comment created: " + newComment).build();
	}

	@GET
	@Path("/getAllCommentsById/{apartmentId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Comment> getAllCommentsById(@PathParam("apartmentId") Long apartmentId) {

		ApartmentDAO apartments = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		Apartment ret = apartments.findById(apartmentId);

		return ret.getComments();
	}

	@PUT
	@Path("/changeCommentStatus/{apartmentId}/{commentText}/{commentRate}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response changeCommentStatus(@PathParam("apartmentId") Long apartmentId,
			@PathParam("commentText") String commentText, @PathParam("commentRate") int commentRate,
			@Context HttpServletRequest request) {

		ApartmentDAO apartments = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		Apartment apt = apartments.findById(apartmentId);
		Comment c = apartments.changeCommentStatus(apt, commentRate, commentText);

		return Response.status(200).entity("Comment status changed: " + c).build();
	}

	@POST
	@Path("/searchApartments")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Apartment> searchApartments(ApartmentSearch as) {
		ApartmentDAO apartments = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		ArrayList<Apartment> ret = apartments.searchApartment(as);
		return ret;
	}

	@GET
	@Path("/sortApartments/{sortType}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Apartment> sortApartments(@PathParam("sortType") SortType sortType) {
		System.out.println("sortType " + sortType);
		ApartmentDAO apartments = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		ArrayList<Apartment> ret = apartments.sortApartments(sortType);
		System.out.println("RET2 : " + ret);
		for (Apartment apt : ret) {
			System.out.println("price : " + apt.getPrice());
		}

		return ret;
	}

	@GET
	@Path("/searchReservations/{guestUsername}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Reservation> searchReservations(@PathParam("guestUsername") String guestUsername,
			@Context HttpServletRequest request) {
		UserDAO users = (UserDAO) ctx.getAttribute("userDAO");
		HttpSession session = request.getSession();
		User loggedInUser = (User) session.getAttribute("user");

		ReservationDAO reservationsDAO = (ReservationDAO) ctx.getAttribute("reservationDAO");
		HashMap<String, Reservation> reservations = reservationsDAO.getReservations();

		// list that will be searched trough
		ArrayList<Reservation> reservationsForSearch = new ArrayList<Reservation>();

		// if admin is searching, search in all reservations
		if (loggedInUser.getRole() == UserRole.ADMIN) {
			// getting all reservations
			for (Reservation r : reservations.values()) {
				System.out.println("Reservation r admin: " + r);
				reservationsForSearch.add(r);
			}

		} // if host is searching, search in his reservations
		else if (loggedInUser.getRole() == UserRole.HOST) {
			ApartmentDAO apartmentsDAO = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
			// getting apartment ids published by this host
			ArrayList<Long> idsByHost = apartmentsDAO.findApartmentsByHost(loggedInUser.getUsername());
			for (Long id : idsByHost) {
				// getting all reservations for each apartment
				ArrayList<Reservation> retById = reservationsDAO.findReservationsByApartmentId(id);
				// adding found reservations to list for search
				for (Reservation r : retById) {
					reservationsForSearch.add(r);
				}
			}

		}

		// finally searching by username
		if (!guestUsername.equals("all")) {
			ArrayList<Reservation> ret = reservationsDAO.searchByGuest(reservationsForSearch, guestUsername);
			System.out.println("Reservation search ret: " + ret);
			return ret;
		} else {

			System.out.println("Reservation search reservationsForSearch: " + reservationsForSearch);
			return reservationsForSearch;
		}

	}

	@POST
	@Path("/searchUsers")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<User> searchUsers(UserSearch us, @Context HttpServletRequest request) {
		
		UserDAO usersDAO = (UserDAO) ctx.getAttribute("userDAO");
		ApartmentDAO apartmentsDAO = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		ReservationDAO reservationsDAO = (ReservationDAO) ctx.getAttribute("reservationDAO");
		
		HttpSession session = request.getSession();
		User loggedInUser = (User) session.getAttribute("user");
		
		ArrayList<User> usersForSearch = new ArrayList<User>();
		
		
		if (loggedInUser.getRole() == UserRole.HOST) {
			
			
			// returns apartments ids that are created by host
			ArrayList<Long> idsByHost = apartmentsDAO.findApartmentsByHost(loggedInUser.getUsername());

			// ret holds all the reservations that are created for this host's apartments
			ArrayList<Reservation> reservationsByHost = new ArrayList<Reservation>();
			
			for (Long id : idsByHost) {
				// getting resertvations that are for apartment with id
				ArrayList<Reservation> retById = reservationsDAO.findReservationsByApartmentId(id);
				// adding them to final list to return
				for (Reservation r : retById) {
					reservationsByHost.add(r);
					}
				}

			ArrayList<User> usersByHost = new ArrayList<User>();
			for (Reservation r : reservationsByHost) {
				User foundUser = usersDAO.findByUsername(r.getGuest());
				if (!usersByHost.contains(foundUser))
					usersByHost.add(foundUser);
			}
			
			usersForSearch = usersByHost;	
		}
		
		
		else {
			
			for (User u : usersDAO.getUsers().values()) {
				usersForSearch.add(u);
			}
					
		}
		
		
		ArrayList<User> listUsers = new ArrayList<User>();
		listUsers = usersDAO.searchUsers(usersForSearch, us);
		return listUsers;

	}


	@POST
	@Path("/filterApartments")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Apartment> filterApartments(ApartmentFilter af) {
		ApartmentDAO apartments = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		ArrayList<Apartment> ret = apartments.filterApartments(af);
		return ret;
	}

}
