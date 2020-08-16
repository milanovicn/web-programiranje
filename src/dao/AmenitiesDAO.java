package dao;

import java.io.BufferedReader;
import java.io.Console;
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

import beans.Amenities;

public class AmenitiesDAO {
	
	private HashMap<String, Amenities> amenities = new HashMap<>();
	private String filePath;
	
	
	public AmenitiesDAO() {
		
	}
	
	public AmenitiesDAO (String contextPath) {
		setFilePath(contextPath);
		setAmenities(new HashMap<String, Amenities>());
		// testData();
		loadAmenities(contextPath);

	}
	
	
	//getters,setters
	public HashMap<String, Amenities> getAmenities() {
		return amenities;
	}
	public void setAmenities(HashMap<String, Amenities> amenities) {
		this.amenities = amenities;
	}
	public String getFilePath() {
		return filePath;
	}
	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}
	
	 
	 
	 // Methods for files and data

	@SuppressWarnings("unchecked")
	public void loadAmenities(String contextPath) {
		File file = null;
		FileWriter fileWriter = null;
		BufferedReader in = null;

		try {
			file = new File(contextPath + "/data/_amenities.txt");
			in = new BufferedReader(new FileReader(file));

			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.setVisibilityChecker(
					VisibilityChecker.Std.defaultInstance().withFieldVisibility(JsonAutoDetect.Visibility.ANY));

			TypeFactory factory = TypeFactory.defaultInstance();
			MapType type = factory.constructMapType(HashMap.class, String.class, Amenities.class);
			objectMapper.getFactory().configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, true);
			amenities = (HashMap<String, Amenities>) objectMapper.readValue(file, type);
		} catch (FileNotFoundException fnf) {
			try {
				file.createNewFile();
				fileWriter = new FileWriter(file);
				ObjectMapper objectMapper = new ObjectMapper();
				objectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
				objectMapper.getFactory().configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, true);
				String amenitiesToString = objectMapper.writeValueAsString(amenities);
				fileWriter.write(amenitiesToString);
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
		System.out.println("loadUsers() -> Putanja za cuvanje:" + filePath + "/data/_amenities.txt");
		System.out.println("LOADED USERS: " + amenities);
	}

	public void saveAmenities() {
		File file = new File(filePath + "/data/_amenities.txt");
		System.out.println("saveUsers() -> Putanja za cuvanje:" + filePath + "/data/_amenities.txt");
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
			String usersToString = objectMapper.writeValueAsString(amenities);
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

	
	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return "AmenitiesDAO [amenities=" + amenities + ", filePath=" + filePath + "]";
	}
	 
	
	// Functionalities

		public Collection<Amenities> findAll() {
			return amenities.values();
		}
	 
		
		public Amenities findAmenites(Amenities amenity) {

			for (Amenities a : amenities.values()) {
				if (a.getName().equals(amenity.getName())) {
					return a;
				}
			}

			return amenity;
		}
		
		
		
		public Amenities addAmenities (Amenities amenity) {

			for (Amenities a : amenities.values()) {
				if (a.getName().equals(amenity.getName())) {
					return null;
				}
			}
			
			amenity.setId(amenities.size()+1);
			amenities.put(amenity.getName(), amenity);
			saveAmenities();
			
			return amenity;
		}
		
		/*//sa promenom obrisanog
		public Amenities addAmenities (Amenities amenity) {

			for (Amenities a : amenities.values()) {
				
				if (a.getName().equals(amenity.getName())) {
					//da li imam obrisanog sa tim imenom u listi
					if (a.isDeleted()) {
						a.setDeleted(false);
						saveAmenities();
						return a;
					}
					
					return null;
				}
				
			}
			
			amenity.setId(amenities.size()+1);
			amenities.put(amenity.getName(), amenity);
			saveAmenities();
			
			return amenity;
		}
		*/
		
	
		public Amenities deleteAmenities (String amenityDelete) {
			for (Amenities a : amenities.values()) {
				if (a.getName().equals(amenityDelete)) {
					a.setDeleted(true);
					saveAmenities();
					return a;
				}
			}
			return null;
		}
		
		
		public Amenities changeAmenityName (String oldName, String newName) {
			
			for (Amenities a : amenities.values()) {
				if (a.getName().equals(newName)) {
					return null;
				}		
			}
			
			for (Amenities a : amenities.values()) {
				if (a.getName().equals(oldName)) {
					a.setName(newName);
					saveAmenities();
					return a;	
				}
			}
			return null;
		}

		
		
		public Amenities findById(Long id) {

			for (Amenities a : amenities.values()) {
				if (a.getId() == id) {
					return a;
				}
			}

			return null;
		}
		
	
		
}
