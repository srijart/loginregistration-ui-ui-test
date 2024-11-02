import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './ContactFormWithMap.css';
import { useTranslation } from 'react-i18next';

const ContactFormWithMap = () => {
  const mapContainerRef = useRef(null);
  const markerPosition = [17.4416, 78.3825];
  const { t } = useTranslation();

  useEffect(() => {
    const map = L.map(mapContainerRef.current).setView(markerPosition, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const marker = L.marker(markerPosition).addTo(map)
      .bindPopup('PRT SOFTWARE SOLUTIONS')
      .openPopup();

     marker.on('click', () => {
      window.open(`https://www.google.com/maps?q=${markerPosition[0]},${markerPosition[1]}`, '_blank');
    });

     map.on('click', () => {
      window.open(`https://www.google.com/maps?q=${markerPosition[0]},${markerPosition[1]}`, '_blank');
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="contact-section">
      <div className="contact-form">
        <h2>{t('ContactUs')}</h2>
        <form> 
        <p>We are here for you ! How can we help ?</p>

          {/* <label htmlFor="name">{t('FullName')}</label> */}
          <input type="text" id="name" name="name" required placeholder='Name' />

          {/* <label htmlFor="email">{t('Email')}</label> */}
          <input type="email" id="email" name="email" required placeholder='Email'/>

          {/* <label htmlFor="message">{t('Message')}</label> */}
          <textarea id="message" name="message" required placeholder='Message'></textarea>

          <button type="submit">{t('SendMessage')}</button>
        </form>
      </div>

      <div ref={mapContainerRef} className="map"></div>
    </div>
  );
};

export default ContactFormWithMap;
