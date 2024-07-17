// Lấy danh sách các mục trong menu
const menuItems = document.querySelectorAll('.nav li');

// Lặp qua từng mục và thêm sự kiện click
menuItems.forEach(function(anchor) {
    anchor.addEventListener('click', function(event) {
        // Xóa class active khỏi tất cả các mục
        menuItems.forEach(function(item) {
            item.classList.remove('active');
        });
        
        // Thêm class active vào mục được click
        this.classList.add('active');
    });
});
