package com.doctorweb.backend.controller;

import com.doctorweb.backend.dto.StatisticsDtos.Dashboard;
import com.doctorweb.backend.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/statistics")
@RequiredArgsConstructor
public class AdminStatisticsController {
    private final StatisticsService statisticsService;

    @GetMapping
    public Dashboard dashboard(
            @RequestParam(required = false) LocalDate from,
            @RequestParam(required = false) LocalDate to) {
        return statisticsService.dashboard(from, to);
    }
}
