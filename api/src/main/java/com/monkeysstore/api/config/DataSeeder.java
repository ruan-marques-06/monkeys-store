package com.monkeysstore.api.config;

import com.monkeysstore.api.model.Vendedor;
import com.monkeysstore.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Verifica se o usuário de teste já existe para não criar duplicado
        if (usuarioRepository.findByEmail("admin@monkeys.com").isEmpty()) {
            
            Vendedor admin = new Vendedor();
            admin.setNome("Administrador Maker");
            admin.setEmail("admin@monkeys.com");
            
            // Aqui a mágica acontece: a senha "123456" vira um código gigante e seguro no banco
            admin.setSenha(passwordEncoder.encode("123456")); 
            admin.setNivelAcesso("TOTAL");
            admin.setAtivo(true);
            usuarioRepository.save(admin);
            System.out.println("✅ Usuário de teste criado com sucesso no Supabase!");
        }
    }
}