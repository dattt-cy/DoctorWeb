package com.doctorweb.backend.dto;

import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class PageResponseTests {

    @Test
    void preservesThePublicPaginationContract() {
        var page = new PageImpl<>(
                List.of("first", "second"),
                PageRequest.of(1, 2),
                5
        );

        var response = PageResponse.from(page);

        assertThat(response.content()).containsExactly("first", "second");
        assertThat(response.number()).isEqualTo(1);
        assertThat(response.size()).isEqualTo(2);
        assertThat(response.totalElements()).isEqualTo(5);
        assertThat(response.totalPages()).isEqualTo(3);
        assertThat(response.numberOfElements()).isEqualTo(2);
        assertThat(response.first()).isFalse();
        assertThat(response.last()).isFalse();
        assertThat(response.empty()).isFalse();
    }
}
