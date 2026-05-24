package com.ezworks.service;

import com.ezworks.domain.job.Emparejamiento;
import com.ezworks.domain.messaging.Conversacion;
import com.ezworks.domain.messaging.Mensaje;
import com.ezworks.domain.user.Usuario;
import com.ezworks.dto.messaging.ConversacionResponse;
import com.ezworks.dto.messaging.MensajeRequest;
import com.ezworks.dto.messaging.MensajeResponse;
import com.ezworks.exception.ApiException;
import com.ezworks.repository.ConversacionRepository;
import com.ezworks.repository.EmparejamientoRepository;
import com.ezworks.repository.MensajeRepository;
import com.ezworks.repository.PerfilAyudanteRepository;
import com.ezworks.repository.PerfilEmpleadorRepository;
import com.ezworks.repository.UsuarioRepository;
import com.ezworks.security.UserPrincipal;
import com.ezworks.util.Mapper;
import com.ezworks.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ConversacionService {

    private final ConversacionRepository conversacionRepository;
    private final EmparejamientoRepository emparejamientoRepository;
    private final MensajeRepository mensajeRepository;
    private final UsuarioRepository usuarioRepository;
    private final PerfilEmpleadorRepository perfilEmpleadorRepository;
    private final PerfilAyudanteRepository perfilAyudanteRepository;

    @Transactional(readOnly = true)
    public ConversacionResponse obtenerPorEmparejamiento(Long emparejamientoId) {
        validarParticipante(emparejamientoId);
        Conversacion c = conversacionRepository.findByEmparejamientoId(emparejamientoId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Conversación no encontrada"));
        var mensajes = mensajeRepository.findByConversacionIdOrderByEnviadoEnAsc(c.getId());
        return Mapper.toConversacion(c, mensajes);
    }

    @Transactional(readOnly = true)
    public ConversacionResponse obtener(Long conversacionId) {
        Conversacion c = conversacionRepository.findById(conversacionId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Conversación no encontrada"));
        validarParticipante(c.getEmparejamiento().getId());
        var mensajes = mensajeRepository.findByConversacionIdOrderByEnviadoEnAsc(c.getId());
        return Mapper.toConversacion(c, mensajes);
    }

    @Transactional
    public MensajeResponse enviarMensaje(Long conversacionId, MensajeRequest req) {
        UserPrincipal principal = SecurityUtils.currentUser();
        Conversacion c = conversacionRepository.findById(conversacionId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Conversación no encontrada"));
        validarParticipante(c.getEmparejamiento().getId());

        Usuario emisor = usuarioRepository.findById(principal.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        Mensaje m = mensajeRepository.save(Mensaje.builder()
                .conversacion(c)
                .emisor(emisor)
                .contenido(req.getContenido().trim())
                .build());

        return Mapper.toMensaje(m);
    }

    private void validarParticipante(Long emparejamientoId) {
        UserPrincipal principal = SecurityUtils.currentUser();
        Emparejamiento e = emparejamientoRepository.findById(emparejamientoId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Emparejamiento no encontrado"));

        boolean participa = perfilEmpleadorRepository.findByUsuarioId(principal.getId())
                .map(pe -> pe.getId().equals(e.getEmpleador().getId()))
                .orElse(false);

        if (!participa) {
            participa = perfilAyudanteRepository.findByUsuarioId(principal.getId())
                    .map(pa -> pa.getId().equals(e.getAyudante().getId()))
                    .orElse(false);
        }

        if (!participa) {
            throw new ApiException(HttpStatus.FORBIDDEN, "No participa en este emparejamiento");
        }
    }
}
