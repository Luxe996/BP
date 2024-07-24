function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function getSystemLanguage() {
    return navigator.language.substring(0, 2);
}

async function loadLocalization(lang) {
    try {
        const response = await fetch(`./src/locales/${lang}.json`);
        if (!response.ok) {
            throw new Error('Localization file not found');
        }
        return response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

function applyLocalization(localization) {
    const elementsMap = {
        "Get Unlimited <br>Access": ["title"],
        "Unlimited Art <br>Creation": ["feature1"],
        "Exclusive <br>Styles": ["feature2"],
        "Magic Avatars <br>With 20% Off": ["feature3"],
        "YEARLY ACCESS": ['price-yearly'],
        "BEST OFFER": ["bestOffer"],
        "Just {{price}} per year": ["yearly"],
        "WEEKLY ACCESS": ['price-weekly'],
        "{{price}} <br>per week": ["weekly", "price-week"],
        "Terms of Use": ["terms"],
        "Privacy Policy": ["privacy"],
        "Restore": ["restore"],
        "Continue": ["continue"]
    };

    for (const [key, ids] of Object.entries(elementsMap)) {
        ids.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                if (key.includes('{{price}}')) {
                    let price;
                    if (id === 'yearly') {
                        price = '$35.99';
                    } else if (id === 'price-week') {
                        price = '$0.48';
                    } else if (id === 'weekly') {
                        price = '$6.99';
                    }
                    console.log(price)
                    element.querySelector('.price').innerHTML = localization[key].replace('{{price}}', price);
                } else {
                    element.innerHTML = localization[key];
                }
            }
        });
    }
}

(async function() {
    document.addEventListener('DOMContentLoaded', async function() {
        let lang = getQueryParam('lang') || getSystemLanguage();
        if (!['de', 'en', 'es', 'fr', 'ja', 'pt'].includes(lang)) {
            lang = 'en';
        }

        const localization = await loadLocalization(lang);
        if (localization) {
            applyLocalization(localization);
        }

        const pricingOptions = document.querySelectorAll('.pricing-option');
        const continueButton = document.getElementById('continue');

        pricingOptions.forEach(option => {
            option.addEventListener('click', function() {
                pricingOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        continueButton.addEventListener('click', function() {
            const selectedOption = document.querySelector('.pricing-option.selected');
            if (selectedOption) {
                const url = selectedOption.getAttribute('data-url');
                window.location.href = url;
            } else {
                alert('Выбери план');
            }
        });
    });
})();