package com.doctorweb.backend.global.security;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.assertj.core.api.Assertions.assertThat;

class AdminOriginFilterTests {

    private final AdminOriginFilter filter = new AdminOriginFilter("https://example.com, https://www.example.com");

    @Test
    void rejectsCookieAuthenticatedMutationFromUnknownOrigin() throws Exception {
        MockHttpServletRequest request = adminPost();
        request.addHeader("Origin", "https://evil.example");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilter(request, response, new MockFilterChain());

        assertThat(response.getStatus()).isEqualTo(403);
    }

    @Test
    void allowsCookieAuthenticatedMutationFromConfiguredOrigin() throws Exception {
        MockHttpServletRequest request = adminPost();
        request.addHeader("Origin", "https://example.com");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilter(request, response, new MockFilterChain());

        assertThat(response.getStatus()).isEqualTo(200);
    }

    private MockHttpServletRequest adminPost() {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/admin/blog");
        request.setCookies(new Cookie("doctor_admin_session", "token"));
        return request;
    }
}
