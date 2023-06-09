//import "./styles.css";
import "leaflet/dist/leaflet.css";
import "./Map.css"
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from 'leaflet';
import { CustomMarker } from './CustomMarker'
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import mapData from '../data/mapData.json'

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

function getMarker(markerInfo) {
  return (
    <CustomMarker coords={markerInfo.position} message={markerInfo.tooltip} status={false} />
  )
}

function loadJsonData() {
  const data = JSON.parse(JSON.stringify(mapData))
  return data;
}

export function Map() {
  console.log("res:", loadJsonData());
  const data = loadJsonData();
  if(sessionStorage.getItem("selectedAsso"))
    {
      return (
        <MapContainer center={[45.784296, 4.876554]} zoom={16}>
          <TileLayer
            attribution='&copy; <a href="https://www.flaticon.com/free-icons/pin" title="pin icons">Pin icons created by Those Icons - Flaticon</a>, <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {data.map(entry => (getMarker(entry)))}
        </MapContainer>
      );  
    }
    else if (sessionStorage.getItem('userData')) return (<p style={{textAlign: "center"}}>Veuillez choisir l'association dont vous voulez afficher la carte.</p>)
  else return (<p style={{textAlign: "center"}}>Vous devez vous connecter pour accéder à la carte.</p>)
}



