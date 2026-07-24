package com.doctorweb.backend.domain;

import jakarta.validation.*;
import org.junit.jupiter.api.*;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class BlogPostValidationTests {
    private static Validator validator;

    @BeforeAll
    static void createValidator() {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    @Test
    void validBlogPostHasNoViolations() {
        assertThat(validator.validate(validPost())).isEmpty();
    }

    @Test
    void titleIsRequired() {
        BlogPost post = validPost();
        post.setTitle(" ");

        assertFieldViolation(validator.validate(post), "title");
    }

    @Test
    void titleCannotExceedTwoHundredFiftyFiveCharacters() {
        BlogPost post = validPost();
        post.setTitle("a".repeat(256));

        assertFieldViolation(validator.validate(post), "title");
    }

    @Test
    void excerptCannotExceedFiveHundredCharacters() {
        BlogPost post = validPost();
        post.setExcerpt("a".repeat(501));

        assertFieldViolation(validator.validate(post), "excerpt");
    }

    @Test
    void statusOnlyAcceptsDraftOrPublished() {
        BlogPost post = validPost();
        post.setStatus("ARCHIVED");

        assertFieldViolation(validator.validate(post), "status");
    }

    @Test
    void seoDescriptionCannotExceedFiveHundredCharacters() {
        BlogPost post = validPost();
        post.setSeoDescription("a".repeat(501));

        assertFieldViolation(validator.validate(post), "seoDescription");
    }

    @Test
    void primaryKeywordCannotExceedOneHundredFiftyCharacters() {
        BlogPost post = validPost();
        post.setPrimaryKeyword("a".repeat(151));

        assertFieldViolation(validator.validate(post), "primaryKeyword");
    }

    @Test
    void tagsCannotExceedFiveHundredCharacters() {
        BlogPost post = validPost();
        post.setTags("a".repeat(501));

        assertFieldViolation(validator.validate(post), "tags");
    }

    @Test
    void coverImageAltCannotExceedTwoHundredFiftyFiveCharacters() {
        BlogPost post = validPost();
        post.setCoverImageAlt("a".repeat(256));

        assertFieldViolation(validator.validate(post), "coverImageAlt");
    }

    private BlogPost validPost() {
        return BlogPost.builder()
                .slug("bai-viet")
                .title("Bài viết hợp lệ")
                .excerpt("Mô tả")
                .content("<p>Nội dung</p>")
                .status("DRAFT")
                .coverImageAlt("Ảnh minh họa")
                .seoTitle("Tiêu đề SEO")
                .seoDescription("Mô tả SEO")
                .primaryKeyword("nhi khoa")
                .tags("trẻ em,sức khỏe")
                .build();
    }

    private <T> void assertFieldViolation(Set<ConstraintViolation<T>> violations, String field) {
        assertThat(violations)
                .extracting(violation -> violation.getPropertyPath().toString())
                .contains(field);
    }
}
