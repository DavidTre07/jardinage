// Configuration des villes
const cities = {
    'paris': 'Paris',
    'lyon': 'Lyon', 
    'marseille': 'Marseille',
    'toulouse': 'Toulouse',
    'lille': 'Lille',
    'nantes': 'Nantes',
    'strasbourg': 'Strasbourg',
    'montpellier': 'Montpellier',
    'bordeaux': 'Bordeaux',
    'nice': 'Nice'
};

let currentCity = 'lyon';

// Fonction pour mettre à jour l'URL
function updateURL(city) {
    const url = new URL(window.location);
    url.searchParams.set('ville', city);
    window.history.pushState({}, '', url);
}

// Fonction pour lire l'URL au chargement
function getUrlCity() {
    const params = new URLSearchParams(window.location.search);
    const cityFromUrl = params.get('ville');
    if (cityFromUrl && cities[cityFromUrl]) {
        return cityFromUrl;
    }
    return 'lyon'; // Lyon par défaut
}

// Mapping des constellations vers leurs icônes
const constellationIcons = {
    'Bélier': '♈',
    'Taureau': '♉',
    'Gémeaux': '♊',
    'Cancer': '♋',
    'Lion': '♌',
    'Vierge': '♍',
    'Balance': '♎',
    'Scorpion': '♏',
    'Sagittaire': '♐',
    'Capricorne': '♑',
    'Verseau': '♒',
    'Poissons': '♓',
    'Serpentaire': '⛎'
};

// Fonction pour obtenir l'icône de recommandation
function getRecommendationIcon(recommendation) {
    if (recommendation.includes('DÉCONSEILLÉ')) {
        return '🚫';
    } else if (recommendation.includes('légumes fruits') || recommendation.includes('arbres fruitiers')) {
        return '🍅';
    } else if (recommendation.includes('légumes racines')) {
        return '🥕';
    } else if (recommendation.includes('fleurs') || recommendation.includes('légumes fleurs')) {
        return '🌸';    
    } else if (recommendation.includes('légumes feuilles')) {
        return '🥬';
    } else if (recommendation.includes('graines')) {
        return '🌱';
    } else if (recommendation.includes('repos') || recommendation.includes('guérison')) {
        return '🛌';
    } else {
        return '🌿';
    }
}

// Fonction pour obtenir le nom d'image basé sur la recommandation
function getImageName(recommendation) {
    if (recommendation.includes('DÉCONSEILLÉ')) {
        return 'deconseille.png';
    } else if (recommendation.includes('légumes fruits') || recommendation.includes('arbres fruitiers')) {
        return 'fruits.png';
    } else if (recommendation.includes('légumes racines')) {
        return 'racines.png';
    } else if (recommendation.includes('fleurs') || recommendation.includes('légumes fleurs')) {
        return 'fleurs.png';
    } else if (recommendation.includes('légumes feuilles')) {
        return 'feuilles.png';
    } else if (recommendation.includes('graines')) {
        return 'graines.png';
    } else if (recommendation.includes('repos') || recommendation.includes('guérison')) {
        return 'repos.png';
    } else {
        return 'general.png';
    }
}

// Fonction pour obtenir l'icône de sève
function getSeveIcon(seveInfo) {
    if (seveInfo.includes('nœud lunaire') || seveInfo.includes('éviter')) {
        return '⚠️';
    } else if (seveInfo.includes('montante')) {
        return '⬆️';
    } else if (seveInfo.includes('descendante')) {
        return '⬇️';
    } else {
        return '💧';
    }
}

function getPhaseIcon(percentage) {
    if (percentage < 1) return '🌑';
    if (percentage < 25) return '🌒';
    if (percentage < 49) return '🌓';
    if (percentage < 51) return '🌔';
    if (percentage < 75) return '🌕';
    if (percentage < 99) return '🌖';
    return '🌗';
}

function formatTimeRange(period) {
    if (period.start_time === '00:00' && period.end_time === '00:00') {
        return 'Toute la journée';
    } else if (period.start_time === '00:00') {
        return `Jusqu'à ${period.end_time}`;
    } else if (period.end_time === '00:00') {
        return `À partir de ${period.start_time}`;
    } else {
        return `De ${period.start_time} à ${period.end_time}`;
    }
}

