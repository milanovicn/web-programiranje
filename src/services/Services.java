package services;

import java.util.ArrayList;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import beans.Apartment;
import beans.Reservation;
import beans.User;
import beans.enums.UserRole;
import dao.UserDAO;


@Path("")
public class Services {
	
	@Context
	ServletContext ctx;
	
	
	public Services() {
	}
	
	
	@PostConstruct
	// ctx polje je null u konstruktoru, mora se pozvati nakon konstruktora (@PostConstruct anotacija)
	public void init() {
		// Ovaj objekat se instancira više puta u toku rada aplikacije
		// Inicijalizacija treba da se obavi samo jednom
		if (ctx.getAttribute("userDAO") == null) {
	    	String contextPath1 = ctx.getRealPath("");
	    	ctx.setAttribute("userDAO", new UserDAO(contextPath1));
	    	
	    	UserDAO users = (UserDAO) ctx.getAttribute("userDAO");
			System.out.println("USER-DAO: " + users.toString());
		}
		//if (ctx.getAttribute("apartmentDAO") == null) {
	    	//String contextPath2 = ctx.getRealPath("");
			//ctx.setAttribute("oglasDAO", new OglasDAO(contextPath2));
		//}
		//if (ctx.getAttribute("amenitiesDAO") == null) {
	    	//String contextPath3 = ctx.getRealPath("");
			//ctx.setAttribute("categoryDAO", new KategorijaDAO(contextPath3));
		//}	
		
		
	}
	
	
	@POST
	@Path("/login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response login(User u, @Context HttpServletRequest request) {	
		
		UserDAO users = (UserDAO) ctx.getAttribute("userDAO");
		System.out.println("USER-DAO: " + users.toString());
		User user = users.login(u);
		
		if(user == null) {
			return Response.status(400).entity("Wrong password and/or username").build();
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
		
		if(user == null) {
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
		
		if(user == null) {
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
		
		if(user == null) {
			return Response.status(400).entity("Error editing profile").build();
		}
		
		return Response.status(200).build();
	}
	
	
}
