package com.esithstorm;

import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;

/**
 * Point d'entrée JAX-RS : toutes les API sont sous /api
 */
@ApplicationPath("api")
public class EsithStormApplication extends Application {
}
