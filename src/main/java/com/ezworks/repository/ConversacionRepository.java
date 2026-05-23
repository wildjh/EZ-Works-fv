package com.ezworks.repository;

import com.ezworks.domain.messaging.Conversacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConversacionRepository extends JpaRepository<Conversacion, Long> {

    Optional<Conversacion> findByEmparejamientoId(Long emparejamientoId);
}
