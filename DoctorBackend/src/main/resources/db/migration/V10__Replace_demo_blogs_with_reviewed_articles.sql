-- Thay dữ liệu minh họa bằng bộ bài Nhi khoa đã đối chiếu nguồn WHO và AAP.
-- Blog revision được xóa theo ON DELETE CASCADE.
DELETE FROM blog_post;

INSERT INTO blog_post (
    slug, title, excerpt, content, category, cover_image, cover_image_alt,
    cover_position_x, cover_position_y, status, reading_time, featured,
    published_at, created_at, updated_at, created_by, seo_title,
    seo_description, primary_keyword, tags, view_count
) VALUES
(
    'sot-o-tre-cach-do-nhiet-do-va-dau-hieu-can-di-kham',
    'Sốt ở trẻ: cách đo nhiệt độ và dấu hiệu cần đưa trẻ đi khám',
    'Sốt thường là phản ứng của cơ thể trước nhiễm trùng. Điều quan trọng không chỉ là con số trên nhiệt kế mà còn là tuổi, khả năng uống nước, nhịp thở và mức độ tỉnh táo của trẻ.',
    '<p>Sốt là một trong những lý do phổ biến nhất khiến cha mẹ lo lắng. Tuy nhiên, nhiệt độ cao không tự cho biết bệnh nặng hay nhẹ. Cha mẹ cần nhìn tổng thể: trẻ có tỉnh táo không, có uống được không, thở có bình thường không và có xuất hiện dấu hiệu bất thường nào khác không.</p>
    <div class="medical-note"><strong>Điểm cần nhớ:</strong> trẻ dưới 3 tháng tuổi có nhiệt độ từ 38°C trở lên cần được bác sĩ đánh giá sớm, ngay cả khi trẻ vẫn có vẻ bình thường.</div>
    <h2>Thế nào được gọi là sốt?</h2>
    <p>Nhiệt độ cơ thể thay đổi theo thời điểm trong ngày và cách đo. Nói chung, nhiệt độ từ 38°C trở lên được xem là sốt. Cần ghi lại vị trí đo và loại nhiệt kế vì nhiệt độ ở nách, miệng, tai hoặc trực tràng không hoàn toàn tương đương.</p>
    <h3>Đo nhiệt độ đúng cách</h3>
    <ul><li>Dùng nhiệt kế điện tử và đọc hướng dẫn của nhà sản xuất.</li><li>Không ước lượng sốt chỉ bằng cách sờ trán.</li><li>Đo lại nếu kết quả không phù hợp với biểu hiện của trẻ.</li><li>Không dùng nhiệt kế thủy ngân vì nguy cơ vỡ và phơi nhiễm thủy ngân.</li></ul>
    <h2>Chăm sóc trẻ sốt tại nhà</h2>
    <p>Cho trẻ uống đủ nước, tiếp tục bú mẹ nếu trẻ còn bú và mặc quần áo thoáng. Mục tiêu của thuốc hạ sốt là giúp trẻ dễ chịu hơn, không phải đưa nhiệt độ về mức hoàn toàn bình thường.</p>
    <ul><li>Không chườm nước đá hoặc lau người bằng cồn.</li><li>Không tự phối hợp nhiều thuốc hạ sốt.</li><li>Không dùng aspirin cho trẻ em.</li><li>Liều thuốc phải dựa theo cân nặng và hướng dẫn của bác sĩ hoặc dược sĩ.</li></ul>
    <h2>Dấu hiệu cần liên hệ bác sĩ</h2>
    <ul><li>Trẻ dưới 3 tháng tuổi sốt từ 38°C.</li><li>Trẻ trông rất mệt, khó đánh thức, kích thích bất thường hoặc ngày càng xấu đi.</li><li>Khó thở, thở nhanh, rút lõm lồng ngực hoặc tím tái.</li><li>Cứng cổ, co giật, đau đầu dữ dội hoặc phát ban tím không mất màu khi ấn.</li><li>Nôn liên tục, tiêu chảy nhiều, uống kém hoặc có dấu hiệu mất nước.</li><li>Sốt kéo dài hơn 24 giờ ở trẻ dưới 2 tuổi hoặc hơn 3 ngày ở trẻ từ 2 tuổi trở lên.</li></ul>
    <div class="medical-warning"><strong>Đi cấp cứu ngay</strong> nếu trẻ khó thở nặng, tím tái, không đáp ứng, co giật kéo dài hoặc xuất hiện ban tím nhanh.</div>
    <h2>Thông tin nên chuẩn bị khi đi khám</h2>
    <p>Ghi lại nhiệt độ cao nhất, cách đo, thời điểm bắt đầu sốt, lượng nước tiểu, khả năng ăn uống và các triệu chứng đi kèm. Mang theo danh sách thuốc trẻ đã dùng và thời điểm dùng gần nhất.</p>
    <h2>Nguồn tham khảo</h2>
    <ul><li><a href="https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/When-to-Call-the-Pediatrician.aspx" target="_blank" rel="noopener noreferrer">American Academy of Pediatrics: Fever – When to Call the Pediatrician</a></li><li><a href="https://www.healthychildren.org/English/tips-tools/symptom-checker/Pages/symptomviewer.aspx?symptom=Fever" target="_blank" rel="noopener noreferrer">HealthyChildren.org: Fever symptom guidance</a></li></ul>
    <p><em>Bài viết cung cấp thông tin giáo dục sức khỏe, không thay thế chẩn đoán hoặc chỉ định điều trị trực tiếp.</em></p>',
    'Sức khỏe thường gặp', '/images/blog/sot-o-tre-cover.webp', 'Nhiệt kế điện tử và nước uống minh họa chăm sóc trẻ sốt',
    65, 50, 'PUBLISHED', 6, TRUE, NOW(), NOW(), NOW(), 'Bác sĩ Nhi Vita',
    'Sốt ở trẻ: Cách đo nhiệt độ và khi nào cần đi khám',
    'Hướng dẫn cha mẹ đo nhiệt độ, chăm sóc trẻ sốt tại nhà và nhận biết các dấu hiệu cần khám hoặc cấp cứu.',
    'sốt ở trẻ', 'sốt ở trẻ,đo nhiệt độ,hạ sốt,dấu hiệu nguy hiểm,chăm sóc trẻ', 0
),
(
    'tre-tieu-chay-nhan-biet-mat-nuoc-va-bu-oresol-dung-cach',
    'Trẻ tiêu chảy: nhận biết mất nước và bù Oresol đúng cách',
    'Nguy cơ lớn nhất khi trẻ tiêu chảy là mất nước và điện giải. Bù dịch sớm bằng dung dịch Oresol pha đúng hướng dẫn, tiếp tục cho trẻ ăn và nhận biết dấu hiệu nặng giúp giảm biến chứng.',
    '<p>Tiêu chảy thường được hiểu là đi ngoài phân lỏng từ 3 lần trở lên trong ngày hoặc nhiều hơn rõ rệt so với bình thường của trẻ. Với trẻ bú mẹ, phân mềm hoặc sệt nhiều lần mỗi ngày chưa chắc là tiêu chảy nếu đó là thói quen thường ngày.</p>
    <div class="medical-note"><strong>Ưu tiên số một:</strong> phòng và xử trí mất nước. Dung dịch bù nước đường uống (Oresol/ORS) cần được pha đúng lượng nước ghi trên gói.</div>
    <h2>Dấu hiệu trẻ đang mất nước</h2>
    <ul><li>Khát nhiều, uống háo hức hoặc ngược lại uống kém.</li><li>Môi miệng khô, ít nước mắt khi khóc.</li><li>Tiểu ít hơn bình thường, nước tiểu sẫm màu.</li><li>Mắt trũng, trẻ bứt rứt hoặc lừ đừ.</li><li>Da mất đàn hồi; véo da bụng trở lại chậm.</li></ul>
    <h2>Bù Oresol như thế nào?</h2>
    <p>Pha toàn bộ gói với đúng lượng nước sạch được ghi trên bao bì. Không chia gói bằng mắt, không pha đặc hoặc loãng hơn, không thêm đường, sữa hay nước trái cây. Cho trẻ uống từng thìa hoặc từng ngụm nhỏ và thường xuyên; nếu trẻ nôn, chờ vài phút rồi cho uống lại chậm hơn.</p>
    <h3>Những sai lầm cần tránh</h3>
    <ul><li>Dùng nước ngọt, nước thể thao hoặc nước trái cây thay cho Oresol.</li><li>Pha Oresol với lượng nước tùy ý.</li><li>Tự dùng thuốc cầm tiêu chảy cho trẻ.</li><li>Tự mua kháng sinh khi chưa có chỉ định.</li></ul>
    <h2>Trẻ có cần nhịn ăn?</h2>
    <p>Không. Tiếp tục cho trẻ bú mẹ và ăn thức ăn phù hợp theo tuổi, chia thành lượng nhỏ nếu trẻ ăn kém. Dinh dưỡng đầy đủ giúp hạn chế vòng xoắn tiêu chảy–suy dinh dưỡng. Kẽm có thể được chỉ định trong tiêu chảy cấp ở trẻ em, nhưng cha mẹ nên dùng đúng dạng và liều theo tư vấn của nhân viên y tế.</p>
    <h2>Khi nào cần đưa trẻ đi khám ngay?</h2>
    <ul><li>Trẻ lừ đừ, khó đánh thức, không uống được hoặc nôn mọi thứ.</li><li>Đi ngoài có máu, đau bụng dữ dội hoặc bụng chướng.</li><li>Tiểu rất ít, mắt trũng rõ, tay chân lạnh hoặc thở bất thường.</li><li>Trẻ nhỏ, có bệnh nền, suy dinh dưỡng hoặc tiêu chảy kéo dài.</li></ul>
    <div class="medical-warning"><strong>Không trì hoãn cấp cứu</strong> nếu trẻ có dấu hiệu mất nước nặng, rối loạn ý thức, sốc hoặc không thể uống.</div>
    <h2>Phòng ngừa lây nhiễm</h2>
    <p>Rửa tay bằng xà phòng sau khi thay tã và trước khi chuẩn bị thức ăn; dùng nước an toàn; vệ sinh dụng cụ ăn uống và tiêm chủng rotavirus theo lịch là những biện pháp quan trọng.</p>
    <h2>Nguồn tham khảo</h2>
    <ul><li><a href="https://www.who.int/news-room/fact-sheets/detail/diarrhoeal-disease" target="_blank" rel="noopener noreferrer">World Health Organization: Diarrhoeal disease</a></li><li><a href="https://www.who.int/tools/elena/interventions/zinc-diarrhoea" target="_blank" rel="noopener noreferrer">WHO: Zinc supplementation in the management of diarrhoea</a></li></ul>
    <p><em>Bài viết cung cấp thông tin giáo dục sức khỏe, không thay thế chẩn đoán hoặc chỉ định điều trị trực tiếp.</em></p>',
    'Tiêu hóa', '/images/blog/tieu-chay-mat-nuoc-cover.webp', 'Cốc nước, thìa và biểu tượng giọt nước minh họa bù nước khi trẻ tiêu chảy',
    68, 50, 'PUBLISHED', 6, FALSE, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW(), NOW(), 'Bác sĩ Nhi Vita',
    'Trẻ tiêu chảy: Dấu hiệu mất nước và cách bù Oresol',
    'Nhận biết mất nước ở trẻ tiêu chảy, cách pha và cho uống Oresol an toàn, những sai lầm cần tránh và dấu hiệu phải đi khám.',
    'trẻ tiêu chảy', 'trẻ tiêu chảy,mất nước,Oresol,ORS,chăm sóc trẻ', 0
),
(
    'an-dam-tu-6-thang-nguyen-tac-bat-dau-an-toan',
    'Ăn dặm từ 6 tháng: nguyên tắc bắt đầu an toàn và đủ chất',
    'Khoảng 6 tháng tuổi, trẻ cần thêm thực phẩm bổ sung bên cạnh sữa mẹ hoặc sữa công thức. Bữa ăn nên tăng dần về lượng, độ thô và sự đa dạng, đồng thời tôn trọng tín hiệu đói no của trẻ.',
    '<p>Ăn dặm là giai đoạn trẻ bắt đầu nhận thực phẩm ngoài sữa mẹ hoặc sữa công thức. Tổ chức Y tế Thế giới khuyến nghị bắt đầu thực phẩm bổ sung vào khoảng 6 tháng tuổi, khi nhu cầu năng lượng và dưỡng chất tăng lên.</p>
    <div class="medical-note"><strong>Ăn dặm là bổ sung, không phải thay thế sữa ngay lập tức.</strong> Tiếp tục cho trẻ bú mẹ hoặc dùng sữa công thức phù hợp trong quá trình làm quen thức ăn.</div>
    <h2>Dấu hiệu trẻ sẵn sàng ăn dặm</h2>
    <ul><li>Khoảng 6 tháng tuổi và kiểm soát đầu cổ tốt.</li><li>Có thể ngồi với sự hỗ trợ và giữ thân tương đối vững.</li><li>Đưa thức ăn vào miệng và nuốt thay vì liên tục đẩy ra.</li><li>Thể hiện hứng thú với thức ăn.</li></ul>
    <p>Chỉ quan tâm đến đồ ăn hoặc thức giấc ban đêm không đủ để kết luận trẻ cần ăn dặm sớm.</p>
    <h2>Một bữa ăn nên có gì?</h2>
    <p>Ưu tiên thực phẩm giàu dinh dưỡng: nguồn đạm như thịt, cá, trứng hoặc các loại đậu; ngũ cốc hoặc củ; rau quả; và lượng chất béo phù hợp. Tăng dần sự đa dạng thay vì chỉ cho trẻ ăn nước cháo hoặc bột loãng kéo dài.</p>
    <h3>Tần suất tham khảo theo WHO</h3>
    <ul><li>6–8 tháng: thường 2–3 bữa ăn bổ sung mỗi ngày.</li><li>9–23 tháng: thường 3–4 bữa mỗi ngày.</li><li>Từ 12 tháng có thể thêm 1–2 bữa phụ giàu dinh dưỡng tùy nhu cầu.</li></ul>
    <p>Nhu cầu thực tế khác nhau giữa các trẻ. Cha mẹ nên quan sát tốc độ tăng trưởng, khả năng ăn và hướng dẫn của bác sĩ.</p>
    <h2>Tăng độ thô và tôn trọng tín hiệu của trẻ</h2>
    <p>Bắt đầu với thức ăn mềm, nghiền hoặc dằm phù hợp; tăng dần độ thô theo kỹ năng của trẻ. Khoảng 8 tháng, nhiều trẻ có thể thử thức ăn cầm tay mềm. Cho trẻ ngồi thẳng, luôn có người lớn quan sát và không ép ăn khi trẻ quay mặt, ngậm miệng hoặc mất hứng thú.</p>
    <h2>An toàn thực phẩm và phòng hóc</h2>
    <ul><li>Rửa tay, dùng dụng cụ sạch và bảo quản thực phẩm đúng cách.</li><li>Không thêm muối hoặc đường vào thức ăn của trẻ nhỏ.</li><li>Không cho trẻ dưới 12 tháng dùng mật ong.</li><li>Tránh các miếng cứng, tròn hoặc dai dễ gây hóc; cắt và làm mềm thức ăn phù hợp.</li><li>Không để trẻ ăn một mình hoặc ăn khi đang nằm, chạy nhảy.</li></ul>
    <h2>Theo dõi phản ứng với thực phẩm</h2>
    <p>Giới thiệu thực phẩm mới khi trẻ khỏe và theo dõi phản ứng. Nếu nổi mề đay lan nhanh, sưng môi lưỡi, nôn nhiều, khò khè, khó thở hoặc lừ đừ sau ăn, cần cấp cứu ngay.</p>
    <h2>Nguồn tham khảo</h2>
    <ul><li><a href="https://www.who.int/publications/i/item/9789240081864" target="_blank" rel="noopener noreferrer">WHO guideline for complementary feeding of infants and young children 6–23 months</a></li><li><a href="https://www.who.int/health-topics/complementary-feeding" target="_blank" rel="noopener noreferrer">World Health Organization: Complementary feeding</a></li></ul>
    <p><em>Bài viết cung cấp thông tin giáo dục sức khỏe. Trẻ sinh non, chậm tăng trưởng, dị ứng hoặc có bệnh nền cần kế hoạch dinh dưỡng riêng.</em></p>',
    'Dinh dưỡng', '/images/blog/an-dam-6-thang-cover.webp', 'Bát thức ăn đa dạng minh họa ăn dặm đủ chất cho trẻ từ 6 tháng',
    68, 50, 'PUBLISHED', 7, FALSE, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW(), NOW(), 'Bác sĩ Nhi Vita',
    'Ăn dặm từ 6 tháng: Bắt đầu thế nào để an toàn và đủ chất?',
    'Nguyên tắc ăn dặm từ 6 tháng theo WHO: lựa chọn thực phẩm, tần suất bữa ăn, tăng độ thô, ăn đáp ứng và phòng hóc.',
    'ăn dặm 6 tháng', 'ăn dặm,ăn dặm 6 tháng,dinh dưỡng trẻ nhỏ,thực phẩm bổ sung,WHO', 0
);
