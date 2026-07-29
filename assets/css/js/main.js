// نظام التنقل الفائق النعومة بين الصفوف والمراحل (Tabs Filtering)
function switchTab(category) {
    const grid = document.getElementById('courses-grid');
    const cards = document.querySelectorAll('.course-card');
    const buttons = document.querySelectorAll('.tab-btn');

    // 1. تنعيم حركة التبديل عن طريق تقليل الـ Opacity أولاً (تأثير Fade-out)
    grid.style.opacity = '0';
    grid.style.transform = 'translateY(10px)';

    setTimeout(() => {
        cards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            if (category === 'all' || cardCat === category) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });

        // 2. إرجاع الـ Opacity لوضعه الطبيعي بعد التبديل (تأثير Fade-in)
        grid.style.opacity = '1';
        grid.style.transform = 'translateY(0)';
    }, 300); // وقت الأنيميشن بالملي ثانية

    // 3. تحديث ستايل الأزرار النشطة (Active Button Style)
    buttons.forEach(btn => {
        btn.classList.remove('bg-emerald-600', 'text-white', 'shadow-md', 'shadow-emerald-100');
        btn.classList.add('text-gray-600', 'hover:text-emerald-600', 'hover:bg-emerald-50/50');
    });

    const activeBtn = document.getElementById(`tab-${category}`);
    activeBtn.classList.remove('text-gray-600', 'hover:text-emerald-600', 'hover:bg-emerald-50/50');
    activeBtn.classList.add('bg-emerald-600', 'text-white', 'shadow-md', 'shadow-emerald-100');
}