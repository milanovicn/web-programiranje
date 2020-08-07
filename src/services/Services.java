package services;

import java.util.ArrayList;
import java.util.Collection;

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
import beans.Reservation;
import beans.User;
import beans.enums.UserRole;
import dao.AmenitiesDAO;
import dao.ApartmentDAO;
import dao.UserDAO;

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
			ctx.setAttribute("amenitiesDAO", new AmenitiesDAO (contextPath3));
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
		
		//find host that created apartment
		UserDAO users = (UserDAO) ctx.getAttribute("userDAO");		
		HttpSession session = request.getSession();
		User host = (User) session.getAttribute("user");
		
		//mozda lokacija dao?
		//KategorijaDAO kategorije = (KategorijaDAO) ctx.getAttribute("categoryDAO");	
		
		
		//adding amenities to list
		a.setAmenities(new ArrayList<Amenities>());
		String splitAm[] = a.getAmenitiesString().split(",");
		for(int i = 0; i<splitAm.length; i++ ) {
			Amenities foundAmenity = amenities.findById(Long.parseLong(splitAm[i]));
			a.getAmenities().add(foundAmenity);
		}
		
		
		//formating images strings
		for(int i = 0; i<a.getImages().size(); i++ ) {
			String img = a.getImages().get(i);
			String split[] = img.split(",");
			img=split[1];
			a.getImages().set(i, img);
		}
		
		//creating apartment
		if  (a != null && host != null) {
			a.setHost(host.getUsername());
			Apartment apt =  apartments.addApartment(a);
			users.addToMyApartments(apt.getHost(), apt);
			
			
		} else {
			Response.status(400).entity("Apartment is null").build();
		}
		
		//if (o != null) {
		//	String kategorija = o.getCategory();
		//	Kategorija updejtovanaKategorija = kategorije.findByName(kategorija);
		//	kategorije.addOglasUKategoriju(updejtovanaKategorija, o);
		//}
		
		return Response.status(200).entity("Apartment created" + a).build();
	}

	@GET
	@Path("/getAllApartments")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Apartment> getAllApartments(@Context HttpServletRequest request) {

		ApartmentDAO apartments = (ApartmentDAO) ctx.getAttribute("apartmentDAO");

		return apartments.findAll();
	}
	@GET
	@Path("/getAllAmenities")
	@Produces(MediaType.APPLICATION_JSON)
	public  Collection<Amenities> getAllAmenities(@Context HttpServletRequest request) {
		
		AmenitiesDAO amenities = (AmenitiesDAO) ctx.getAttribute("amenitiesDAO");	

		return amenities.findAll();
	}
	 
	
	@POST
	@Path("/addAmenities")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	
	public Response addAmenities (Amenities a) {
			
		AmenitiesDAO amenities = (AmenitiesDAO) ctx.getAttribute("amenitiesDAO");
						
		Amenities amenity = amenities.addAmenities(a);
		
		if(amenity == null) {
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
	

}
