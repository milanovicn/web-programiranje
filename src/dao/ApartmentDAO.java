package dao;

import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collection;
import java.util.HashMap;

import javax.imageio.ImageIO;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.introspect.VisibilityChecker;
import com.fasterxml.jackson.databind.type.MapType;
import com.fasterxml.jackson.databind.type.TypeFactory;

import Decoder.BASE64Decoder;
import beans.Amenities;
import beans.Apartment;
import beans.Comment;
import beans.Location;
import beans.Reservation;
import beans.User;
import beans.enums.ApartmentStatus;
import beans.enums.UserRole;
import utils.TimeInterval;

public class ApartmentDAO {
	private HashMap<Long, Apartment> apartments = new HashMap<>();
	private String filePath;

	public ApartmentDAO(String contextPath) {
		setFilePath(contextPath);
		setApartments(new HashMap<Long, Apartment>());
		// testData();
		loadApartments(contextPath);
	}

	public ApartmentDAO() {

	}

	// Getters and setters
	public HashMap<Long, Apartment> getApartments() {
		return apartments;
	}

	public void setApartments(HashMap<Long, Apartment> apartments) {
		this.apartments = apartments;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	// Methods for files and data

	@SuppressWarnings("unchecked")
	public void loadApartments(String contextPath) {
		File file = null;
		FileWriter fileWriter = null;
		BufferedReader in = null;

		try {
			file = new File(contextPath + "/data/_apartments.txt");
			in = new BufferedReader(new FileReader(file));

			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.setVisibilityChecker(
					VisibilityChecker.Std.defaultInstance().withFieldVisibility(JsonAutoDetect.Visibility.ANY));

			TypeFactory factory = TypeFactory.defaultInstance();
			MapType type = factory.constructMapType(HashMap.class, String.class, Apartment.class);
			DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
			objectMapper.setDateFormat(df);
			objectMapper.getFactory().configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, true);
			apartments = (HashMap<Long, Apartment>) objectMapper.readValue(file, type);
		} catch (FileNotFoundException fnf) {
			try {
				file.createNewFile();
				fileWriter = new FileWriter(file);
				ObjectMapper objectMapper = new ObjectMapper();
				DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
				objectMapper.setDateFormat(df);
				objectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
				objectMapper.getFactory().configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, true);
				String usersToString = objectMapper.writeValueAsString(apartments);
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
		System.out.println("loadApartments() -> Putanja za cuvanje:" + filePath + "/data/_apartments.txt");
		System.out.println("LOADED APARTMENTS: " + apartments);
	}

	public void saveApartments() {
		File file = new File(filePath + "/data/_apartments.txt");
		System.out.println("saveApartments() -> Putanja za cuvanje:" + filePath + "/data/_apartments.txt");

		try {
			file.createNewFile();
		} catch (IOException e) {
			e.printStackTrace();
		}
		FileWriter fileWriter = null;
		try {
			fileWriter = new FileWriter(file);
			ObjectMapper objectMapper = new ObjectMapper();
			DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
			objectMapper.setDateFormat(df);
			objectMapper.configure(SerializationFeature.INDENT_OUTPUT, false);
			objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
			// Through the configure method we can extend the default process to ignore the
			// new fields
			objectMapper.getFactory().configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, true);
			String usersToString = objectMapper.writeValueAsString(apartments);
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
		System.out.println("SAVED APARTMENTS: " + apartments);
	}

	// methods
	public Collection<Apartment> findAll() {
		return apartments.values();
	}

	public Apartment addApartment(Apartment a) {
		a.setId(apartments.size() + 1);
		a.setStatus(ApartmentStatus.ACTIVE);
		a.setReservations(new ArrayList<Reservation>());
		a.setComments(new ArrayList<Comment>());
		// slika
		ArrayList<String> newImages = new ArrayList<String>();

		for (int i = 0; i < a.getImages().size(); i++) {
			System.out.println("Image[" + i + "] = " + a.getImages().get(i));
			if (a.getImages().get(i) != null) {
				save("ID-" + a.getId() + "-" + a.getHost() + "-" + i, "png", a.getImages().get(i));
				// o.setImage("/ProjekatRA1812016/images/" + o.getName() + "-" +
				// o.getUsernameProdavca() + "." + "png");
				newImages.add(filePath + "imgs\\" + "ID-" + a.getId() + "-" + a.getHost() + "-" + i + "." + "png");
			}
		}
		a.setImages(newImages);

		String[] locationInfo = a.getLocationString().split(",");
		a.setLocation(new Location(locationInfo[0], locationInfo[1], locationInfo[2], locationInfo[3], locationInfo[4],
				locationInfo[5]));

		apartments.put(a.getId(), a);
		saveApartments();

		return a;

	}
	
	public Apartment deleteApartment (long apartmentId) {
		
		Apartment a = findById(apartmentId);
		
		if(a != null) {
			a.setDeleted(true);
			saveApartments();
			return a;
		}
		
		return null;
	}
	
	public Apartment changeApartmentStatus (long apartmentId ) {
		
		Apartment a = findById(apartmentId);
		
		if(a != null) {
			
			if (a.getStatus().equals(ApartmentStatus.ACTIVE)) {
				a.setStatus(ApartmentStatus.INACTIVE);
				saveApartments();
				return a;
			}
			else {
				a.setStatus(ApartmentStatus.ACTIVE);
				saveApartments();
				return a;
			}
		}
		
		return null;
		
	}

	private void save(String fileName, String ext, String imageToBeBuffered) {

		String putanja = getFilePath();
		File file = new File(putanja + "imgs\\" + fileName + "." + ext);
		BufferedImage image = decodeToImage(imageToBeBuffered);
		try {
			ImageIO.write(image, ext, file); // ignore returned boolean
		} catch (IOException e) {
			System.out.println("Write error for " + file.getPath() + ": " + e.getMessage());
		}
	}

	public static BufferedImage decodeToImage(String imageString) {
		BufferedImage image = null;
		byte[] imageByte;
		try {
			// BASE64Decoder decoder = new BASE64Decoder();
			imageByte = Base64.getDecoder().decode(imageString);
			// imageByte = decoder.decodeBuffer(imageString);
			ByteArrayInputStream bis = new ByteArrayInputStream(imageByte);
			image = ImageIO.read(bis);
			bis.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return image;
	}

	public Apartment findById(Long apartmentId) {
		for (Apartment a : apartments.values()) {
			if (a.getId() == apartmentId) {
				return a;
			}
		}

		return null;
	}

	public void addReservation(Reservation res, TimeInterval resInterval) {
		for (Apartment a : apartments.values()) {
			if (a.getId() == res.getApartmentId()) {
				a.setFreeDates(resInterval.updateFreeDates(resInterval, a.getFreeDates()));
				a.getReservations().add(res);
				a.getReservedDates().add(resInterval);
				saveApartments();
			}
		}
	}

	public ArrayList<Long> findApartmentsByHost(String username) {
		ArrayList<Long> ret = new ArrayList<Long>();
		for (Apartment a : apartments.values()) {
			if (a.getHost().equals(username)) {
				ret.add(a.getId());
			}
		}

		return ret;
	}

	public void addComment(Apartment apt, Comment comment) {
		apt.getComments().add(comment);
		saveApartments();

	}

	public Comment changeCommentStatus(Apartment apt, int commentRate, String commentText) {
		ArrayList<Comment> comments = apt.getComments();
		for (Comment c : comments) {
			if (c.getContent().equals(commentText) && c.getRate() == commentRate) {
				if (c.isApproved()) {
					c.setApproved(false);
				} else {
					c.setApproved(true);
				}

				saveApartments();
				return c;
			}
		}

		saveApartments();
		return null;
	}

}
