package utils;

public class UserSearch {
	
	private String roleUser;
	private String genderUser;
	private String nameUser;
	
	
	public UserSearch(String roleUser, String genderUser, String nameUser) {
		super();
		this.roleUser = roleUser;
		this.genderUser = genderUser;
		this.nameUser = nameUser;
	}


	public String getRoleUser() {
		return roleUser;
	}


	public void setRoleUser(String roleUser) {
		this.roleUser = roleUser;
	}


	public String getGenderUser() {
		return genderUser;
	}


	public void setGenderUser(String genderUser) {
		this.genderUser = genderUser;
	}


	public String getNameUser() {
		return nameUser;
	}


	public void setNameUser(String nameUser) {
		this.nameUser = nameUser;
	}


	public UserSearch() {
		super();
		// TODO Auto-generated constructor stub
	}


	@Override
	public String toString() {
		return "UserSearch [roleUser=" + roleUser + ", genderUser=" + genderUser + ", nameUser=" + nameUser + "]";
	}
	
	
	
	

}
