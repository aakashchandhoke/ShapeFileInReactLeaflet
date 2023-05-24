import { useEffect, useState, useCallback } from 'react'
import { MapContainer, TileLayer, LayersControl, Marker, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
// Retrieve all Leaflet Default Icon options from CSS, in particular all icon images URL's, to improve compatibility with bundlers and frameworks that modify URL's in CSS. 
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { ShapeFile } from './ShapeFile';

import colorbrewer from 'colorbrewer';

var iconv = require('iconv-lite');




const MyMap = () => {

  const center = [37.983810, 23.727539]
  const zoom = 7


  const [geodata, setGeodata] = useState(null);
  const [map, setMap] = useState(null)
  const [position, setPosition] = useState(map ? map.getCenter() : { lat: center[0], lng: center[1] })

  const { BaseLayer, Overlay } = LayersControl;

  const handleFile = (e) => {
    var reader = new FileReader();
    var file = e.target.files[0];
    reader.readAsArrayBuffer(file);
    reader.onload = function (buffer) {
      setGeodata({ data: buffer.target.result, name: file.name });
    }
  }

  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      layer.bindPopup(Object.keys(feature.properties).map(function (k) {
        if (k === '__color__') {
          return;
        }
        return k + ": " + feature.properties[k];
      }).join("<br />"), {
        maxHeight: 200
      });
    }
  }

  const style = (feature) => {
    return ({
      opacity: 1,
      fillOpacity: 0.7,
      radius: 6,
      weight: 2,
      dashArray: "2",
      color: colorbrewer.Spectral[11][Math.ceil(Math.random() * 1000) % 11]

    });
  }




  let ShapeLayers = null;
  if (geodata !== null) {
    ShapeLayers = (
      <Overlay checked name={geodata.name}>
        <ShapeFile
          data={geodata.data}
          style={style}
          onEachFeature={onEachFeature}
        />
      </Overlay>);
        
  }

  return (
    <>

      <div>
        Upload ShapeFile (.zip): <input type="file" accept=".zip" onChange={handleFile} className="inputfile" />
      </div>

      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ width: '100vw', height: "91vh" }} whenCreated={setMap}>
        <LayersControl position='topright'>
          {ShapeLayers}
        </LayersControl>
      </MapContainer>
    </>
  );
};

export default MyMap;

