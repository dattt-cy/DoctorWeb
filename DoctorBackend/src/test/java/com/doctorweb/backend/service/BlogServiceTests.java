package com.doctorweb.backend.service;

import com.doctorweb.backend.domain.*;
import com.doctorweb.backend.global.exception.ResourceNotFoundException;
import com.doctorweb.backend.repository.*;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BlogServiceTests {
    @Mock BlogPostRepository blogPostRepository;
    @Mock BlogPostRevisionRepository revisionRepository;

    @InjectMocks BlogService service;

    @Test
    void createDraftGeneratesSlugSanitizesHtmlAndCalculatesReadingTime() {
        BlogPost input = post(null, "Chăm sóc trẻ em", "DRAFT",
                "<p>Nội dung an toàn</p><script>alert('xss')</script>");
        when(blogPostRepository.findBySlug("cham-soc-tre-em")).thenReturn(Optional.empty());
        when(blogPostRepository.save(any(BlogPost.class))).thenAnswer(invocation -> {
            BlogPost saved = invocation.getArgument(0);
            saved.setId(1L);
            return saved;
        });

        BlogPost created = service.createPost(input);

        assertThat(created.getSlug()).isEqualTo("cham-soc-tre-em");
        assertThat(created.getStatus()).isEqualTo("DRAFT");
        assertThat(created.getContent()).contains("<p>Nội dung an toàn</p>");
        assertThat(created.getContent()).doesNotContain("<script", "alert");
        assertThat(created.getReadingTime()).isEqualTo(1);
        assertThat(created.getFeatured()).isFalse();
        assertThat(created.getViewCount()).isZero();
        assertThat(created.getPublishedAt()).isNull();
    }

    @Test
    void createRepairsMojibakeBeforeSaving() {
        BlogPost input = post(null, "ChÄƒm sĂ³c tráº» em", "DRAFT",
                "<p>Ná»™i dung tiáº¿ng Viá»‡t</p>");
        when(blogPostRepository.findBySlug("cham-soc-tre-em")).thenReturn(Optional.empty());
        when(blogPostRepository.save(any(BlogPost.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BlogPost created = service.createPost(input);

        assertThat(created.getTitle()).isEqualTo("Chăm sóc trẻ em");
        assertThat(created.getContent()).contains("Nội dung tiếng Việt");
        assertThat(created.getSlug()).isEqualTo("cham-soc-tre-em");
    }

    @Test
    void readingExistingPostRepairsAndPersistsMojibake() {
        BlogPost corrupted = post(1L, "BĂ i viáº¿t", "PUBLISHED",
                "<p>Dáº¥u hiá»‡u cáº§n khĂ¡m</p>");
        corrupted.setSlug("bai-viet");
        when(blogPostRepository.findBySlugAndStatus("bai-viet", "PUBLISHED"))
                .thenReturn(Optional.of(corrupted));
        when(blogPostRepository.save(any(BlogPost.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BlogPost repaired = service.getPublishedPostBySlug("bai-viet");

        assertThat(repaired.getTitle()).isEqualTo("Bài viết");
        assertThat(repaired.getContent()).contains("Dấu hiệu cần khám");
        verify(blogPostRepository).save(corrupted);
    }

    @Test
    void createPublishedPostSetsPublishedTime() {
        BlogPost input = post(null, "Bài đã xuất bản", "PUBLISHED", "<p>Nội dung</p>");
        when(blogPostRepository.findBySlug(anyString())).thenReturn(Optional.empty());
        when(blogPostRepository.save(any(BlogPost.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BlogPost created = service.createPost(input);

        assertThat(created.getStatus()).isEqualTo("PUBLISHED");
        assertThat(created.getPublishedAt()).isNotNull();
        assertThat(created.getPublishedAt()).isBeforeOrEqualTo(LocalDateTime.now());
    }

    @Test
    void unknownStatusIsNormalizedToDraft() {
        BlogPost input = post(null, "Bài mới", "INVALID", "<p>Nội dung</p>");
        when(blogPostRepository.findBySlug(anyString())).thenReturn(Optional.empty());
        when(blogPostRepository.save(any(BlogPost.class))).thenAnswer(invocation -> invocation.getArgument(0));

        assertThat(service.createPost(input).getStatus()).isEqualTo("DRAFT");
    }

    @Test
    void duplicateSlugGetsNumericSuffix() {
        BlogPost input = post(null, "Chăm sóc trẻ em", "DRAFT", "<p>Nội dung</p>");
        when(blogPostRepository.findBySlug("cham-soc-tre-em"))
                .thenReturn(Optional.of(post(9L, "Bài cũ", "DRAFT", "")));
        when(blogPostRepository.findBySlug("cham-soc-tre-em-1")).thenReturn(Optional.empty());
        when(blogPostRepository.save(any(BlogPost.class))).thenAnswer(invocation -> invocation.getArgument(0));

        assertThat(service.createPost(input).getSlug()).isEqualTo("cham-soc-tre-em-1");
    }

    @Test
    void emptyTitleFallsBackToGeneratedSlug() {
        BlogPost input = post(null, " ", "DRAFT", "");
        when(blogPostRepository.save(any(BlogPost.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BlogPost created = service.createPost(input);

        assertThat(created.getSlug()).isNotBlank();
        assertThat(created.getSlug()).hasSize(8);
    }

    @Test
    void longContentCalculatesMoreThanOneMinute() {
        String content = "<p>" + String.join(" ", Collections.nCopies(221, "từ")) + "</p>";
        BlogPost input = post(null, "Bài dài", "DRAFT", content);
        when(blogPostRepository.findBySlug(anyString())).thenReturn(Optional.empty());
        when(blogPostRepository.save(any(BlogPost.class))).thenAnswer(invocation -> invocation.getArgument(0));

        assertThat(service.createPost(input).getReadingTime()).isEqualTo(2);
    }

    @Test
    void updateCreatesRevisionKeepsSlugAndUpdatesEditableFields() {
        BlogPost existing = post(1L, "Tiêu đề cũ", "DRAFT", "<p>Cũ</p>");
        existing.setSlug("url-on-dinh");
        existing.setExcerpt("Mô tả cũ");
        BlogPost update = post(null, "Tiêu đề mới", "PUBLISHED",
                "<p>Nội dung mới</p><script>bad()</script>");
        update.setExcerpt("Mô tả mới");
        update.setCategory("Nhi khoa");
        update.setCoverImage("https://example.com/new.jpg");
        update.setCoverImageAlt("Ảnh mới");
        update.setCoverPositionX(null);
        update.setCoverPositionY(null);
        update.setFeatured(true);
        update.setSeoTitle("SEO mới");
        update.setSeoDescription("Mô tả SEO");
        update.setPrimaryKeyword("nhi khoa");
        update.setTags("trẻ em");
        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(blogPostRepository.save(any(BlogPost.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(revisionRepository.save(any(BlogPostRevision.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BlogPost result = service.updatePost(1L, update);

        assertThat(result.getTitle()).isEqualTo("Tiêu đề mới");
        assertThat(result.getSlug()).isEqualTo("url-on-dinh");
        assertThat(result.getExcerpt()).isEqualTo("Mô tả mới");
        assertThat(result.getContent()).doesNotContain("script", "bad()");
        assertThat(result.getCategory()).isEqualTo("Nhi khoa");
        assertThat(result.getCoverPositionX()).isEqualTo(50);
        assertThat(result.getCoverPositionY()).isEqualTo(50);
        assertThat(result.getStatus()).isEqualTo("PUBLISHED");
        assertThat(result.getPublishedAt()).isNotNull();
        assertThat(result.getSeoTitle()).isEqualTo("SEO mới");
        assertThat(result.getPrimaryKeyword()).isEqualTo("nhi khoa");

        ArgumentCaptor<BlogPostRevision> revision = ArgumentCaptor.forClass(BlogPostRevision.class);
        verify(revisionRepository).save(revision.capture());
        assertThat(revision.getValue().getPostId()).isEqualTo(1L);
        assertThat(revision.getValue().getTitle()).isEqualTo("Tiêu đề cũ");
        assertThat(revision.getValue().getContent()).isEqualTo("<p>Cũ</p>");
    }

    @Test
    void autosaveDoesNotCreateRevision() {
        BlogPost existing = post(1L, "Bản nháp", "DRAFT", "<p>Cũ</p>");
        existing.setSlug("ban-nhap");
        BlogPost update = post(null, "Bản nháp mới", "DRAFT", "<p>Mới</p>");
        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(blogPostRepository.save(any(BlogPost.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BlogPost result = service.autosavePost(1L, update);

        assertThat(result.getTitle()).isEqualTo("Bản nháp mới");
        verifyNoInteractions(revisionRepository);
    }

    @Test
    void getRevisionsChecksPostAndReturnsLatestTwenty() {
        BlogPost existing = post(1L, "Bài viết", "DRAFT", "");
        List<BlogPostRevision> revisions = List.of(
                BlogPostRevision.builder().id(2L).postId(1L).title("v2").createdAt(LocalDateTime.now()).build(),
                BlogPostRevision.builder().id(1L).postId(1L).title("v1").createdAt(LocalDateTime.now()).build()
        );
        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(revisionRepository.findTop20ByPostIdOrderByCreatedAtDesc(1L)).thenReturn(revisions);

        assertThat(service.getRevisions(1L)).containsExactlyElementsOf(revisions);
    }

    @Test
    void restoreRevisionCopiesHistoricalContentAndCreatesBackup() {
        BlogPost existing = post(1L, "Hiện tại", "PUBLISHED", "<p>Hiện tại</p>");
        existing.setSlug("url-on-dinh");
        BlogPostRevision revision = BlogPostRevision.builder()
                .id(7L).postId(1L).title("Phiên bản cũ")
                .excerpt("Mô tả cũ").content("<p>Nội dung cũ</p>")
                .category("Cũ").coverImage("old.jpg")
                .seoTitle("SEO cũ").seoDescription("Mô tả SEO cũ")
                .tags("cũ").createdAt(LocalDateTime.now().minusDays(1)).build();
        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(revisionRepository.findById(7L)).thenReturn(Optional.of(revision));
        when(revisionRepository.save(any(BlogPostRevision.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(blogPostRepository.save(any(BlogPost.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BlogPost restored = service.restoreRevision(1L, 7L);

        assertThat(restored.getTitle()).isEqualTo("Phiên bản cũ");
        assertThat(restored.getContent()).isEqualTo("<p>Nội dung cũ</p>");
        assertThat(restored.getSlug()).isEqualTo("url-on-dinh");
        verify(revisionRepository).save(argThat(saved -> saved.getTitle().equals("Hiện tại")));
    }

    @Test
    void restoreRejectsRevisionBelongingToAnotherPost() {
        BlogPost existing = post(1L, "Bài viết", "DRAFT", "");
        BlogPostRevision otherPostRevision = BlogPostRevision.builder()
                .id(7L).postId(2L).title("Sai bài").createdAt(LocalDateTime.now()).build();
        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(revisionRepository.findById(7L)).thenReturn(Optional.of(otherPostRevision));

        assertThatThrownBy(() -> service.restoreRevision(1L, 7L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("phiên bản");
        verify(blogPostRepository, never()).save(any());
    }

    @Test
    void incrementViewCountHandlesNullAndExistingValues() {
        BlogPost post = post(1L, "Bài viết", "PUBLISHED", "");
        post.setSlug("bai-viet");
        post.setViewCount(null);
        when(blogPostRepository.findBySlugAndStatus("bai-viet", "PUBLISHED"))
                .thenReturn(Optional.of(post));
        when(blogPostRepository.save(any(BlogPost.class))).thenAnswer(invocation -> invocation.getArgument(0));

        service.incrementViewCount("bai-viet");
        assertThat(post.getViewCount()).isEqualTo(1);

        service.incrementViewCount("bai-viet");
        assertThat(post.getViewCount()).isEqualTo(2);
        verify(blogPostRepository, times(2)).save(post);
    }

    @Test
    void unpublishedPostCannotBeReadThroughPublishedSlug() {
        when(blogPostRepository.findBySlugAndStatus("ban-nhap", "PUBLISHED"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getPublishedPostBySlug("ban-nhap"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deleteDelegatesToRepository() {
        service.deletePost(12L);
        verify(blogPostRepository).deleteById(12L);
    }

    @Test
    void publishedListingOnlyRequestsPublishedStatus() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<BlogPost> page = new PageImpl<>(List.of(post(1L, "Bài viết", "PUBLISHED", "")));
        when(blogPostRepository.findByStatus("PUBLISHED", pageable)).thenReturn(page);

        assertThat(service.getPublishedPosts(pageable)).isSameAs(page);
    }

    private BlogPost post(Long id, String title, String status, String content) {
        return BlogPost.builder()
                .id(id)
                .title(title)
                .status(status)
                .content(content)
                .category("Sức khỏe")
                .excerpt("Mô tả")
                .coverPositionX(50)
                .coverPositionY(50)
                .featured(false)
                .viewCount(0L)
                .build();
    }
}
