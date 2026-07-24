package com.doctorweb.backend.domain;

import com.doctorweb.backend.global.audit.AuditableEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "blog_post")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlogPost extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(max = 255, message = "Tiêu đề không được vượt quá 255 ký tự")
    private String title;

    @Column(length = 500)
    @Size(max = 500, message = "Đoạn mô tả không được vượt quá 500 ký tự")
    private String excerpt;

    @Column(columnDefinition = "LONGTEXT")
    private String content;

    private String category;

    @Column(name = "cover_image", length = 500)
    private String coverImage;

    @Column(name = "cover_image_alt")
    @Size(max = 255)
    private String coverImageAlt;

    @Column(name = "cover_position_x", nullable = false)
    @Builder.Default
    private Integer coverPositionX = 50;

    @Column(name = "cover_position_y", nullable = false)
    @Builder.Default
    private Integer coverPositionY = 50;

    @Column(nullable = false)
    @Pattern(regexp = "DRAFT|PUBLISHED", message = "Trạng thái bài viết không hợp lệ")
    @Builder.Default
    private String status = "DRAFT"; // DRAFT, PUBLISHED

    @Column(name = "reading_time")
    @Builder.Default
    private Integer readingTime = 0;

    @Builder.Default
    private Boolean featured = false;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;
    
    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "seo_title")
    @Size(max = 255, message = "Tiêu đề SEO không được vượt quá 255 ký tự")
    private String seoTitle;

    @Column(name = "seo_description", length = 500)
    @Size(max = 500, message = "Mô tả SEO không được vượt quá 500 ký tự")
    private String seoDescription;

    @Column(name = "primary_keyword", length = 150)
    @Size(max = 150)
    private String primaryKeyword;

    @Column(length = 500)
    @Size(max = 500, message = "Danh sách thẻ không được vượt quá 500 ký tự")
    private String tags;

    @Column(name = "view_count")
    @Builder.Default
    private Long viewCount = 0L;
}
