import { useState, useRef } from "react";
import {Marker, Tooltip} from "react-leaflet"
import {Icon} from "leaflet"
import axios from "axios"

  const customIconOff = new Icon({
    iconUrl: require("../icons/location.png"),
    iconSize: [38, 38]
  })
  const customIconOn = new Icon({
    iconUrl: require("../icons/pin.png"),
    iconSize: [38, 38]
  })
  const customIcon = [customIconOff, customIconOn]

  const asso = sessionStorage.getItem('selectedAsso')
  //console.log("customMarker", asso)
 
  
  export function CustomMarker({coords, status, message}) {
    const center = {
      lat: coords[0],
      lng: coords[1],
    }  

    //Check the DB and get the status of the markers
    const reqDone = useRef(false);
    const updateMarkersWithDB = () =>
      {
        if(!reqDone.current)
          {
            if (sessionStorage.getItem("selectedAsso"))
              {
            reqDone.current = true; //to make sure the DB call only gets made once when we initialise the marker
                let currentMarker = 
                  {
                    AssoID: sessionStorage.getItem("selectedAsso"),
                    Latitude: center["lat"],
                    Longitude: center["lng"],
                  } //we'll use that object to find the current marker in the DB and get its status if the marker
                  //isn't in the DB yet, we'lle get a "DNE" response and ignore it (the marker will be false anyways)
    
                axios
                .post("http://localhost:8082/api/getmarker", currentMarker)
                .then( (res) => 
                  { 
                    if (res.data== true) //if the marker is in the DB and its flag is set to true
                      {
                        console.log(res.data)
                        setIconStatus((iconStatus+1)%2)
                      }
                  })
                  .catch( (err) => { console.log(err) });   
          }      
        }
      }
    updateMarkersWithDB();


    const [iconStatus, setIconStatus] = useState(status ? 1: 0);
    const markerRef = useRef(null)
    const eventHandlers = 
      {
        click() {
          setIconStatus((iconStatus+1)%2)
          sendToDB();
        },

      }
      
    // This function gets the lat and lng of the current marker as well as its status and updates 
    // (or adds if it doesn't already exist) the marker in the DB 
    const sendToDB = () =>
      {
        let currentMarker = 
          {
            AssoID: sessionStorage.getItem("selectedAsso"),
            Latitude: center["lat"],
            Longitude: center["lng"],
            Status: !iconStatus
          }
          console.log(sessionStorage.getItem("selectedAsso"))
        axios
          .post('http://localhost:8082/api/updatemarker', currentMarker)
          .then((res) => {
              console.log(res)
          })
          .catch((err) => {
            console.log(err);
          });
      }

  
    return (
      <Marker
        draggable={false}
        eventHandlers={eventHandlers}
        position={center}
        icon={customIcon[iconStatus]}
        ref={markerRef}>
        <Tooltip minWidth={90}>
          <span>
           {message}
          </span>
        </Tooltip>
      </Marker>
    )
  }
  