function renderDay(dayData) {
    const phaseIcon = getPhaseIcon(dayData.phase_percentage);
    const detailed = document.getElementById('detailed').checked;
    
    // Mapping des mois
    const monthNames = ['JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUN', 
                        'JUL', 'AOU', 'SEP', 'OCT', 'NOV', 'DÉC'];
    
    // Extraire le jour et le mois de la date - gestion de différents formats
    let day, month;
    try {
        // Essayer différents formats de date
        let dateObj;
        if (dayData.date.includes('/')) {
            // Format DD/MM/YYYY ou MM/DD/YYYY
            const parts = dayData.date.split('/');
            if (parts.length === 3) {
                // Assumons DD/MM/YYYY (format français)
                dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
            }
        } else if (dayData.date.includes('-')) {
            // Format YYYY-MM-DD
            dateObj = new Date(dayData.date + 'T00:00:00');
        } else {
            // Format texte, essayer de parser directement
            dateObj = new Date(dayData.date);
        }
        
        if (isNaN(dateObj.getTime())) {
            throw new Error('Date invalide');
        }
        
        day = dateObj.getDate();
        month = monthNames[dateObj.getMonth()];
    } catch (error) {
        console.log('Erreur de parsing de date:', dayData.date, error);
        // Fallback: essayer d'extraire le jour du texte de la date
        const dayMatch = dayData.date.match(/\b(\d{1,2})\b/);
        day = dayMatch ? dayMatch[1] : '?';
        
        // Essayer d'extraire le mois du texte français
        const frenchMonths = {
            'janvier': 'JAN', 'février': 'FÉV', 'mars': 'MAR', 'avril': 'AVR',
            'mai': 'MAI', 'juin': 'JUN', 'juillet': 'JUL', 'août': 'AOU',
            'septembre': 'SEP', 'octobre': 'OCT', 'novembre': 'NOV', 'décembre': 'DÉC',
            'jan': 'JAN', 'fév': 'FÉV', 'mar': 'MAR', 'avr': 'AVR',
            'jul': 'JUL', 'aou': 'AOU', 'sep': 'SEP', 'oct': 'OCT', 'nov': 'NOV', 'déc': 'DÉC'
        };
        
        month = 'CAL';
        const dateText = dayData.date.toLowerCase();
        for (const [frenchMonth, shortMonth] of Object.entries(frenchMonths)) {
            if (dateText.includes(frenchMonth)) {
                month = shortMonth;
                break;
            }
        }
        
        // Si on n'a pas trouvé le mois dans le texte, essayer d'extraire depuis un format numérique
        if (month === 'CAL') {
            const monthMatch = dayData.date.match(/[-\/](\d{1,2})[-\/]/);
            if (monthMatch) {
                const monthNum = parseInt(monthMatch[1]) - 1;
                if (monthNum >= 0 && monthNum < 12) {
                    month = monthNames[monthNum];
                }
            }
        }
    }
    
    let periodsHtml = '';
    dayData.periods.forEach(period => {
        const timeRange = formatTimeRange(period);
        const periodClass = period.blocked ? 'period blocked' : 'period';
        const constellationIcon = constellationIcons[period.constellation] || '⭐';
        const recommendationIcon = getRecommendationIcon(period.recommendation);
        const imageName = getImageName(period.recommendation);
        const seveIcon = getSeveIcon(period.seve_info);
        
        // Traitement unifié - plus besoin de cas spécial pour les nœuds
        const timePrefix = period.blocked ? '🚫' : '✅';
        
        periodsHtml += `
            <div class="${periodClass}">
                <div class="period-content">
                    <div class="period-time">${timePrefix} ${timeRange}</div>
                    ${detailed ? `<div class="period-constellation"><span class="constellation-icon">${constellationIcon}</span>Constellation: ${period.constellation}</div>` : ''}
                    <div class="period-recommendation">
                        <span class="recommendation-icon">${recommendationIcon}</span>
                        ${period.recommendation}
                    </div>
                    ${period.seve_info ? `<div class="period-seve"><span class="seve-icon">${seveIcon}</span>${period.seve_info}</div>` : ''}
                </div>
                <div class="period-illustration">
                    <img src="${imageName}" alt="${period.recommendation}" onerror="this.style.display='none'">
                </div>
            </div>
        `;
    });

    let nodesHtml = '';
    if (dayData.nodes_info && dayData.nodes_info.length > 0) {
        nodesHtml = `
            <div class="nodes-alert">
                <h4>⚠️ Nœuds lunaires</h4>
                ${dayData.nodes_info.map(node => `<p>${node}</p>`).join('')}
            </div>
        `;
    }

    // Informations de base
    let basicInfo = `
        <div class="info-item">
            <div class="info-label">Phase lunaire</div>
            <div class="info-value">${phaseIcon} ${dayData.phase_percentage}%</div>
        </div>
        <div class="info-item">
            <div class="info-label">Lever du soleil</div>
            <div class="info-value">🌅 ${dayData.sunrise}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Coucher du soleil</div>
            <div class="info-value">🌇 ${dayData.sunset}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Durée du jour</div>
            <div class="info-value">☀️ ${dayData.daylight_duration}</div>
        </div>
    `;

    // Informations détaillées
    let detailedInfo = '';
    if (detailed) {
        const trajectoireIcon = dayData.cycle_trajectoire.includes('Montante') ? '📈' : '📉';
        const illuminationIcon = dayData.cycle_illumination.includes('Croissante') ? '🌒' : '🌘';
        
        detailedInfo = `
            <div class="info-item">
                <div class="info-label">Illumination</div>
                <div class="info-value">${illuminationIcon} ${dayData.cycle_illumination}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Trajectoire</div>
                <div class="info-value">${trajectoireIcon} ${dayData.cycle_trajectoire}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Position lunaire</div>
                <div class="info-value">🌙 ${dayData.moon_position_start}° - ${dayData.moon_position_end}°</div>
            </div>
        `;
    }

    return `
        <div class="day-card">
            <div class="day-header">
                <div class="day-title">
                    <div class="calendar-icon">
                        <div class="calendar-month">${month}</div>
                        <div class="calendar-day">${day}</div>
                    </div>
                    ${dayData.date}
                </div>
                <div class="lunar-info">
                    ${basicInfo}
                    ${detailedInfo}
                </div>
            </div>
            <div class="day-content">
                ${nodesHtml}
                ${periodsHtml}
            </div>
        </div>
    `;
}

