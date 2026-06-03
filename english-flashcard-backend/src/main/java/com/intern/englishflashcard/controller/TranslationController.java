package com.intern.englishflashcard.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

@RestController
@RequestMapping("/api/translate")
@CrossOrigin(origins = "*")
public class TranslationController {

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Proxy dịch văn bản qua Google Translate (client=gtx, không cần key).
     * GET /api/translate?text=hello&target=vi
     */
    @GetMapping
    public ResponseEntity<?> translate(
            @RequestParam String text,
            @RequestParam(defaultValue = "vi") String target,
            @RequestParam(defaultValue = "en") String source
    ) {
        if (text == null || text.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "text is required"));
        }

        try {
            java.net.URI uri = UriComponentsBuilder
                    .fromHttpUrl("https://translate.googleapis.com/translate_a/single")
                    .queryParam("client", "gtx")
                    .queryParam("sl", source)
                    .queryParam("tl", target)
                    .queryParam("dt", "t")
                    .queryParam("q", text)
                    .build()
                    .toUri();

            Object[] response = restTemplate.getForObject(uri, Object[].class);

            // Parse kết quả: [[["translated","original",...],...],...]
            StringBuilder translated = new StringBuilder();
            if (response != null && response[0] instanceof java.util.List<?> chunks) {
                for (Object chunk : chunks) {
                    if (chunk instanceof java.util.List<?> parts && !((java.util.List<?>) parts).isEmpty()) {
                        Object part = ((java.util.List<?>) parts).get(0);
                        if (part != null) translated.append(part);
                    }
                }
            }

            return ResponseEntity.ok(Map.of("translatedText", translated.toString()));

        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("translatedText", text)); // fallback về gốc
        }
    }
}
