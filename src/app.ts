import { GOOGLE_API } from './KEYS'
import axios from 'axios'

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
    // console.log(res)
    if (res.data.status !== 'OK') {
      throw new Error('Could not fetch location')
    }
    const coordinates = res.data.results[0].geometry.location
    console.log(coordinates)
  }).catch(err => {
    alert(err.message)
    console.log(err)
  })
}

form?.addEventListener('submit', searchAddressHandler)!;