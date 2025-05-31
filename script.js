// Jelly Bean bileşenleri veritabanı
let components = [
    {
        name: "LM358",
        type: "Operasyonel Amplifikatör",
        description: "Çift kanallı, düşük güçlü op-amp",
        package: "SOIC-8, DIP-8",
        manufacturer: "Texas Instruments",
        commonUses: "Sinyal yükseltme, filtreleme, karşılaştırma",
        datasheet: "https://www.ti.com/lit/ds/symlink/lm358.pdf"
    },
    {
        name: "NE555",
        type: "Zamanlayıcı",
        description: "Klasik 555 zamanlayıcı IC",
        package: "DIP-8, SOIC-8",
        manufacturer: "Texas Instruments",
        commonUses: "Osilatör, zamanlayıcı, PWM kontrolü",
        datasheet: "https://www.ti.com/lit/ds/symlink/ne555.pdf"
    },
    {
        name: "LM7805",
        type: "Voltaj Regülatörü",
        description: "5V çıkışlı pozitif voltaj regülatörü",
        package: "TO-220",
        manufacturer: "Texas Instruments",
        commonUses: "Güç kaynağı, voltaj regülasyonu",
        datasheet: "https://www.ti.com/lit/ds/symlink/lm7805.pdf"
    },
    {
        name: "2N2222",
        type: "NPN Transistör",
        description: "Genel amaçlı NPN transistör",
        package: "TO-92",
        manufacturer: "ON Semiconductor",
        commonUses: "Anahtarlama, yükseltme",
        datasheet: "https://www.onsemi.com/pdf/datasheet/p2n2222a-d.pdf"
    },
    {
        name: "1N4007",
        type: "Diyot",
        description: "Genel amaçlı silikon diyot",
        package: "DO-41",
        manufacturer: "Vishay",
        commonUses: "Doğrultma, koruma",
        datasheet: "https://www.vishay.com/docs/88503/1n4001.pdf"
    },
    {
        name: "LM741",
        type: "Operasyonel Amplifikatör",
        description: "Klasik op-amp",
        package: "DIP-8, SOIC-8",
        manufacturer: "Texas Instruments",
        commonUses: "Sinyal yükseltme, karşılaştırma",
        datasheet: "https://www.ti.com/lit/ds/symlink/lm741.pdf"
    },
    {
        name: "CD4017",
        type: "CMOS Sayıcı",
        description: "5-stage Johnson sayıcı",
        package: "DIP-16, SOIC-16",
        manufacturer: "Texas Instruments",
        commonUses: "LED dizileri, sayıcı devreleri",
        datasheet: "https://www.ti.com/lit/ds/symlink/cd4017b.pdf"
    },
    {
        name: "LM317",
        type: "Voltaj Regülatörü",
        description: "Ayarlanabilir pozitif voltaj regülatörü",
        package: "TO-220",
        manufacturer: "Texas Instruments",
        commonUses: "Ayarlanabilir güç kaynağı",
        datasheet: "https://www.ti.com/lit/ds/symlink/lm317.pdf"
    }
];

// Global değişkenler
let currentCategory = 'all';
let currentSearch = '';

// Sayfa yüklendiğinde localStorage'dan komponentleri yükle
function loadComponents() {
    const savedComponents = localStorage.getItem('components');
    if (savedComponents) {
        try {
            const parsedComponents = JSON.parse(savedComponents);
            if (Array.isArray(parsedComponents) && parsedComponents.length > 0) {
                components = parsedComponents;
            } else {
                localStorage.setItem('components', JSON.stringify(components));
            }
        } catch (error) {
            console.error('LocalStorage verisi okunamadı:', error);
            localStorage.setItem('components', JSON.stringify(components));
        }
    } else {
        localStorage.setItem('components', JSON.stringify(components));
    }
}

