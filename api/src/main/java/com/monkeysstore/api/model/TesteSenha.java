package com.monkeysstore.api.model;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TesteSenha {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        // Substitua pela senha que você deseja usar
        System.out.println(encoder.encode("thestreet")); 
    }
}
