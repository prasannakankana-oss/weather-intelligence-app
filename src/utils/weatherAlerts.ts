import { WeatherForecastResponse, UserSettings } from '../types';
import { convertTemp, convertWindSpeed } from './weatherUtils';

export interface WeatherAlert {
  id: string;
  type: 'thunderstorm' | 'heavy_rain' | 'heavy_snow' | 'high_wind' | 'extreme_heat' | 'extreme_cold' | 'dense_fog' | 'extreme_uv';
  severity: 'severe' | 'warning' | 'advisory';
  title: string;
  description: string;
  timing: string;
  recommendation: string;
  dateStr: string;
  locationName?: string;
  metricValue?: string;
}

/**
 * Evaluates the 7-day forecast dataset to detect severe or significant weather events.
 * Triggers alerts ONLY for significant events and NOT for routine weather changes.
 */
export function detectWeatherAlerts(
  data: WeatherForecastResponse,
  settings: UserSettings,
  cityName: string
): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];
  const daily = data.daily;
  const hourly = data.hourly;

  if (!daily || !daily.time) return alerts;

  const alertKeysSeen = new Set<string>();

  for (let i = 0; i < Math.min(7, daily.time.length); i++) {
    const dateStr = daily.time[i];
    const dateObj = new Date(dateStr);
    
    let timingLabel = '';
    if (i === 0) {
      timingLabel = 'Expected Today';
    } else if (i === 1) {
      timingLabel = 'Expected Tomorrow';
    } else {
      const dayName = dateObj.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
      timingLabel = `Expected on ${dayName}`;
    }

    // Try to find peak timing from hourly data if available
    let peakTiming = '';
    if (hourly && hourly.time) {
      const dayHours = hourly.time.map((t, idx) => ({ t, idx })).filter(item => item.t.startsWith(dateStr));
      if (dayHours.length > 0) {
        // Look for severe hours
        const severeHours = dayHours.filter(item => {
          const code = hourly.weather_code[item.idx] || 0;
          const gust = hourly.wind_speed_10m?.[item.idx] || 0;
          const precip = hourly.precipitation?.[item.idx] || 0;
          return [95, 96, 99].includes(code) || gust >= 45 || precip >= 8;
        });

        if (severeHours.length > 0) {
          const firstHour = new Date(severeHours[0].t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
          const lastHour = new Date(severeHours[severeHours.length - 1].t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
          peakTiming = ` (Peak: ${firstHour} - ${lastHour})`;
        }
      }
    }

    const fullTiming = `${timingLabel}${peakTiming}`;

    const code = daily.weather_code[i];
    const maxTempC = daily.temperature_2m_max[i];
    const minTempC = daily.temperature_2m_min[i];
    const apparentMaxC = daily.apparent_temperature_max[i] ?? maxTempC;
    const apparentMinC = daily.apparent_temperature_min[i] ?? minTempC;
    const precipSum = daily.precipitation_sum[i] || 0;
    const rainProb = daily.precipitation_probability_max?.[i] ?? 0;
    const snowfallSum = daily.snowfall_sum?.[i] || 0;
    const windGusts = daily.wind_gusts_10m_max[i] || daily.wind_speed_10m_max[i] || 0;
    const uvMax = daily.uv_index_max[i] || 0;

    // 1. Severe Thunderstorm Check
    if ([95, 96, 99].includes(code)) {
      const alertKey = `thunderstorm-${dateStr}`;
      if (!alertKeysSeen.has(alertKey)) {
        alertKeysSeen.add(alertKey);
        alerts.push({
          id: alertKey,
          type: 'thunderstorm',
          severity: 'severe',
          title: 'Severe Thunderstorm Warning',
          description: `Thunderstorm activity with potential lightning and localized heavy rain forecast for ${cityName}.`,
          timing: fullTiming,
          recommendation: 'Seek sturdy indoor shelter immediately, avoid open outdoor fields, and stay away from windows and metallic structures.',
          dateStr,
          locationName: cityName,
          metricValue: `Weather Code ${code}`
        });
      }
    }

    // 2. Heavy Rain / Torrential Precipitation Check
    if (precipSum >= 20 || (rainProb >= 80 && precipSum >= 12) || [65, 82].includes(code)) {
      const alertKey = `heavy_rain-${dateStr}`;
      if (!alertKeysSeen.has(alertKey)) {
        alertKeysSeen.add(alertKey);
        alerts.push({
          id: alertKey,
          type: 'heavy_rain',
          severity: 'warning',
          title: 'Heavy Rainfall & Flood Watch',
          description: `Significant precipitation sum of ${precipSum.toFixed(1)} mm with ${rainProb}% rain probability expected in ${cityName}.`,
          timing: fullTiming,
          recommendation: 'Carry a heavy-duty umbrella or waterproof raincoat, avoid low-lying roads prone to flash flooding, and allow extra commute travel time.',
          dateStr,
          locationName: cityName,
          metricValue: `${precipSum.toFixed(1)} mm Rain`
        });
      }
    }

    // 3. Heavy Snowfall Check
    if (snowfallSum >= 4 || [73, 75, 85, 86].includes(code)) {
      const alertKey = `heavy_snow-${dateStr}`;
      if (!alertKeysSeen.has(alertKey)) {
        alertKeysSeen.add(alertKey);
        alerts.push({
          id: alertKey,
          type: 'heavy_snow',
          severity: 'warning',
          title: 'Heavy Snowfall Alert',
          description: `Accumulating snowfall of ${snowfallSum.toFixed(1)} cm forecast for ${cityName}.`,
          timing: fullTiming,
          recommendation: 'Dress warmly in heavy insulated winter layers, equip snow tires or chains if driving, and avoid non-essential long-distance travel.',
          dateStr,
          locationName: cityName,
          metricValue: `${snowfallSum.toFixed(1)} cm Snow`
        });
      }
    }

    // 4. High Wind Gusts Check
    const convertedWindGusts = convertWindSpeed(windGusts, settings.windUnit);
    if (windGusts >= 48) {
      const alertKey = `high_wind-${dateStr}`;
      if (!alertKeysSeen.has(alertKey)) {
        alertKeysSeen.add(alertKey);
        alerts.push({
          id: alertKey,
          type: 'high_wind',
          severity: 'warning',
          title: 'High Wind Gust Warning',
          description: `Severe wind gusts up to ${convertedWindGusts} ${settings.windUnit} forecast across ${cityName}.`,
          timing: fullTiming,
          recommendation: 'Secure loose outdoor items, watch for falling tree branches or debris, and maintain a firm grip on steering wheels when driving high-profile vehicles.',
          dateStr,
          locationName: cityName,
          metricValue: `${convertedWindGusts} ${settings.windUnit}`
        });
      }
    }

    // 5. Extreme Heat Check
    const formattedMaxTemp = `${convertTemp(maxTempC, settings.tempUnit)}°${settings.tempUnit}`;
    const formattedApparentMax = `${convertTemp(apparentMaxC, settings.tempUnit)}°${settings.tempUnit}`;
    if (maxTempC >= 34 || apparentMaxC >= 37) {
      const alertKey = `extreme_heat-${dateStr}`;
      if (!alertKeysSeen.has(alertKey)) {
        alertKeysSeen.add(alertKey);
        alerts.push({
          id: alertKey,
          type: 'extreme_heat',
          severity: 'warning',
          title: 'Extreme Heat Advisory',
          description: `Dangerous heat index with temperatures reaching ${formattedMaxTemp} (feels like ${formattedApparentMax}) in ${cityName}.`,
          timing: fullTiming,
          recommendation: 'Stay hydrated with electrolyte fluids, remain in air-conditioned environments during peak afternoon hours, wear lightweight clothing, and never leave children or pets in parked vehicles.',
          dateStr,
          locationName: cityName,
          metricValue: formattedMaxTemp
        });
      }
    }

    // 6. Extreme Cold / Hard Freeze Check
    const formattedMinTemp = `${convertTemp(minTempC, settings.tempUnit)}°${settings.tempUnit}`;
    if (minTempC <= -5 || apparentMinC <= -8) {
      const alertKey = `extreme_cold-${dateStr}`;
      if (!alertKeysSeen.has(alertKey)) {
        alertKeysSeen.add(alertKey);
        alerts.push({
          id: alertKey,
          type: 'extreme_cold',
          severity: 'warning',
          title: 'Hard Freeze & Severe Cold Alert',
          description: `Sub-zero freezing temperatures dropping to ${formattedMinTemp} forecast for ${cityName}.`,
          timing: fullTiming,
          recommendation: 'Dress warmly in multiple thermal layers, cover all exposed skin to avoid frostbite, protect sensitive outdoor plants, and insulate exposed water pipes.',
          dateStr,
          locationName: cityName,
          metricValue: formattedMinTemp
        });
      }
    }

    // 7. Dense Fog Check
    if ([45, 48].includes(code)) {
      const alertKey = `dense_fog-${dateStr}`;
      if (!alertKeysSeen.has(alertKey)) {
        alertKeysSeen.add(alertKey);
        alerts.push({
          id: alertKey,
          type: 'dense_fog',
          severity: 'advisory',
          title: 'Dense Fog & Visibility Advisory',
          description: `Thick fog layer restricting ground visibility in ${cityName}.`,
          timing: fullTiming,
          recommendation: 'Drive with low-beam fog lights, slow down, increase following distance behind vehicles, and stay alert at intersections.',
          dateStr,
          locationName: cityName,
          metricValue: 'Low Visibility'
        });
      }
    }

    // 8. Extreme UV Risk Check
    if (uvMax >= 9) {
      const alertKey = `extreme_uv-${dateStr}`;
      if (!alertKeysSeen.has(alertKey)) {
        alertKeysSeen.add(alertKey);
        alerts.push({
          id: alertKey,
          type: 'extreme_uv',
          severity: 'advisory',
          title: 'Extreme UV Index Hazard',
          description: `Peak UV radiation index reaching ${uvMax.toFixed(1)} in ${cityName}.`,
          timing: fullTiming,
          recommendation: 'Apply broad-spectrum SPF 50+ sunscreen, wear UV-blocking sunglasses and a broad-brimmed hat, and seek shade between 10:00 AM and 16:00 PM.',
          dateStr,
          locationName: cityName,
          metricValue: `UV ${uvMax.toFixed(1)}`
        });
      }
    }
  }

  return alerts;
}
