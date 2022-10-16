// _ = helper functions
const appid = "39bdad575d61fe086ce966346f08b225"
let htmlElements = {}


// 5 TODO: maak updateSun functie

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
    // In de functie moeten we eerst wat zaken ophalen en berekenen.
    // Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
    // Bepaal het aantal minuten dat de zon al op is.
    // Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
    // We voegen ook de 'is-loaded' class toe aan de body-tag.
    // Vergeet niet om het resterende aantal minuten in te vullen.
    // Nu maken we een functie die de zon elke minuut zal updaten
    // Bekijk of de zon niet nog onder of reeds onder is
    // Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
    // PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
};

const makeReadableTimeFromTimeStamp = (time) => {
    return new Date(time * 1000).toLocaleTimeString(['nl-be'], {
        hour: "2-digit",
        minute: "2-digit"
    })
}

const updateTimeOfSun = () => {
    htmlElements.sun.dataset.time =
        new Date().toLocaleTimeString(['nl-be'], {
            hour: '2-digit',
            minute: '2-digit',
        });
}

// place sun on left and bottom position

const placeSun = (sunrise, totalTime)=>{
    const now = new Date()
    const sunriseDate = new Date(sunrise * 1000)
    const minutesLeft =
        now.getHours() * 60 +
        now.getMinutes() -
        (sunriseDate.getHours() * 60 + sunriseDate.getMinutes())
    const percentage =
        (100 / (totalTime.getHours() * 60 + totalTime.getMinutes())) * minutesLeft

    const sunLeftPosition = percentage
    const sunBottomPosition = percentage > 50 ? 100 - percentage : percentage * 2

    htmlElements.sun.style.left = `${sunLeftPosition}%`
    htmlElements.sun.style.bottom = `${sunBottomPosition}%`
   }

// 3 Met de data van de API kunnen we de app opvullen
let showResult = queryResponse => {
    htmlElements.location.innerText = `${queryResponse.city.name}, ${queryResponse.city.country}`
    const sunriseDate = new Date(queryResponse.city.sunrise * 1000)
    htmlElements.sunset.innerText = makeReadableTimeFromTimeStamp(queryResponse.city.sunset);
    htmlElements.sunrise.innerText = makeReadableTimeFromTimeStamp(queryResponse.city.sunrise);

    updateTimeOfSun();
    let timeDifferenceMs =new Date().getTime() - queryResponse.city.sunset * 1000
    const hours = Math.floor(timeDifferenceMs / 1000 / 60 / 60)
    const minutes = Math.floor(timeDifferenceMs / 1000 / 60) - hours * 60
    console.log(hours, minutes)
    if (hours){
    
    }

    // We gaan eerst een paar onderdelen opvullen
    // Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
    // Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
    // Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
    // Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
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
    init();


});
