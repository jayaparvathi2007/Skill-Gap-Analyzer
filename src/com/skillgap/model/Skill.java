package com.skillgap.model;

public class Skill {
    private int id;
    private String name;
    private String category;
    private String difficulty;
    private String description;

    public Skill() {}

    public Skill(int id, String name, String category, String difficulty, String description) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.difficulty = difficulty;
        this.description = description;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
