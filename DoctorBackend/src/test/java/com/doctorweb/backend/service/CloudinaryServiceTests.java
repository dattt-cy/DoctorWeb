package com.doctorweb.backend.service;

import com.cloudinary.Cloudinary;
import com.doctorweb.backend.global.exception.BusinessException;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;

class CloudinaryServiceTests {

    private final CloudinaryService service = new CloudinaryService(mock(Cloudinary.class));

    @Test
    void rejectsNonImageContentType() {
        MockMultipartFile file = new MockMultipartFile("file", "payload.txt", "text/plain", "hello".getBytes());

        assertThatThrownBy(() -> service.uploadImage(file))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("JPEG, PNG and WebP");
    }

    @Test
    void rejectsFakeImageWithInvalidSignature() {
        MockMultipartFile file = new MockMultipartFile("file", "fake.jpg", "image/jpeg", "not-an-image".getBytes());

        assertThatThrownBy(() -> service.uploadImage(file))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Invalid image content");
    }
}
