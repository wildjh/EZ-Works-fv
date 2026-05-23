package com.ezworks.repository;

import com.ezworks.domain.user.PerfilAyudante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PerfilAyudanteRepository extends JpaRepository<PerfilAyudante, Long> {

    Optional<PerfilAyudante> findByUsuarioId(Long usuarioId);
}
