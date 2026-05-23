package com.ezworks.controller;

import com.ezworks.dto.messaging.ConversacionResponse;
import com.ezworks.dto.messaging.MensajeRequest;
import com.ezworks.dto.messaging.MensajeResponse;
import com.ezworks.service.ConversacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/conversaciones")
@RequiredArgsConstructor
public class ConversacionController {

    private final ConversacionService conversacionService;

    @GetMapping("/emparejamiento/{emparejamientoId}")
    public ConversacionResponse porEmparejamiento(@PathVariable Long emparejamientoId) {
        return conversacionService.obtenerPorEmparejamiento(emparejamientoId);
    }

    @GetMapping("/{id}")
    public ConversacionResponse obtener(@PathVariable Long id) {
        return conversacionService.obtener(id);
    }

    @PostMapping("/{id}/mensajes")
    @ResponseStatus(HttpStatus.CREATED)
    public MensajeResponse enviar(@PathVariable Long id, @Valid @RequestBody MensajeRequest request) {
        return conversacionService.enviarMensaje(id, request);
    }
}
