package com.doctorweb.backend.global.security;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import static org.assertj.core.api.Assertions.assertThat;

class RateLimitFilterTests {

    @Test
    void rejectsLoginAfterConfiguredAttemptLimit() throws Exception {
        RateLimitFilter filter = new RateLimitFilter(
                2, 300, 10, 600,
                Clock.fixed(Instant.parse("2026-01-01T00:00:00Z"), ZoneOffset.UTC)
        );

        assertThat(callLogin(filter).getStatus()).isEqualTo(200);
        assertThat(callLogin(filter).getStatus()).isEqualTo(200);

        MockHttpServletResponse rejected = callLogin(filter);
        assertThat(rejected.getStatus()).isEqualTo(429);
        assertThat(rejected.getHeader("Retry-After")).isEqualTo("300");
    }

    private MockHttpServletResponse callLogin(RateLimitFilter filter) throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/admin/auth/login");
        request.setRemoteAddr("203.0.113.10");
        MockHttpServletResponse response = new MockHttpServletResponse();
        filter.doFilter(request, response, new MockFilterChain());
        return response;
    }
}