// Bileşenleri listeleme fonksiyonu
function displayComponents(componentsToShow) {
    const componentsList = document.getElementById('componentsList');
    if (!componentsList) {
        console.error('componentsList elementi bulunamadı!');
        return;
    }
    
    componentsList.innerHTML = '';

    if (!componentsToShow || componentsToShow.length === 0) {
        componentsList.innerHTML = '<div class="no-components">Komponent bulunamadı</div>';
        return;
    }

    componentsToShow.forEach((component) => {
        const card = document.createElement('div');
        card.className = 'component-card';
        card.innerHTML = `
            <div class="card-header">
                <h3>${component.name}</h3>
                <button class="delete-btn" title="Komponenti Sil">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <p>${component.description}</p>
            <div class="details">
                <span><strong>Tip:</strong> ${component.type}</span>
                <span><strong>Paket:</strong> ${component.package}</span>
                <span><strong>Üretici:</strong> ${component.manufacturer}</span>
                <span><strong>Yaygın Kullanım:</strong> ${component.commonUses}</span>
                <a href="${component.datasheet}" target="_blank" class="datasheet-link">Datasheet'i Görüntüle</a>
            </div>
        `;

        // Silme butonuna event listener ekle
        const deleteBtn = card.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            if (confirm('Bu komponenti silmek istediğinizden emin misiniz?')) {
                // Ana dizideki gerçek indexi bul
                const realIndex = components.findIndex(c =>
                    c.name === component.name &&
                    c.type === component.type &&
                    c.description === component.description
                );
                if (realIndex !== -1) {
                    components.splice(realIndex, 1);
                    localStorage.setItem('components', JSON.stringify(components));
                    updateCategoryButtons();
                    updateDisplay();
                }
            }
        });

        componentsList.appendChild(card);
    });
}

// Arama fonksiyonu
function searchComponents(query) {
    query = query.toLowerCase();
    return components.filter(component => 
        component.name.toLowerCase().includes(query) ||
        component.type.toLowerCase().includes(query) ||
        component.description.toLowerCase().includes(query) ||
        component.manufacturer.toLowerCase().includes(query) ||
        component.commonUses.toLowerCase().includes(query)
    );
}

// Kategori filtreleme fonksiyonu
function filterByCategory(category) {
    if (category === 'all') {
        return components;
    }
    return components.filter(component => component.type === category);
}

// Kategori butonlarını güncelleme fonksiyonu
function updateCategoryButtons() {
    const categoryFilters = document.getElementById('categoryButtons');
    if (!categoryFilters) {
        console.error('categoryButtons elementi bulunamadı!');
        return;
    }

    const existingCategories = new Set(['all']);
    components.forEach(component => {
        existingCategories.add(component.type);
    });

    // Her kategori için sayıyı hesapla
    const categoryCounts = {};
    categoryCounts['all'] = components.length;
    components.forEach(component => {
        categoryCounts[component.type] = (categoryCounts[component.type] || 0) + 1;
    });

    const buttons = Array.from(existingCategories).map(category => {
        const isActive = category === currentCategory ? 'active' : '';
        const displayName = category === 'all' ? 'Tümü' : 
                          category === 'Operasyonel Amplifikatör' ? 'Op-Amp' :
                          category === 'Voltaj Regülatörü' ? 'Regülatör' :
                          category === 'NPN Transistör' ? 'Transistör' :
                          category === 'CMOS Sayıcı' ? 'Sayıcı' : category;
        const count = categoryCounts[category] || 0;
        return `<button class="category-btn ${isActive}" data-category="${category}">${displayName} <span class='cat-count'>(${count})</span></button>`;
    });

    categoryFilters.innerHTML = buttons.join('');

    categoryFilters.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', () => {
            categoryFilters.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentCategory = button.dataset.category;
            updateDisplay();
        });
    });
}

// Bileşenleri güncelleme fonksiyonu
function updateDisplay() {
    let filteredComponents = components;
    
    if (currentCategory !== 'all') {
        filteredComponents = filterByCategory(currentCategory);
    }
    
    if (currentSearch) {
        filteredComponents = searchComponents(currentSearch);
    }
    
    displayComponents(filteredComponents);
}

// Dark mode işlevselliği
function initThemeSwitch() {
    const themeSwitch = document.getElementById('themeSwitch');
    if (!themeSwitch) return;

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeText(savedTheme);

    themeSwitch.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeText(newTheme);
    });
}

function updateThemeText(theme) {
    const themeText = document.querySelector('.theme-switch span');
    if (themeText) {
        themeText.textContent = theme === 'light' ? 'Dark Mode' : 'Light Mode';
    }
}

// Modal işlemleri
const modal = document.getElementById('componentModal');
const addButton = document.getElementById('addComponentBtn');
const closeButton = document.querySelector('.close-btn');

if (addButton) {
    addButton.addEventListener('click', () => {
        updateTypeOptions();
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    });
}

