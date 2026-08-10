package com.doctorweb.backend.dto;

import org.springframework.data.domain.Page;

import java.util.List;

/**
 * Stable pagination contract exposed by the REST API.
 *
 * <p>Controllers must not serialize Spring Data's {@link Page} directly because
 * its JSON shape is an implementation detail and can change between versions.</p>
 */
public record PageResponse<T>(
        List<T> content,
        int number,
        int size,
        long totalElements,
        int totalPages,
        int numberOfElements,
        boolean first,
        boolean last,
        boolean empty
) {
    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(
                List.copyOf(page.getContent()),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.getNumberOfElements(),
                page.isFirst(),
                page.isLast(),
                page.isEmpty()
        );
    }
}
