// _ = helper functions
const appid = "39bdad575d61fe086ce966346f08b225"
let htmlElements = {}
let sunTiming = {}
const timeout = 60000; // change how fast the sun moves


const makeReadableTimeFromTimeStamp = (time) => {
    return new Date(time * 1000).toLocaleTimeString(['nl-be'], {
        hour: "2-digit", minute: "2-digit"
    })
}

const updateTimeOfSun = (now) => {
    htmlElements.sun.dataset.time = new Date(now).toLocaleTimeString(['nl-be'], {
        hour: '2-digit', minute: '2-digit',
    });
}

// place sun on left and bottom position
const placeSun = (currentMs) => {
    // calculate the percentage of the day that has passed
    console.log(currentMs)
    const percentageOfDayPassed = (currentMs - sunTiming.sunriseMs) / (sunTiming.sunsetMs - sunTiming.sunriseMs)
    const sunLeftPosition = percentageOfDayPassed * 100
    // make curve for bottom position where 0% is lowest, 50% is highest and 100% is lowest again
    const sunBottomPosition = Math.sin(Math.PI * percentageOfDayPassed) * 100;
    console.log(sunBottomPosition, "sunBottomPosition")

    htmlElements.sun.style.left = `${sunLeftPosition}%`;
    htmlElements.sun.style.bottom = `${sunBottomPosition}%`;
}

const updateTimeLeft = (now) => {
    let timeDifferenceMs = sunTiming.sunsetMs - new Date(now).getTime()
    const hours = Math.floor(timeDifferenceMs / 1000 / 60 / 60)
    const minutes = Math.floor(timeDifferenceMs / 1000 / 60) - hours * 60
    if (hours < 0) {
        htmlElements.timeLeft.innerText = "No more"
    } else {
        htmlElements.timeLeft.innerText = hours !== 0 ? `${hours} hours and ${minutes} minutes` : `${minutes} minutes`
    }
}


async function checkNight(now) {
    if (now > sunTiming.sunsetMs || now < sunTiming.sunriseMs) {
        document.documentElement.classList.add('is-night')
        document.documentElement.classList.remove('is-day')
    } else {
        document.documentElement.classList.remove('is-night')
        document.documentElement.classList.add('is-day')
    }
    // also check if a new day has started
    if (now > sunTiming.sunsetMs) {
        // get new data
        showResult(await getAPI(50.8027841, 3.2097454))
    }
    return true
}

let globalNow = new Date().getTime();

let startLoop = () => {
    setInterval(() => {
        globalNow += 60000;
        const now = globalNow;
        updateTimeOfSun(now);
        placeSun(now);
        updateTimeLeft(now);
        checkNight(now).catch((e) => console.error(e));
    }, timeout)
}


// 3 Met de data van de API kunnen we de app opvullen
let showResult = queryResponse => {
    htmlElements.location.innerText = `${queryResponse.city.name}, ${queryResponse.city.country}`
    htmlElements.sunset.innerText = makeReadableTimeFromTimeStamp(queryResponse.city.sunset);
    htmlElements.sunrise.innerText = makeReadableTimeFromTimeStamp(queryResponse.city.sunrise);
    sunTiming.sunriseMs = queryResponse.city.sunrise * 1000;
    sunTiming.sunsetMs = queryResponse.city.sunset * 1000;
    sunTiming.diff = sunTiming.sunsetMs - sunTiming.sunriseMs;
    const now = new Date().getTime();
    updateTimeOfSun(now);
    updateTimeLeft(now);
    checkNight(now).catch((e) => console.error(e));
    placeSun(new Date().getTime())
    startLoop();

};


const getData = (endpoint) => {
    return fetch(endpoint)
        .then((r) => r.json())
        .catch((e) => console.error(e))
}

const getEndpoint = (lat, lon) => {
    return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${appid}`
}

let getAPI = async (lat, lon) => {
    const data = await getData(getEndpoint(lat, lon))
    console.log(data)
    return data
}

const init = async () => {
    console.log("Init")
    htmlElements.location = document.querySelector('.js-location')
    htmlElements.sunrise = document.querySelector('.js-sunrise')
    htmlElements.sunset = document.querySelector('.js-sunset')
    htmlElements.sun = document.querySelector('.js-sun')
    htmlElements.timeLeft = document.querySelector('.js-time-left')
    if (!htmlElements.location || !htmlElements.sunrise || !htmlElements.sunset || !htmlElements.sun || !htmlElements.timeLeft) {
        throw("Dom element niet gevonden")
    }
    const data = await getAPI(50.8027841, 3.2097454);
    showResult(data)

}


document.addEventListener('DOMContentLoaded', function () {
    // 1 We will query the API with longitude and latitude.
    init().catch((e) => console.error(e));


});
