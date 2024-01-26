const apiKey = '2a5e0aa7871e1d4fec085b278d303cf4';
const locButton = document.querySelector('.loc-button');
const todiaInfo = document.querySelector('.toinfo-dia');
const climaHoyIcon = document.querySelector('.temp-hoy i');
const todiaTemp = document.querySelector('.temp-clima');
const diasList = document.querySelector('.lista-dias');

const climaIconMap = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'sun',
    '02n': 'moon',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloud',
    '04n': 'cloud',
    '09d': 'cloud-rain',
    '09n': 'cloud-rain',
    '10d': 'cloud-rain',
    '10n': 'cloud-rain',
    '11d': 'cloud-lightning',
    '11n': 'cloud-lightning',
    '13d': 'cloud-snow',
    '13n': 'cloud-snow',
    '50d': 'water',
    '50n': 'water'
};

function fetchclimaData(locacion) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${locacion}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            updateUI(data);
        })
        .catch(error => {
            alert(`Error fetching clima data: ${error} (Api Error)`);
        });
}

function updateUI(data) {
    const climaHoy = data.list[0].weather[0].description;
    const temperaturaHoy = `${Math.round(data.list[0].main.temp)}°C`;
    const climaHoyIconCode = data.list[0].weather[0].icon;

    todiaInfo.querySelector('h2').textContent = new Date().toLocaleDateString('es', { weekday: 'long' });
    todiaInfo.querySelector('span').textContent = new Date().toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });
    climaHoyIcon.className = `bx bx-${climaIconMap[climaHoyIconCode]}`;
    todiaTemp.textContent = temperaturaHoy;

    const locacionElement = document.querySelector('.toinfo-dia > div > span');
    locacionElement.textContent = `${data.city.name}, ${data.city.country}`;

    // Traducción de la descripción del clima
    const climaHoyTraducido = traducirDescripcionClima(climaHoy);
    const climaDescriptionElement = document.querySelector('.temp-hoy > h3');
    climaDescriptionElement.textContent = climaHoyTraducido;

    const todiaPrecipitaciones = `${data.list[0].pop}%`;
    const todiaHumedad = `${data.list[0].main.humidity}%`;
    const todiaVientoVelocidad = `${data.list[0].wind.speed} km/h`;

    const diaInfoContainer = document.querySelector('.info-dia');
    diaInfoContainer.innerHTML = `
        <div>
            <span class="title">Precipitaciones</span>
            <span class="value">${todiaPrecipitaciones}</span>
        </div>
        <div>
            <span class="title">Humedad</span>
            <span class="value">${todiaHumedad}</span>
        </div>
        <div>
            <span class="title">Velocidad del viento</span>
            <span class="value">${todiaVientoVelocidad}</span>
        </div>
    `;

    const todia = new Date();
    const proxDiasData = data.list.slice(1);

    const uniquedias = new Set();
    let count = 0;
    diasList.innerHTML = '';
    for (const diaData of proxDiasData) {
        const forecastDate = new Date(diaData.dt_txt);
        const diaAbbreviation = forecastDate.toLocaleDateString('es', { weekday: 'short' });
        const diaTemp = `${Math.round(diaData.main.temp)}°C`;
        const iconCode = diaData.weather[0].icon;

        if (!uniquedias.has(diaAbbreviation) && forecastDate.getDate() !== todia.getDate()) {
            uniquedias.add(diaAbbreviation);
            diasList.innerHTML += `
                <li>
                    <i class='bx bx-${climaIconMap[iconCode]}'></i>
                    <span>${diaAbbreviation}</span>
                    <span class="temp-dia">${diaTemp}</span>
                </li>
            `;
            count++;
        }

        if (count === 4) break;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const defaultlocacion = 'Buenos Aires, Argentina';
    fetchclimaData(defaultlocacion);
});

locButton.addEventListener('click', () => {
    const locacion = prompt('Ingrese una locación:');
    if (!locacion) return;

    fetchclimaData(locacion);
});

function traducirDescripcionClima(ingles) {
    const traducciones = {
        'clear sky': 'cielo despejado',
        'few clouds': 'pocas nubes',
        'scattered clouds': 'nubes dispersas',
        'broken clouds': 'nubes rotas',
        'shower rain': 'lluvia',
        'rain': 'lluvia',
        'thunderstorm': 'tormenta',
        'snow': 'nieve',
        'mist': 'niebla'
    };

    return traducciones[ingles] || ingles; 
}