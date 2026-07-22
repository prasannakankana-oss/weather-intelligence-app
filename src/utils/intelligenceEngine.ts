import { WeatherForecastResponse, PlanningRecommendation, OutdoorScore } from '../types';
import { getWeatherInfo } from './weatherUtils';

export function generateIntelligenceRecommendations(data: WeatherForecastResponse): PlanningRecommendation {
  const current = data.current;
  const hourly = data.hourly;
  const daily = data.daily;

  if (!current) {
    return {
      outdoorScore: {
        overallScore: 50,
        label: 'Fair',
        runningScore: 50,
        cyclingScore: 50,
        diningScore: 50,
        hikingScore: 50,
      },
      clothingSuggestions: ['Dress comfortably for current conditions'],
      gearSuggestions: ['Stay hydrated'],
      healthCautions: [],
      bestOutdoorHours: [],
      commuteAdvisory: 'Normal road conditions expected.',
      summary: 'Weather data loaded successfully.'
    };
  }

  const temp = current.temperature_2m;
  const apparentTemp = current.apparent_temperature;
  const rain = current.rain || 0;
  const precipitation = current.precipitation || 0;
  const wind = current.wind_speed_10m;
  const humidity = current.relative_humidity_2m;
  const uv = current.uv_index;
  const weatherCode = current.weather_code;
  const weatherInfo = getWeatherInfo(weatherCode);

  // 1. Calculate Activity Scores (0-100)
  // Ideal Running: 10°C to 18°C, low wind (<20 km/h), no rain
  let runningScore = 100;
  if (temp < 0) runningScore -= 40;
  else if (temp < 10) runningScore -= (10 - temp) * 3;
  else if (temp > 22) runningScore -= (temp - 22) * 4;
  if (wind > 25) runningScore -= (wind - 25) * 2;
  if (precipitation > 0) runningScore -= 40;
  if (humidity > 75) runningScore -= 15;
  runningScore = Math.max(10, Math.min(100, Math.round(runningScore)));

  // Ideal Cycling: 15°C to 24°C, wind < 15 km/h, clear roads
  let cyclingScore = 100;
  if (temp < 5) cyclingScore -= 45;
  else if (temp > 30) cyclingScore -= 30;
  if (wind > 15) cyclingScore -= (wind - 15) * 3;
  if (precipitation > 0) cyclingScore -= 50;
  cyclingScore = Math.max(10, Math.min(100, Math.round(cyclingScore)));

  // Ideal Outdoor Dining: 18°C to 26°C, clear/partly cloudy, low wind (<15 km/h), no rain
  let diningScore = 100;
  if (temp < 16) diningScore -= (16 - temp) * 6;
  else if (temp > 28) diningScore -= (temp - 28) * 6;
  if (wind > 18) diningScore -= (wind - 18) * 3;
  if (precipitation > 0) diningScore -= 70;
  if (weatherInfo.category === 'cloudy') diningScore -= 10;
  diningScore = Math.max(0, Math.min(100, Math.round(diningScore)));

  // Ideal Hiking: 12°C to 22°C, good visibility, low rain, moderate wind ok
  let hikingScore = 100;
  if (temp < 5) hikingScore -= 35;
  else if (temp > 32) hikingScore -= 45;
  if (precipitation > 0) hikingScore -= 45;
  if (weatherInfo.category === 'fog') hikingScore -= 30;
  if (weatherInfo.category === 'thunder') hikingScore -= 90;
  hikingScore = Math.max(0, Math.min(100, Math.round(hikingScore)));

  const overallScore = Math.round((runningScore + cyclingScore + diningScore + hikingScore) / 4);

  let scoreLabel: OutdoorScore['label'] = 'Fair';
  if (overallScore >= 85) scoreLabel = 'Excellent';
  else if (overallScore >= 70) scoreLabel = 'Good';
  else if (overallScore >= 50) scoreLabel = 'Fair';
  else if (overallScore >= 30) scoreLabel = 'Poor';
  else scoreLabel = 'Hazardous';

  const outdoorScoreObj: OutdoorScore = {
    overallScore,
    label: scoreLabel,
    runningScore,
    cyclingScore,
    diningScore,
    hikingScore
  };

  // 2. Clothing Suggestions
  const clothing: string[] = [];
  if (temp <= 0) {
    clothing.push('Heavy winter coat & thermals', 'Insulated gloves & beanie', 'Warm wool socks');
  } else if (temp <= 12) {
    clothing.push('Warm jacket or sweater', 'Long pants', 'Layered clothing');
  } else if (temp <= 20) {
    clothing.push('Light jacket or fleece pullover', 'Comfortable pants or jeans');
  } else if (temp <= 28) {
    clothing.push('T-shirt or polo', 'Breathable shorts or linen pants', 'Light footwear');
  } else {
    clothing.push('Lightweight, light-colored breathable clothing', 'Shorts & tank tops', 'Open footwear');
  }

  // 3. Gear Suggestions
  const gear: string[] = [];
  if (precipitation > 0 || (daily?.precipitation_probability_max?.[0] ?? 0) > 40) {
    gear.push('Compact Umbrella', 'Waterproof Rain Coat or Poncho');
  }
  if (uv >= 6) {
    gear.push('SPF 30+ Sunscreen', 'UV Protection Sunglasses', 'Wide-brimmed Hat');
  } else if (uv >= 3) {
    gear.push('Sunglasses', 'Light Sunscreen');
  }
  if (temp >= 25 || humidity > 70) {
    gear.push('Reusable Water Bottle (Stay Hydrated)');
  }
  if (wind >= 30) {
    gear.push('Windbreaker Shield');
  }
  if (gear.length === 0) {
    gear.push('Standard daily essentials', 'Comfortable walking shoes');
  }

  // 4. Health & Safety Advisories
  const healthCautions: PlanningRecommendation['healthCautions'] = [];
  if (uv >= 8) {
    healthCautions.push({
      title: 'Very High UV Risk',
      message: 'Unprotected skin can burn quickly. Seek shade between 11 AM and 4 PM.',
      severity: 'alert'
    });
  }
  if (temp >= 33 || apparentTemp >= 36) {
    healthCautions.push({
      title: 'Heat Caution',
      message: 'High heat stress index. Limit strenuous outdoor exertion and drink plenty of fluids.',
      severity: 'alert'
    });
  } else if (temp <= -5 || apparentTemp <= -8) {
    healthCautions.push({
      title: 'Freezing Conditions',
      message: 'Sub-zero temperatures pose frostbite risks. Cover exposed skin.',
      severity: 'alert'
    });
  }
  if (wind >= 40) {
    healthCautions.push({
      title: 'High Wind Gusts',
      message: `Wind gusts recorded up to ${wind} km/h. Secure loose outdoor objects.`,
      severity: 'warning'
    });
  }
  if (weatherInfo.category === 'thunder') {
    healthCautions.push({
      title: 'Thunderstorm Advisory',
      message: 'Lightning activity detected. Stay indoors away from windows.',
      severity: 'alert'
    });
  }
  if (humidity > 80 && temp > 24) {
    healthCautions.push({
      title: 'Muggy Air Quality',
      message: 'High humidity makes it feel significantly warmer than actual temperature.',
      severity: 'info'
    });
  }

  // 5. Best Outdoor Hours Today
  const bestOutdoorHours: PlanningRecommendation['bestOutdoorHours'] = [];
  if (hourly && hourly.time) {
    const nowISO = new Date().toISOString().slice(0, 13); // YYYY-MM-DDTHH
    const currentDayIndex = hourly.time.findIndex(t => t.startsWith(nowISO));
    const startIndex = currentDayIndex >= 0 ? currentDayIndex : 0;
    const next18Hours = hourly.time.slice(startIndex, startIndex + 18);

    const candidates = next18Hours.map((timeStr, idx) => {
      const realIdx = startIndex + idx;
      const hTemp = hourly.temperature_2m[realIdx];
      const hRainProb = hourly.precipitation_probability[realIdx] || 0;
      const hWind = hourly.wind_speed_10m[realIdx] || 0;
      const hCode = hourly.weather_code[realIdx] || 0;
      const hInfo = getWeatherInfo(hCode);

      // Score hour suitability
      let hScore = 100;
      if (hRainProb > 20) hScore -= hRainProb * 1.5;
      if (hTemp < 10) hScore -= (10 - hTemp) * 4;
      if (hTemp > 28) hScore -= (hTemp - 28) * 4;
      if (hWind > 20) hScore -= (hWind - 20) * 2;

      const timeDate = new Date(timeStr);
      const hourLabel = timeDate.toLocaleTimeString([], { hour: 'numeric', hour12: true });

      let reason = 'Comfortable temp & clear conditions';
      if (hRainProb < 10 && hTemp >= 18 && hTemp <= 24) {
        reason = 'Ideal mild temperature & low rain risk';
      } else if (hInfo.category === 'clear') {
        reason = 'Clear skies and pleasant breeze';
      } else if (hRainProb > 30) {
        reason = `Moderate rain probability (${hRainProb}%)`;
      }

      return {
        hour: hourLabel,
        temp: hTemp,
        icon: hInfo.iconName,
        reason,
        score: hScore
      };
    });

    candidates.sort((a, b) => b.score - a.score);
    bestOutdoorHours.push(...candidates.slice(0, 3));
  }

  // 6. Commute Advisory
  let commuteAdvisory = 'Road conditions are dry with standard traction.';
  if (weatherInfo.category === 'rain') {
    commuteAdvisory = 'Wet roads and reduced traction. Allow extra braking distance during commute.';
  } else if (weatherInfo.category === 'snow') {
    commuteAdvisory = 'Slippery snowy roads. Exercise extreme caution and slow down.';
  } else if (weatherInfo.category === 'fog') {
    commuteAdvisory = 'Foggy conditions reducing visibility. Drive with low beams on.';
  } else if (weatherInfo.category === 'thunder') {
    commuteAdvisory = 'Hazardous road conditions due to thunderstorms and potential localized flooding.';
  } else if (wind >= 35) {
    commuteAdvisory = 'Crosswinds may affect high-profile vehicles on open highways.';
  }

  // Summary message
  const summary = `${weatherInfo.label} with temperatures around ${Math.round(temp)}°C (feels like ${Math.round(apparentTemp)}°C). Outdoor suitability is rated ${scoreLabel}.`;

  return {
    outdoorScore: outdoorScoreObj,
    clothingSuggestions: clothing,
    gearSuggestions: gear,
    healthCautions,
    bestOutdoorHours,
    commuteAdvisory,
    summary
  };
}
