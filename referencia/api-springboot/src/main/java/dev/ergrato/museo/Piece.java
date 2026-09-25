package dev.ergrato.museo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "pieces")
public class Piece {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String artist;

    @Column(nullable = false)
    private Integer year;

    protected Piece() {
        // requerido por JPA
    }

    public Piece(String name, String artist, Integer year) {
        this.name = name;
        this.artist = artist;
        this.year = year;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getArtist() { return artist; }
    public Integer getYear() { return year; }
}