if (closeButton) {
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Form işlemleri
const form = document.getElementById('componentForm');
const typeSelect = document.getElementById('type');
const otherTypeInput = document.getElementById('otherType');

if (typeSelect) {
    typeSelect.addEventListener('change', () => {
        if (otherTypeInput) {
            otherTypeInput.style.display = typeSelect.value === 'other' ? 'block' : 'none';
        }
    });
}

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const newName = formData.get('name');
        // Aynı isimli komponent kontrolü
        if (components.some(c => c.name.trim().toLowerCase() === newName.trim().toLowerCase())) {
            showMessage('Aynı isimli bir komponent zaten mevcut!', 'error');
            return;
        }
        const component = {
            name: newName,
            type: formData.get('type') === 'other' ? formData.get('otherType') : formData.get('type'),
            description: formData.get('description'),
            package: formData.get('package'),
            manufacturer: formData.get('manufacturer'),
            commonUses: formData.get('commonUses'),
            datasheet: formData.get('datasheetLink')
        };

        components.push(component);
        localStorage.setItem('components', JSON.stringify(components));

        form.reset();
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';

        updateCategoryButtons();
        updateDisplay();
        showMessage('Komponent başarıyla eklendi!', 'success');
    });
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Toplu ekleme modalı işlemleri
const bulkModal = document.getElementById('bulkModal');
const bulkAddBtn = document.getElementById('bulkAddBtn');
const closeBulkModal = document.getElementById('closeBulkModal');
const bulkForm = document.getElementById('bulkForm');
const bulkJson = document.getElementById('bulkJson');

if (bulkAddBtn) {
    bulkAddBtn.addEventListener('click', () => {
        // Otomatik örnek JSON
        if (bulkJson && !bulkJson.value.trim()) {
            bulkJson.value = `[
  {
    "name": "LM358",
    "type": "Operasyonel Amplifikatör",
    "description": "Çift kanallı op-amp",
    "package": "SOIC-8",
    "manufacturer": "Texas Instruments",
    "commonUses": "Sinyal yükseltme",
    "datasheet": "https://www.ti.com/lit/ds/symlink/lm358.pdf"
  },
  {
    "name": "NE555",
    "type": "Zamanlayıcı",
    "description": "Klasik 555 zamanlayıcı IC",
    "package": "DIP-8",
    "manufacturer": "Texas Instruments",
    "commonUses": "Osilatör",
    "datasheet": "https://www.ti.com/lit/ds/symlink/ne555.pdf"
  }
]`;
        }
        bulkModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
}
if (closeBulkModal) {
    closeBulkModal.addEventListener('click', () => {
        bulkModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}
window.addEventListener('click', (e) => {
    if (e.target === bulkModal) {
        bulkModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

if (bulkForm) {
    bulkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let parsed;
        try {
            parsed = JSON.parse(bulkJson.value);
            if (!Array.isArray(parsed)) throw new Error('Dizi bekleniyor');
        } catch (err) {
            showMessage('Geçersiz JSON formatı!', 'error');
            return;
        }
        let eklendi = 0;
        let hata = 0;
        parsed.forEach(obj => {
            if (obj.name && obj.type && obj.description && obj.package && obj.manufacturer && obj.commonUses && obj.datasheet) {
                if (components.some(c => c.name.trim().toLowerCase() === obj.name.trim().toLowerCase())) {
                    hata++;
                    return;
                }
                components.push({
                    name: obj.name,
                    type: obj.type,
                    description: obj.description,
                    package: obj.package,
                    manufacturer: obj.manufacturer,
                    commonUses: obj.commonUses,
                    datasheet: obj.datasheet
                });
                eklendi++;
            }
        });
        localStorage.setItem('components', JSON.stringify(components));
        updateCategoryButtons();
        updateDisplay();
        bulkForm.reset();
        bulkModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        if (eklendi > 0 && hata > 0) {
            showMessage(`${eklendi} komponent eklendi, ${hata} tanesi zaten vardı!`, 'error');
        } else if (eklendi > 0) {
            showMessage(`${eklendi} komponent eklendi!`, 'success');
        } else if (hata > 0) {
            showMessage(`Tüm komponentler zaten mevcut!`, 'error');
        }
        updateTypeOptions();
    });
}

// Tip (kategori) select kutusunu dinamik doldur
function updateTypeOptions() {
    const typeSelect = document.getElementById('type');
    if (!typeSelect) return;
    // Mevcut tipleri topla
    const types = new Set();
    components.forEach(c => {
        if (c.type && c.type.trim()) types.add(c.type.trim());
    });
    // Statik "Diğer" seçeneği
    const staticOptions = [
        { value: '', label: 'Seçiniz...' },
        ...Array.from(types).map(t => ({ value: t, label: t })),
        { value: 'other', label: 'Diğer' }
    ];
    // Seçenekleri güncelle
    typeSelect.innerHTML = staticOptions.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('');
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    initThemeSwitch();
    loadComponents();

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            updateDisplay();
        });
    }

    updateCategoryButtons();
    updateDisplay();
}); 