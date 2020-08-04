package beans;

import java.util.ArrayList;

import beans.enums.UserGender;
import beans.enums.UserRole;

public class User {
	
	private String username;
	private String password;
	private String name;
	private String lastname;
	private UserGender gender = UserGender.OTHER;
	private UserRole role = UserRole.GUEST;
	private boolean blocked = false;
	
	//GUEST
	private ArrayList<Apartment> rentedApartments = new ArrayList<Apartment>();
	private ArrayList<Reservation> myReservations = new ArrayList<Reservation>();
	
	
	//HOST
	private ArrayList<Apartment> myApartments = new ArrayList<Apartment>();


	public User(String username, String password, String name, String lastname, String gender) {
		super();
		this.username = username;
		this.password = password;
		this.name = name;
		this.lastname = lastname;
		this.blocked = false;
		if(gender.equals("F") || gender.toUpperCase().equals("FEMALE") )
			this.gender = UserGender.F;
		else if(gender.equals("M") || gender.toUpperCase().equals("MALE"))
			this.gender = UserGender.M;
		else
			this.gender = UserGender.OTHER;
		
	}


	public User() {
		super();
	}


	



	@Override
	public String toString() {
		return "User [username=" + username + ", password=" + password + ", name=" + name + ", lastname=" + lastname
				+ ", gender=" + gender + ", role=" + role + ", blocked=" + blocked + ", rentedApartments="
				+ rentedApartments + ", myReservations=" + myReservations + ", myApartments=" + myApartments + "]";
	}


	public String getUsername() {
		return username;
	}


	public boolean isBlocked() {
		return blocked;
	}


	public void setBlocked(boolean blocked) {
		this.blocked = blocked;
	}


	public void setUsername(String username) {
		this.username = username;
	}


	public String getPassword() {
		return password;
	}


	public void setPassword(String password) {
		this.password = password;
	}


	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}


	public String getLastname() {
		return lastname;
	}


	public void setLastname(String lastname) {
		this.lastname = lastname;
	}


	public UserGender getGender() {
		return gender;
	}


	public void setGender(UserGender gender) {
		this.gender = gender;
	}


	public UserRole getRole() {
		return role;
	}


	public void setRole(UserRole role) {
		this.role = role;
	}


	public ArrayList<Apartment> getRentedApartments() {
		return rentedApartments;
	}


	public void setRentedApartments(ArrayList<Apartment> rentedApartments) {
		this.rentedApartments = rentedApartments;
	}


	public ArrayList<Reservation> getMyReservations() {
		return myReservations;
	}


	public void setMyReservations(ArrayList<Reservation> myReservations) {
		this.myReservations = myReservations;
	}


	public ArrayList<Apartment> getMyApartments() {
		return myApartments;
	}


	public void setMyApartments(ArrayList<Apartment> myApartments) {
		this.myApartments = myApartments;
	}
	
	
	
	
	
}
