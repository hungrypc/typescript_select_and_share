import { GOOGLE_API } from './KEYS'
import axios from 'axios'

// dynamic loading of gmaps
declare global {
  interface Window {
    initMap: Function;
  }
}
const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API}&callback=initMap`;
script.defer = true;
script.async = true;

window.initMap = function () {
  // JS API is loaded and available
};
document.head.appendChild(script);






const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;

type GoogleGeocodingRes = {
  results: {
    geometry: {
      location: {
        lat: number, lng: number
      }
    }
  }[];
  status: 'OK' | 'ZERO_RESULTS';
}

function searchAddressHandler(event: Event) {
  event.preventDefault()
  const enteredAddress = addressInput.value

  // send to google api
  axios.get<GoogleGeocodingRes>(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
      enteredAddress
    )}&key=${GOOGLE_API}`
  ).then(res => {
    if (res.data.status !== 'OK') {
      throw new Error('Could not fetch location')
    }
    const coordinates = res.data.results[0].geometry.location
    console.log(coordinates)
    const map = new google.maps.Map(document.getElementById("map")!, {
      center: coordinates,
      zoom: 16
    });

    new google.maps.Marker({position: coordinates, map: map});
  }).catch(err => {
    alert(err.message)
    console.log(err)
  })
}

form.addEventListener('submit', searchAddressHandler)!;