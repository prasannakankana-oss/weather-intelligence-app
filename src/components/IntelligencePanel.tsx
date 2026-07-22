import React from 'react';
import {
  Sparkles,
  Activity,
  Shirt,
  ShieldAlert,
  Clock,
  Car,
  Footprints,
  Bike,
  UtensilsCrossed,
  Trees,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { WeatherForecastResponse, UserSettings } from '../types';
import { generateIntelligenceRecommendations } from '../utils/intelligenceEngine';
import { formatTemp } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface IntelligencePanelProps {
  data: WeatherForecastResponse;
  settings: UserSettings;
}

export const IntelligencePanel: React.FC<IntelligencePanelProps> = ({ data, settings }) => {
  const recommendations = generateIntelligenceRecommendations(data);
  const { outdoorScore, clothingSuggestions, gearSuggestions, healthCautions, bestOutdoorHours, commuteAdvisory, summary } = recommendations;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (score >= 60) return 'text-indigo-700 bg-indigo-50 border-indigo-300';
    if (score >= 40) return 'text-amber-800 bg-amber-50 border-amber-300';
    return 'text-rose-700 bg-rose-50 border-rose-300';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-600';
    if (score >= 60) return 'bg-indigo-600';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-rose-600';
  };

  return (
    <div id="weather-intelligence-panel" className="space-y-6">
      
      {/* Top Banner: Smart Summary */}
      <div className="p-5 rounded-none bg-white border-l-4 border-l-indigo-600 border border-slate-200 shadow-sm flex items-start space-x-3.5">
        <div className="p-2.5 rounded-none bg-indigo-50 text-indigo-600 border border-indigo-200 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center space-x-2">
            <span>Weather Intelligence Briefing</span>
            <span className="px-2 py-0.5 rounded-none text-[10px] uppercase tracking-widest font-black bg-slate-900 text-white">
              Open-Meteo Engine
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed font-medium">
            {summary}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Outdoor Activity Suitability Index */}
        <div className="p-5 rounded-none bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center space-x-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                <span>Outdoor Activity Score</span>
              </h4>
              <span className={`px-2.5 py-0.5 rounded-none text-[11px] font-black font-mono border ${getScoreColor(outdoorScore.overallScore)}`}>
                {outdoorScore.label} ({outdoorScore.overallScore}/100)
              </span>
            </div>

            {/* Overall Score Meter */}
            <div className="my-5 text-center">
              <div className="inline-flex flex-col items-center justify-center w-28 h-28 rounded-none bg-slate-50 border-2 border-slate-900 relative shadow-inner">
                <span className="text-3xl font-black font-mono text-slate-900">{outdoorScore.overallScore}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-0.5">Index</span>
              </div>
            </div>

            {/* Sub Activity Scores */}
            <div className="space-y-3">
              {[
                { label: 'Running / Jogging', score: outdoorScore.runningScore, icon: Footprints },
                { label: 'Cycling / Biking', score: outdoorScore.cyclingScore, icon: Bike },
                { label: 'Outdoor Dining', score: outdoorScore.diningScore, icon: UtensilsCrossed },
                { label: 'Hiking & Trails', score: outdoorScore.hikingScore, icon: Trees }
              ].map((act) => {
                const IconComp = act.icon;
                return (
                  <div key={act.label} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center space-x-1.5">
                        <IconComp className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{act.label}</span>
                      </span>
                      <span className="font-mono text-slate-900 font-bold">{act.score}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-none overflow-hidden border border-slate-200">
                      <div
                        className={`h-full rounded-none transition-all duration-500 ${getScoreBarColor(act.score)}`}
                        style={{ width: `${act.score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Column 2: What to Wear & Carry */}
        <div className="p-5 rounded-none bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center space-x-2">
                <Shirt className="w-4 h-4 text-amber-600" />
                <span>Clothing & Gear Guide</span>
              </h4>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                  Recommended Outfit
                </span>
                <ul className="space-y-2">
                  {clothingSuggestions.map((item, i) => (
                    <li key={i} className="flex items-start space-x-2 text-xs font-medium text-slate-800 bg-slate-50 p-2.5 rounded-none border border-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                  Gear to Carry
                </span>
                <ul className="space-y-2">
                  {gearSuggestions.map((item, i) => (
                    <li key={i} className="flex items-start space-x-2 text-xs font-medium text-slate-800 bg-slate-50 p-2.5 rounded-none border border-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Commute Box */}
          <div className="mt-4 p-3 rounded-none bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center space-x-1.5 font-bold uppercase tracking-wider text-slate-900 mb-1">
              <Car className="w-4 h-4 text-indigo-600" />
              <span>Commute Advisory</span>
            </div>
            <p className="text-slate-700 leading-relaxed font-medium">{commuteAdvisory}</p>
          </div>
        </div>

        {/* Column 3: Health Warnings & Best Outdoor Hours */}
        <div className="p-5 rounded-none bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          
          {/* Health & Safety Alerts */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Safety Advisories</span>
              </h4>
            </div>

            <div className="mt-4 space-y-2.5">
              {healthCautions.length === 0 ? (
                <div className="p-3 rounded-none bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>No severe weather advisories active today. Excellent conditions!</span>
                </div>
              ) : (
                healthCautions.map((alert, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-none border text-xs space-y-1 ${
                      alert.severity === 'alert'
                        ? 'bg-rose-50 border-rose-200 text-rose-900'
                        : alert.severity === 'warning'
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-indigo-50 border-indigo-200 text-indigo-900'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 font-bold uppercase tracking-wider text-[11px]">
                      {alert.severity === 'alert' ? (
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      ) : (
                        <Info className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                      <span>{alert.title}</span>
                    </div>
                    <p className="text-slate-700 pl-5 leading-normal font-medium">{alert.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Best Outdoor Hours */}
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Prime Outdoor Windows</span>
              </h5>
            </div>

            <div className="mt-3 space-y-2">
              {bestOutdoorHours.length === 0 ? (
                <p className="text-xs text-slate-500">Conditions vary across the forecast period.</p>
              ) : (
                bestOutdoorHours.map((window, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-none bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <WeatherIcon name={window.icon} className="w-5 h-5 text-amber-500" />
                      <div>
                        <span className="font-bold text-slate-900 font-mono">{window.hour}</span>
                        <p className="text-[10px] text-slate-500">{window.reason}</p>
                      </div>
                    </div>
                    <span className="font-black text-slate-900 font-mono">
                      {formatTemp(window.temp, settings.tempUnit)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
