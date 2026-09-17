package com.monkeysstore.api.controller;

import com.monkeysstore.api.dto.CadastroDTO;
import com.monkeysstore.api.dto.LoginDTO;
import com.monkeysstore.api.dto.VerificacaoDTO;
import com.monkeysstore.api.model.Cliente;
import com.monkeysstore.api.model.Usuario;
import com.monkeysstore.api.repository.UsuarioRepository;
import com.monkeysstore.api.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService; // Injetamos o nosso serviço de e-mail

    // --- ROTA DE LOGIN QUE JÁ FIZEMOS ---
    @PostMapping("/login")
    public ResponseEntity<?> fazerLogin(@RequestBody LoginDTO dadosLogin) {
        Optional<Usuario> usuarioOpcional = usuarioRepository.findByEmail(dadosLogin.email());
        if (usuarioOpcional.isPresent()) {
            Usuario usuarioNoBanco = usuarioOpcional.get();
            if (passwordEncoder.matches(dadosLogin.senha(), usuarioNoBanco.getSenha())) {
                // Nova trava de segurança: Não deixa logar se a conta não estiver confirmada!
                if (!usuarioNoBanco.isAtivo()) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Conta não ativada. Verifique seu e-mail.");
                }
                return ResponseEntity.ok(usuarioNoBanco);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("E-mail ou senha incorretos.");
    }

    // --- NOVA ROTA DE CADASTRO ---
    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrarCliente(@RequestBody CadastroDTO dados) {
        
        // 1. Verifica se o e-mail já existe no banco
        if (usuarioRepository.findByEmail(dados.email()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Este e-mail já está em uso.");
        }

        // 2. Cria o objeto Cliente
        Cliente novoCliente = new Cliente();
        novoCliente.setNome(dados.nome());
        novoCliente.setEmail(dados.email());
        novoCliente.setSenha(passwordEncoder.encode(dados.senha())); // Criptografa a senha!
        novoCliente.setCpf(dados.cpf());
        novoCliente.setTelefone(dados.telefone());
        novoCliente.setAtivo(false); // Nasce bloqueado

        // 3. Gera um código aleatório de 6 dígitos (ex: 482910)
        String codigoGerado = String.format("%06d", new Random().nextInt(999999));
        novoCliente.setCodigoVerificacao(codigoGerado);

        // 4. Salva no Supabase e envia o e-mail
        usuarioRepository.save(novoCliente);
        emailService.enviarCodigoConfirmacao(novoCliente.getEmail(), codigoGerado);

        return ResponseEntity.status(HttpStatus.CREATED).body("Usuário cadastrado! Verifique seu e-mail.");
    }
    
    // --- NOVA ROTA DE VERIFICAÇÃO ---
    @PostMapping("/verificar")
    public ResponseEntity<?> verificarCodigo(@RequestBody VerificacaoDTO dados) {
        
        Optional<Usuario> usuarioOpcional = usuarioRepository.findByEmail(dados.email());
        
        if (usuarioOpcional.isPresent()) {
            Usuario usuario = usuarioOpcional.get();
            
            // Se a conta já estiver ativa, avisa que não precisa fazer de novo
            if (usuario.isAtivo()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Esta conta já está ativada.");
            }
            
            // Confere se o código digitado é exatamente igual ao salvo no banco
            if (usuario.getCodigoVerificacao() != null && usuario.getCodigoVerificacao().equals(dados.codigo())) {
                
                // Mágica acontece aqui: Ativa a conta e limpa o código usado
                usuario.setAtivo(true);
                usuario.setCodigoVerificacao(null); 
                
                usuarioRepository.save(usuario);
                
                return ResponseEntity.ok("Conta ativada com sucesso! Você já pode fazer login.");
            }
        }
        
        // Se o e-mail não existir ou o código estiver errado
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Código inválido ou e-mail incorreto.");
    }
}