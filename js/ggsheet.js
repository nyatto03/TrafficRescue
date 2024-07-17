//  https://docs.google.com/spreadsheets/d/14btuY0lF1Bo6zPp-sW6d9gQ3z6WXMsh5dkzVunW4NVQ/edit?gid=0#gid=0


const form = document.querySelector('#contact-form');
const scriptURL = 'https://script.google.com/macros/s/AKfycbyiBkfArKT7bXvCdUN7SHk560Ch5r5oloFQmZToJz1ko1oe_z-hKt6I2yQ1F80uarNRrw/exec';

form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Ghi nhận thời gian gửi form theo múi giờ Hà Nội
    const submitTimeField = document.querySelector('#submit-time');
    const currentTime = new Date();
    const options = {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour12: false,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    };
    const formattedDateTime = currentTime.toLocaleString('en-US', options);
    submitTimeField.value = formattedDateTime;

    // Kiểm tra xem các trường đã điền đầy đủ hay chưa
    let isValid = true;
    form.querySelectorAll('[name][required]').forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            const formGroup = getParent(input, '.form-group');
            if (formGroup) {
                const formMessage = formGroup.querySelector('.form-message');
                if (formMessage) {
                    formMessage.innerText = 'Vui lòng điền đầy đủ thông tin.';
                    formGroup.classList.add('invalid');
                }
            }
        }
    });

    if (!isValid) {
        return; // Ngăn chặn gửi form nếu có lỗi
    }

    // Nếu form điền đầy đủ, gửi dữ liệu đến Google Apps Script
    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(response => {
            alert("Cảm ơn bạn! Form của bạn đã được gửi thành công.");
            window.location.reload();
        })
        .catch(error => console.error('Lỗi!', error.message));
});

// Hàm lấy parent element theo selector
function getParent(element, selector) {
    while (element.parentElement) {
        if (element.parentElement.matches(selector)) {
            return element.parentElement;
        }
        element = element.parentElement;
    }
}