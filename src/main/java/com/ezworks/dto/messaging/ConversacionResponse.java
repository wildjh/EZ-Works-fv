package com.ezworks.dto.messaging;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class ConversacionResponse {

    private Long id;
    private Long emparejamientoId;
    private Instant abiertaEn;
    private List<MensajeResponse> mensajes;
}
