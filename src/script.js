document.addEventListener('DOMContentLoaded', function() {
    // Menu Toggle for Mobile
    const menuToggle = document.getElementById('menuToggle');
    const navUl = document.querySelector('nav ul');
    
    menuToggle.addEventListener('click', function() {
        navUl.classList.toggle('show');
    });
    
    // Disease Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            const tabContainer = this.closest('.disease-info');
            
            // Remove active class from all buttons in this container
            tabContainer.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all tab contents in this container
            tabContainer.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Show the selected tab content
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Nutrition Tabs
    const nutritionTabBtns = document.querySelectorAll('.nutrition-tab-btn');
    nutritionTabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all nutrition tabs
            document.querySelectorAll('.nutrition-tab-btn').forEach(b => {
                b.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all nutrition contents
            document.querySelectorAll('.nutrition-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Show the selected nutrition content
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // BMI Calculator
    const calculateBmi = document.getElementById('calculateBmi');
    if (calculateBmi) {
        calculateBmi.addEventListener('click', function() {
            const height = parseFloat(document.getElementById('height').value) / 100; // convert cm to m
            const weight = parseFloat(document.getElementById('weight').value);
            
            if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
                alert('الرجاء إدخال قيم صحيحة للطول والوزن');
                return;
            }
            
            const bmi = weight / (height * height);
            const bmiResult = document.getElementById('bmi-result');
            const bmiCategory = document.getElementById('bmi-category');
            
            bmiResult.textContent = `مؤشر كتلة جسمك: ${bmi.toFixed(1)}`;
            
            if (bmi < 18.5) {
                bmiCategory.textContent = 'نقص في الوزن';
                bmiCategory.style.color = '#2196F3';
            } else if (bmi >= 18.5 && bmi < 25) {
                bmiCategory.textContent = 'وزن طبيعي';
                bmiCategory.style.color = '#4CAF50';
            } else if (bmi >= 25 && bmi < 30) {
                bmiCategory.textContent = 'زيادة في الوزن';
                bmiCategory.style.color = '#FF9800';
            } else {
                bmiCategory.textContent = 'سمنة';
                bmiCategory.style.color = '#F44336';
            }
        });
    }
    
    // Sugar Tracker
    const sugarData = {
        labels: [],
        datasets: [{
            label: 'مستوى السكر في الدم (mg/dL)',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            tension: 0.1
        }]
    };
    
    const sugarCtx = document.getElementById('sugarChart')?.getContext('2d');
    let sugarChart = null;
    
    if (sugarCtx) {
        sugarChart = new Chart(sugarCtx, {
            type: 'line',
            data: sugarData,
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }
    
    const addSugarBtn = document.getElementById('add-sugar');
    if (addSugarBtn) {
        addSugarBtn.addEventListener('click', function() {
            const level = parseFloat(document.getElementById('sugar-level').value);
            const time = document.getElementById('measure-time').value;
            
            if (isNaN(level)) {
                alert('الرجاء إدخال قيمة صحيحة لمستوى السكر');
                return;
            }
            
            const now = new Date();
            const timeLabel = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
            
            // Add data to chart
            sugarData.labels.push(timeLabel);
            sugarData.datasets[0].data.push(level);
            sugarChart.update();
            
            // Clear input
            document.getElementById('sugar-level').value = '';
            
            // Show message based on sugar level and time
            let message = '';
            if (time === 'fasting') {
                if (level < 70) message = 'انخفاض في سكر الدم - ينصح بتناول مصدر سكري سريع';
                else if (level >= 70 && level <= 100) message = 'مستوى سكر صائم طبيعي';
                else if (level > 100 && level <= 125) message = 'مقدمات السكري (ما قبل السكري)';
                else message = 'مستوى مرتفع - قد يشير إلى السكري';
            } else if (time === 'after-meal') {
                if (level < 140) message = 'مستوى طبيعي بعد الوجبة';
                else if (level >= 140 && level <= 200) message = 'مستوى مرتفع بعد الوجبة';
                else message = 'مستوى مرتفع جداً - استشر طبيبك';
            }
            
            if (message) {
                alert(`مستوى السكر: ${level} mg/dL\n${message}`);
            }
        });
    }
    
    // Blood Pressure Tracker
    const pressureData = {
        labels: [],
        datasets: [
            {
                label: 'الضغط الانقباضي (mm Hg)',
                data: [],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                tension: 0.1
            },
            {
                label: 'الضغط الانبساطي (mm Hg)',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                tension: 0.1
            }
        ]
    };
    
    const pressureCtx = document.getElementById('pressureChart')?.getContext('2d');
    let pressureChart = null;
    
    if (pressureCtx) {
        pressureChart = new Chart(pressureCtx, {
            type: 'line',
            data: pressureData,
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }
    
    const addPressureBtn = document.getElementById('add-pressure');
    if (addPressureBtn) {
        addPressureBtn.addEventListener('click', function() {
            const systolic = parseFloat(document.getElementById('systolic').value);
            const diastolic = parseFloat(document.getElementById('diastolic').value);
            const pressureResult = document.getElementById('pressure-result');
            
            if (isNaN(systolic) || isNaN(diastolic)) {
                alert('الرجاء إدخال قيم صحيحة لضغط الدم');
                return;
            }
            
            const now = new Date();
            const timeLabel = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
            
            // Add data to chart
            pressureData.labels.push(timeLabel);
            pressureData.datasets[0].data.push(systolic);
            pressureData.datasets[1].data.push(diastolic);
            pressureChart.update();
            
            // Clear inputs
            document.getElementById('systolic').value = '';
            document.getElementById('diastolic').value = '';
            
            // Determine pressure category
            let category = '';
            let color = '';
            
            if (systolic < 120 && diastolic < 80) {
                category = 'طبيعي';
                color = '#4CAF50';
            } else if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
                category = 'مرتفع';
                color = '#8BC34A';
            } else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
                category = 'المرحلة الأولى من ارتفاع ضغط الدم';
                color = '#FF9800';
            } else if (systolic >= 140 || diastolic >= 90) {
                category = 'المرحلة الثانية من ارتفاع ضغط الدم';
                color = '#F44336';
            } else if (systolic > 180 || diastolic > 120) {
                category = 'أزمة ارتفاع ضغط الدم - تحتاج رعاية طبية فورية';
                color = '#D32F2F';
            }
            
            pressureResult.innerHTML = `
                <p>القراءة: ${systolic}/${diastolic} mm Hg</p>
                <p style="color: ${color}">${category}</p>
            `;
        });
    }
    
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send the data to a server
            alert(`شكراً ${name} على رسالتك! سنقوم بالرد عليك عبر البريد الإلكتروني ${email} في أقرب وقت.`);
            contactForm.reset();
        });
    }
    
    // Newsletter Form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            // Here you would typically send the email to a server
            alert(`شكراً على اشتراكك في نشرتنا البريدية! سيتم إرسال آخر التحديثات إلى ${email}`);
            this.reset();
        });
    }
    
    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                navUl.classList.remove('show');
            }
        });
    });
});