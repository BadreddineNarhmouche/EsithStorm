package com.esithstorm.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.HashMap;
import java.util.Map;

/**
 * Service : statistiques pour le tableau de bord.
 */
@ApplicationScoped
public class StatsService {

    @Inject
    private EntrepriseService entrepriseService;
    @Inject
    private FournisseurService fournisseurService;
    @Inject
    private AtelierService atelierService;
    @Inject
    private TechnicienService technicienService;
    @Inject
    private ChercheurService chercheurService;

    public Map<String, Long> getDashboardStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("entreprises", entrepriseService.count());
        stats.put("fournisseurs", fournisseurService.count());
        stats.put("ateliers", atelierService.count());
        stats.put("techniciens", technicienService.count());
        stats.put("chercheurs", chercheurService.count());
        stats.put("total", entrepriseService.count() + fournisseurService.count()
            + atelierService.count() + technicienService.count() + chercheurService.count());
        return stats;
    }
}
