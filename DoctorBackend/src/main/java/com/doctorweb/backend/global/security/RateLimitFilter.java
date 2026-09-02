package com.doctorweb.backend.global.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Clock;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final Map<String, Deque<Long>> requests = new ConcurrentHashMap<>();
    private final Clock clock;
    private final int loginLimit;
    private final long loginWindowMs;
    private final int bookingLimit;
    private final long bookingWindowMs;

    @Autowired
    public RateLimitFilter(
            @Value("${app.rate-limit.login.max-attempts:5}") int loginLimit,
            @Value("${app.rate-limit.login.window-seconds:300}") long loginWindowSeconds,
            @Value("${app.rate-limit.booking.max-attempts:10}") int bookingLimit,
            @Value("${app.rate-limit.booking.window-seconds:600}") long bookingWindowSeconds) {
        this(loginLimit, loginWindowSeconds, bookingLimit, bookingWindowSeconds, Clock.systemUTC());
    }

    RateLimitFilter(int loginLimit, long loginWindowSeconds, int bookingLimit,
                    long bookingWindowSeconds, Clock clock) {
        this.loginLimit = loginLimit;
        this.loginWindowMs = loginWindowSeconds * 1000;
        this.bookingLimit = bookingLimit;
        this.bookingWindowMs = bookingWindowSeconds * 1000;
        this.clock = clock;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        if (!"POST".equals(request.getMethod())) return true;
        String path = request.getRequestURI();
        return !path.equals("/api/admin/auth/login") && !path.equals("/api/public/appointments");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        boolean login = request.getRequestURI().equals("/api/admin/auth/login");
        int limit = login ? loginLimit : bookingLimit;
        long windowMs = login ? loginWindowMs : bookingWindowMs;
        String bucket = (login ? "login:" : "booking:") + request.getRemoteAddr();

        if (!allow(bucket, limit, windowMs)) {
            response.setStatus(429);
            response.setHeader("Retry-After", Long.toString(Math.max(1, windowMs / 1000)));
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write("{\"message\":\"Too many requests. Please try again later.\"}");
            return;
        }
        filterChain.doFilter(request, response);
    }

    private boolean allow(String bucket, int limit, long windowMs) {
        long now = clock.millis();
        Deque<Long> timestamps = requests.computeIfAbsent(bucket, ignored -> new ArrayDeque<>());
        synchronized (timestamps) {
            while (!timestamps.isEmpty() && timestamps.peekFirst() <= now - windowMs) {
                timestamps.removeFirst();
            }
            if (timestamps.size() >= limit) return false;
            timestamps.addLast(now);
            return true;
        }
    }
}
