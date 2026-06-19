/* =========================
    CONFIGURACIÓN CLIMA
========================= */
const LAT = 14.5058863;
const LON = -90.5668671;
const TIMEZONE = "America/Guatemala";
const TARGET_DATE = "2026-07-11";

function mapWeatherCode(code) {
    const map = {
        0: ["Despejado", "☀️"],
        1: ["Principalmente despejado", "🌤️"],
        2: ["Parcialmente nublado", "⛅"],
        3: ["Nublado", "☁️"],
        45: ["Niebla", "🌫️"],
        48: ["Escarcha", "🌫️"],
        51: ["Llovizna ligera", "🌦️"],
        53: ["Llovizna moderada", "🌧️"],
        55: ["Llovizna intensa", "🌧️"],
        61: ["Lluvia ligera", "🌧️"],
        63: ["Lluvia", "🌧️"],
        65: ["Lluvia fuerte", "🌧️"],
        80: ["Chubascos", "⛈️"],
        95: ["Tormenta", "⛈️"]
    };
    return map[code] || ["Sin datos", "❓"];
}

async function fetchForecastForDate(lat, lon, date) {
    // CORRECCIÓN: "wind_speed_10m_max" en lugar de "windspeed_10m_max"
    const dailyParams = [
        "temperature_2m_max",
        "temperature_2m_min",
        "precipitation_sum",
        "wind_speed_10m_max", 
        "weathercode"
    ].join(",");

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=${encodeURIComponent(TIMEZONE)}&daily=${dailyParams}&start_date=${date}&end_date=${date}`;

    const resp = await fetch(url);
    if (!resp.ok) {
        throw new Error(`Error en la petición: ${resp.statusText}`);
    }
    const data = await resp.json();
    return data.daily;
}

async function initWeatherWidget() {
    try {
        const daily = await fetchForecastForDate(LAT, LON, TARGET_DATE);
        
        if (!daily || !daily.temperature_2m_max) {
            console.error("La API no retornó datos válidos para esa fecha.");
            return;
        }

        const idx = 0;
        
        // 1. Inyectar Temperaturas
        if(document.getElementById("temp")) {
            document.getElementById("temp").textContent = `${Math.round(daily.temperature_2m_max[idx])}°C / ${Math.round(daily.temperature_2m_min[idx])}°C`;
        }
        
        // 2. Inyectar Precipitación
        if(document.getElementById("prec")) {
            document.getElementById("prec").textContent = `${daily.precipitation_sum[idx]} mm`;
        }
        
        // 3. Inyectar Viento (Nota el cambio de nombre también aquí al leer el objeto)
        if(document.getElementById("wind")) {
            document.getElementById("wind").textContent = `${daily.wind_speed_10m_max[idx]} km/h`;
        }
        
        // 4. Inyectar Humedad (Open-Meteo daily no da humedad, se queda fijo o requiere parámetro "hourly")
        if(document.getElementById("hum")) {
            document.getElementById("hum").textContent = "—%"; 
        }

        // 5. EXTRA: Mostrar el Estado del clima (Aprovechando tu función mapWeatherCode)
        if(document.getElementById("status")) {
            const [weatherText, weatherIcon] = mapWeatherCode(daily.weathercode[idx]);
            document.getElementById("status").textContent = `${weatherIcon} ${weatherText}`;
        }

    } catch (e) {
        console.error("Error clima:", e);
    }
}

// Inicializar
window.addEventListener("DOMContentLoaded", initWeatherWidget);
setInterval(initWeatherWidget, 3 * 60 * 60 * 1000);

/* =========================
    ANIMACIONES SCROLL
========================= */
const scrollElements = document.querySelectorAll('.scroll-section');

const elementInView = (el, dividend = 1.25) => {
    const elementTop = el.getBoundingClientRect().top;
    return elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend;
};

const handleScrollAnimation = () => {
    scrollElements.forEach(el => {
        if (elementInView(el)) el.classList.add('section-visible');
    });
};

window.addEventListener('scroll', handleScrollAnimation);
document.addEventListener('DOMContentLoaded', handleScrollAnimation);

/* =========================
    CONTADOR
========================= */
const countdown = () => {
    const eventDate = new Date('Jul 11, 2026 15:00:00').getTime();
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) return;

    document.getElementById('days').innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
    document.getElementById('hours').innerText = Math.floor((distance / (1000 * 60 * 60)) % 24);
    document.getElementById('minutes').innerText = Math.floor((distance / (1000 * 60)) % 60);
    document.getElementById('seconds').innerText = Math.floor((distance / 1000) % 60);
};

setInterval(countdown, 1000);
countdown();

/* =========================
    PERSONALIZACIÓN URL
========================= */
function obtenerParametroURL(nombre) {
    return new URLSearchParams(window.location.search).get(nombre);
}

document.addEventListener('DOMContentLoaded', () => {
    const nombreInvitado = obtenerParametroURL('nombre');
    const cuposDisponibles = obtenerParametroURL('cupos');
    const MesaAsignada = obtenerParametroURL('Mesa');

    if (nombreInvitado) {
        document.getElementById('nombre-personalizado').textContent =
            nombreInvitado.replace(/_/g, ' ');
    }

    if (cuposDisponibles) {
        document.getElementById('solo-numero-cupos').textContent = cuposDisponibles;
    }

    if (MesaAsignada) {
        document.getElementById('mesa-asignada').textContent = MesaAsignada;
    }
});

/* =========================
    INTRO CON DOBLE VIDEO
========================= */
document.addEventListener("DOMContentLoaded", () => {

    const loopVideo = document.getElementById("intro-video");
    const overlay = document.getElementById("intro-overlay");
    const music = document.getElementById("background-music");

    document.body.style.overflow = "hidden";

    const transitionVideo = document.createElement("video");
    transitionVideo.src = "https://www.dropbox.com/scl/fi/3nvdwu1qdppn4wb1urij6/Comp-1.mp4?rlkey=2mfis1s0dyptzacxusm0d6a1q&st=xwniqsn6&raw=1";
    transitionVideo.playsInline = true;
    transitionVideo.autoplay = false;
    transitionVideo.style.position = "fixed";
    transitionVideo.style.inset = "0";
    transitionVideo.style.width = "100%";
    transitionVideo.style.height = "100%";
    transitionVideo.style.objectFit = "cover";
    transitionVideo.style.zIndex = "10000";
    transitionVideo.style.display = "none";

    document.body.appendChild(transitionVideo);

    overlay.addEventListener("click", () => {

        loopVideo.pause();
        loopVideo.style.display = "none";

        transitionVideo.style.display = "block";
        transitionVideo.play();

        transitionVideo.onended = () => {
            transitionVideo.classList.add("fade-out");

            setTimeout(() => {
                transitionVideo.remove();
                overlay.remove();
                music.play().catch(()=>{});
                document.body.style.overflow = "auto";
            }, 1000);
        };

    }, { once: true });
});

/* =========================
    VIDEO SECCIÓN 3
========================= */
const seccion3 = document.getElementById('seccion3');
const videoSeccion3 = document.getElementById('video-seccion3');

if (seccion3 && videoSeccion3) {
    const observerVideo = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                videoSeccion3.style.display = 'block';
                videoSeccion3.play().catch(()=>{});
            } else {
                videoSeccion3.pause();
                videoSeccion3.style.display = 'none';
            }
        });
    }, { threshold: 0.5 });

    observerVideo.observe(seccion3);
}

/* =========================
    COLLAGE DE FOTOS
========================= */

const photos = document.querySelectorAll(".photo");
const heart = document.getElementById("heart");

let heartAnimated = false;

const heartPositions = [

    {x:44,y:20},
    {x:56,y:20},

    {x:36,y:30},
    {x:44,y:34},
    {x:56,y:34},
    {x:64,y:30},

    {x:30,y:42},
    {x:40,y:44},
    {x:50,y:46},
    {x:60,y:44},
    {x:70,y:42},

    {x:36,y:58},
    {x:44,y:60},
    {x:56,y:60},
    {x:64,y:58},

    {x:40,y:74},
    {x:50,y:76},
    {x:60,y:74},

    {x:46,y:88},
    {x:54,y:88}

];

window.addEventListener("scroll", animatePhotos);
window.addEventListener("resize", animatePhotos);

function animatePhotos(){

    const maxScroll =
        document.body.scrollHeight - window.innerHeight;

    const progress =
        window.scrollY / maxScroll;

    const segment =
        1 / photos.length;

    photos.forEach((photo,index)=>{

        const start =
            segment * index;

        let localProgress =
            (progress - start) / segment;

        localProgress =
            Math.max(0, Math.min(localProgress,1));

        const fadeProgress =
            Math.min(localProgress / 0.4, 1);

        const moveProgress =
            Math.max(
                0,
                (localProgress - 0.4) / 0.6
            );

        const finalX =
            heartPositions[index].x;

        const finalY =
            heartPositions[index].y;

        const currentX =
            50 + (finalX - 50) * moveProgress;

        const currentY =
            50 + (finalY - 50) * moveProgress;

        const maxSize =
            Math.min(window.innerWidth * 0.75, 320);

        const minSize =
            Math.min(window.innerWidth * 0.18, 90);

        const size =
            maxSize -
            ((maxSize - minSize) * moveProgress);

        const rotation =
            ((index % 2 === 0) ? -8 : 8)
            * moveProgress;

        photo.style.opacity = fadeProgress;

        photo.style.width = `${size}px`;
        photo.style.height = `${size}px`;

        photo.style.left = `${currentX}%`;
        photo.style.top = `${currentY}%`;

        photo.style.transform =
        `translate(-50%, -50%)
         scale(${0.8 + fadeProgress * 0.2})
        rotate(${rotation}deg)`;
    });

    if(progress > 0.97 && !heartAnimated){

        heart.classList.add("heartbeat");

        heartAnimated = true;

        setTimeout(()=>{
            heart.classList.remove("heartbeat");
        },1000);

    }

    if(progress < 0.9){
        heartAnimated = false;
    }
}

animatePhotos();