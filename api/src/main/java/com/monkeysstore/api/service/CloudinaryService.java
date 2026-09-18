package com.monkeysstore.api.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret) {
        
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret));
    }

    public String uploadImagem(MultipartFile arquivo) throws IOException {
        // Envia o arquivo para a nuvem e pega a resposta
        Map uploadResult = cloudinary.uploader().upload(arquivo.getBytes(), ObjectUtils.emptyMap());
        
        // Retorna apenas a URL pública da foto gerada pela nuvem
        return uploadResult.get("url").toString();
    }
}