package com.ezworks.repository;

import com.ezworks.domain.user.PerfilEmpleador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PerfilEmpleadorRepository extends JpaRepository<PerfilEmpleador, Long> {

    Optional<PerfilEmpleador> findByUsuarioId(Long usuarioId);
}