// Gestion des boutons de ville
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser la ville depuis l'URL
    currentCity = getUrlCity();
    
    const cityButtons = document.querySelectorAll('.city-btn');
    
    // Activer le bon bouton selon l'URL
    cityButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.city === currentCity) {
            btn.classList.add('active');
        }
    });
    
    // Mettre à jour les coordonnées selon la ville sélectionnée
    const cityData = cities[currentCity];
    
    cityButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Désactiver tous les boutons
            cityButtons.forEach(b => b.classList.remove('active'));
            
            // Activer le bouton cliqué
            this.classList.add('active');
            
            const selectedCity = this.dataset.city;
            currentCity = selectedCity;
            
            // Mettre à jour l'URL
            updateURL(selectedCity);
            
            // Recharger les données
            loadLunarInfo();
        });
    });
});

async function loadLunarInfo() {
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    
    loading.style.display = 'block';
    results.innerHTML = '';

    try {
        const days = 7; // Toujours afficher 7 jours
        const traditional = document.getElementById('traditional').checked;
        
        // Charger les données JSON pré-générées
        const response = await fetch(`lunar_data_${currentCity}.json`);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        loading.style.display = 'none';
        
        if (data.success) {
            // Afficher la date de génération
            const updateTime = new Date(data.generated_at).toLocaleString('fr-FR');
            document.getElementById('lastUpdate').textContent = updateTime;
            
            // Sélectionner les données selon le type de zodiaque
            const selectedData = traditional ? data.traditional : data.constellation;
            const limitedData = selectedData.slice(0, days);
            
            results.innerHTML = limitedData.map(renderDay).join('');
        } else {
            results.innerHTML = `<div class="error">Erreur dans les données: ${data.error || 'Données invalides'}</div>`;
        }
    } catch (error) {
        loading.style.display = 'none';
        results.innerHTML = `
            <div class="error">
                <h3>Erreur de chargement</h3>
                <p>Impossible de charger les données lunaires.</p>
                <p><strong>Détails:</strong> ${error.message}</p>
                <p><em>Les données sont générées quotidiennement. Veuillez réessayer plus tard.</em></p>
            </div>
        `;
    }
}

// Chargement automatique au démarrage
window.addEventListener('load', loadLunarInfo);

// Gestion du bouton retour/précédent du navigateur
window.addEventListener('popstate', function() {
    currentCity = getUrlCity();
    
    // Mettre à jour l'interface
    const cityButtons = document.querySelectorAll('.city-btn');
    cityButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.city === currentCity) {
            btn.classList.add('active');
        }
    });
    
    // Mettre à jour les coordonnées
    const cityData = cities[currentCity];
    
    // Recharger les données
    loadLunarInfo();
});

// Mise à jour automatique quand on change les paramètres
document.getElementById('traditional').addEventListener('change', loadLunarInfo);
document.getElementById('detailed').addEventListener('change', loadLunarInfo);
