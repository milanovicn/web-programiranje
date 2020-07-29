package beans;

public class Amenities {

	private long id;
	private String name;
	private boolean deleted = false;
	
	
	public Amenities() {
		super();
	}

	public Amenities(long id, String name) {
		super();
		this.id = id;
		this.name = name;
		this.deleted = false;
	}
	
	
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	
	public boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}

	@Override
	public String toString() {
		return "Amenities [id=" + id + ", name=" + name + "]";
	}
	
	
	
}
