package dao;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.introspect.VisibilityChecker;
import com.fasterxml.jackson.databind.type.MapType;
import com.fasterxml.jackson.databind.type.TypeFactory;

import beans.Apartment;
import beans.User;
import beans.enums.UserRole;

public class UserDAO {
	private HashMap<String, User> users = new HashMap<>();
	private String filePath;

	public UserDAO() {

	}

	public UserDAO(String contextPath) {
		setFilePath(contextPath);
		setUsers(new HashMap<String, User>());
		// testData();
		loadUsers(contextPath);

	}

	// Getters and setters
	public HashMap<String, User> getUsers() {
		return users;
	}

	public void setUsers(HashMap<String, User> users) {
		this.users = users;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	// Methods for files and data

	@SuppressWarnings("unchecked")
	public void loadUsers(String contextPath) {
		File file = null;
		FileWriter fileWriter = null;
		BufferedReader in = null;

		try {
			file = new File(contextPath + "/data/_users.txt");
			in = new BufferedReader(new FileReader(file));

			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.setVisibilityChecker(
					VisibilityChecker.Std.defaultInstance().withFieldVisibility(JsonAutoDetect.Visibility.ANY));

			TypeFactory factory = TypeFactory.defaultInstance();
			MapType type = factory.constructMapType(HashMap.class, String.class, User.class);
			objectMapper.getFactory().configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, true);
			users = (HashMap<String, User>) objectMapper.readValue(file, type);
		} catch (FileNotFoundException fnf) {
			try {
				file.createNewFile();
				fileWriter = new FileWriter(file);
				ObjectMapper objectMapper = new ObjectMapper();
				objectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
				objectMapper.getFactory().configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, true);
				String usersToString = objectMapper.writeValueAsString(users);
				fileWriter.write(usersToString);
			} catch (IOException ioe) {
				ioe.printStackTrace();
			} finally {
				if (fileWriter != null) {
					try {
						fileWriter.close();
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
		System.out.println("loadUsers() -> Putanja za cuvanje:" + filePath + "/data/_users.txt");
		System.out.println("LOADED USERS: " + users);
	}

	public void saveUsers() {
		File file = new File(filePath + "/data/_users.txt");
		System.out.println("saveUsers() -> Putanja za cuvanje:" + filePath + "/data/_users.txt");
		try {
			file.createNewFile();
		} catch (IOException e) {
			e.printStackTrace();
		}
		FileWriter fileWriter = null;
		try {
			fileWriter = new FileWriter(file);
			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.configure(SerializationFeature.INDENT_OUTPUT, false);
			objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
			// Through the configure method we can extend the default process to ignore the
			// new fields
			objectMapper.getFactory().configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, true);
			String usersToString = objectMapper.writeValueAsString(users);
			fileWriter.write(usersToString);
			fileWriter.flush();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (fileWriter != null) {
				try {
					fileWriter.close();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
	}

	public void testData() {
		User admin = new User("admin", "admin", "Adminka", "Adminovic", "F");
		User guest1 = new User("guest1", "guest1", "Zika", "Zikic", "M");
		User guest2 = new User("guest2", "guest2", "Mika", "Mikic", "M");
		User host = new User("host", "host", "Pera", "Peric", "M");

		admin.setRole(UserRole.ADMIN);
		host.setRole(UserRole.HOST);
		guest1.setRole(UserRole.GUEST);
		guest2.setRole(UserRole.GUEST);

		users.put(admin.getUsername(), admin);
		users.put(host.getUsername(), host);
		users.put(guest1.getUsername(), guest1);
		users.put(guest2.getUsername(), guest2);

	}

	@Override
	public String toString() {
		return "UserDAO [users=" + users + ", filePath=" + filePath + "]";
	}

	// Functionalities

	public Collection<User> findAll() {
		return users.values();
	}

	public User login(User user) {
		for (User u : users.values()) {
			if (u.getUsername().equals(user.getUsername())) {
				if (u.getPassword().equals(user.getPassword())) {
					return u;
				} else {
					return null;
				}
			}
		}
		return null;
	}

	public User findUsername(User user) {

		for (User u : users.values()) {
			if (u.getUsername().equals(user.getUsername())) {
				return null;
			}
		}

		return user;
	}

	public void addUser(User user) {
		users.put(user.getUsername(), user);
		saveUsers();
	}

	public User editProfile(User edit) {

		for (User u : users.values()) {
			if (u.getUsername().equals(edit.getUsername())) {
				u.setGender(edit.getGender());
				u.setName(edit.getName());
				u.setLastname(edit.getLastname());
				u.setPassword(edit.getPassword());
				saveUsers();
				return u;
			}
		}
		// users.put(user.getUsername(), user);
		return null;
	}

	public User addHost(User host) {

		for (User u : users.values()) {
			if (u.getUsername().equals(host.getUsername())) {
				return null;
			}
		}

		users.put(host.getUsername(), host);
		saveUsers();
		
		return host;
	}

	public void blockUser(String usernameBlock) {
		for (User u : users.values()) {
			if (u.getUsername().equals(usernameBlock)) {
				u.setBlocked(true);
				saveUsers();
			}
		}
	}

	public void addToMyApartments(String host, Apartment a) {
		for (User u : users.values()) {
			if (u.getUsername().equals(host)) {
				u.getMyApartments().add(a);
				saveUsers();
			}
		}
		
	}
	
	
}
