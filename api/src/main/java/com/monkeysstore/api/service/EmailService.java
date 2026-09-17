package com.monkeysstore.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender carteiro; // Ferramenta do Spring que envia o e-mail

    public void enviarCodigoConfirmacao(String emailDestino, String codigo) {
        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setTo(emailDestino);
        mensagem.setSubject("Monkeys Store - Código de Confirmação");
        mensagem.setText("Olá! Bem-vindo à Monkeys Store.\n\n" +
                         "Seu código de confirmação é: " + codigo + "\n\n" +
                         "Use este código na tela de cadastro para ativar sua conta.");
        
        carteiro.send(mensagem);
    }
}