import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Clock, ChevronDown, Check, Sun, Moon, Sparkles } from 'lucide-react';

interface TimePickerSelectProps {
  value: string; // e.g. '02:00 PM' or '09:30 AM'
  onChange: (time: string) => void;
  label?: string;
  theme?: 'dark' | 'light';
  showPresets?: boolean;
  disabled?: boolean;
  className?: string;
}

const COMMON_PRESETS = [
  { label: '08:00 AM', tag: 'Apertura' },
  { label: '09:30 AM', tag: 'Mañana' },
  { label: '11:00 AM', tag: 'Mediodía' },
  { label: '02:00 PM', tag: 'Tarde' },
  { label: '03:30 PM', tag: 'Tarde' },
  { label: '05:00 PM', tag: 'Tarde/Noche' },
  { label: '06:30 PM', tag: 'Cierre' }
];

export const TimePickerSelect: React.FC<TimePickerSelectProps> = ({
  value,
  onChange,
  label,
  theme = 'dark',
  showPresets = true,
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial time string into parts (hour: 1-12, minute: 00-59, period: AM/PM)
  const parsedTime = useMemo(() => {
    if (!value) return { hour: '02', minute: '00', period: 'PM' };
    const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (match) {
      let h = parseInt(match[1], 10);
      const m = match[2];
      const p = (match[3] || 'AM').toUpperCase();
      const formattedH = h < 10 ? `0${h}` : `${h}`;
      return { hour: formattedH, minute: m, period: p };
    }
    return { hour: '02', minute: '00', period: 'PM' };
  }, [value]);

  const [selectedHour, setSelectedHour] = useState(parsedTime.hour);
  const [selectedMinute, setSelectedMinute] = useState(parsedTime.minute);
  const [selectedPeriod, setSelectedPeriod] = useState(parsedTime.period);

  useEffect(() => {
    setSelectedHour(parsedTime.hour);
    setSelectedMinute(parsedTime.minute);
    setSelectedPeriod(parsedTime.period);
  }, [parsedTime]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Generate list of 15-min intervals from 07:00 AM to 09:00 PM
  const allSlots = useMemo(() => {
    const slots: string[] = [];
    const periods = ['AM', 'PM'];
    
    // AM slots from 7 to 11
    for (let h = 7; h <= 11; h++) {
      const hh = h < 10 ? `0${h}` : `${h}`;
      slots.push(`${hh}:00 AM`, `${hh}:15 AM`, `${hh}:30 AM`, `${hh}:45 AM`);
    }
    // 12 PM
    slots.push('12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM');
    // PM slots from 1 to 9
    for (let h = 1; h <= 9; h++) {
      const hh = h < 10 ? `0${h}` : `${h}`;
      slots.push(`${hh}:00 PM`, `${hh}:15 PM`, `${hh}:30 PM`, `${hh}:45 PM`);
    }
    return slots;
  }, []);

  const handleApplyCustom = (h: string, m: string, p: string) => {
    const formatted = `${h}:${m} ${p}`;
    onChange(formatted);
  };

  const handleSelectSlot = (slot: string) => {
    onChange(slot);
    setIsOpen(false);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-slate-400 mb-1 font-semibold text-xs flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[10px] text-[#FF5A36] font-mono font-bold">{value || '02:00 PM'}</span>
        </label>
      )}

      {/* Main Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left font-bold text-xs p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
          isOpen
            ? 'border-[#FF5A36] ring-2 ring-[#FF5A36]/20'
            : isDark
              ? 'bg-[#0E121B] border-white/10 text-white hover:border-white/20'
              : 'bg-[#F0F2F7] border-black/10 text-slate-900 hover:border-black/20'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-lg ${isDark ? 'bg-white/5 text-[#FF5A36]' : 'bg-white text-[#FF5A36] shadow-sm'}`}>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <span className="font-mono tracking-wide text-sm">{value || '02:00 PM'}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-[#FF5A36]' : ''}`} />
      </button>

      {/* Popover Selector */}
      {isOpen && (
        <div
          className={`absolute left-0 top-full mt-2 z-50 w-72 sm:w-80 p-3.5 rounded-2xl border shadow-2xl space-y-3 animate-fade-in backdrop-blur-xl ${
            isDark ? 'bg-[#141926]/95 border-white/15 text-white shadow-black/80' : 'bg-white/95 border-black/10 text-slate-900 shadow-2xl'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/10 text-xs">
            <span className="font-bold flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-[#FF5A36]" />
              <span>Seleccionar Horario</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#FF5A36]/15 text-[#FF5A36] font-bold">
              {value || '02:00 PM'}
            </span>
          </div>

          {/* Quick Presets Strip */}
          {showPresets && (
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold block mb-1.5">
                Horarios Frecuentes
              </span>
              <div className="flex flex-wrap gap-1">
                {COMMON_PRESETS.map(preset => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleSelectSlot(preset.label)}
                    className={`text-[11px] font-mono font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                      value === preset.label
                        ? 'bg-[#FF5A36] text-white border-[#FF5A36] shadow-sm'
                        : isDark
                          ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                          : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Precision Dial Selectors (Hour, Min, AM/PM) */}
          <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-[#0E121B] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold block mb-1.5">
              Ajuste Exacto
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              
              {/* Hour Dropdown */}
              <div>
                <label className="text-[9px] text-slate-400 block mb-0.5">Hora</label>
                <select
                  value={selectedHour}
                  onChange={(e) => {
                    setSelectedHour(e.target.value);
                    handleApplyCustom(e.target.value, selectedMinute, selectedPeriod);
                  }}
                  className={`w-full p-1.5 rounded-lg border font-mono font-bold focus:outline-none focus:border-[#FF5A36] ${
                    isDark ? 'bg-[#141926] border-white/10 text-white' : 'bg-white border-black/10 text-slate-900'
                  }`}
                >
                  {['01','02','03','04','05','06','07','08','09','10','11','12'].map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              {/* Minute Dropdown */}
              <div>
                <label className="text-[9px] text-slate-400 block mb-0.5">Minuto</label>
                <select
                  value={selectedMinute}
                  onChange={(e) => {
                    setSelectedMinute(e.target.value);
                    handleApplyCustom(selectedHour, e.target.value, selectedPeriod);
                  }}
                  className={`w-full p-1.5 rounded-lg border font-mono font-bold focus:outline-none focus:border-[#FF5A36] ${
                    isDark ? 'bg-[#141926] border-white/10 text-white' : 'bg-white border-black/10 text-slate-900'
                  }`}
                >
                  {['00','15','30','45'].map(m => (
                    <option key={m} value={m}>:{m}</option>
                  ))}
                </select>
              </div>

              {/* Period AM / PM Switch */}
              <div>
                <label className="text-[9px] text-slate-400 block mb-0.5">Periodo</label>
                <div className="grid grid-cols-2 gap-0.5 p-0.5 rounded-lg bg-black/10 dark:bg-white/5 border border-black/5 dark:border-white/5">
                  {['AM', 'PM'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setSelectedPeriod(p);
                        handleApplyCustom(selectedHour, selectedMinute, p);
                      }}
                      className={`text-[10px] font-bold py-1 rounded-md transition-all cursor-pointer ${
                        selectedPeriod === p
                          ? 'bg-[#FF5A36] text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Quick Slots Scrollable Grid */}
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold block mb-1">
              Todos los Horarios del Día (15 min)
            </span>
            <div className="max-h-36 overflow-y-auto pr-1 grid grid-cols-3 gap-1">
              {allSlots.map(slot => {
                const isSelected = value === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => handleSelectSlot(slot)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-mono font-bold border transition-all text-center flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF5A36] text-white border-[#FF5A36] shadow-sm'
                        : isDark
                          ? 'bg-[#0E121B] border-white/5 text-slate-300 hover:border-white/20'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{slot}</span>
                    {isSelected && <Check className="w-3 h-3 text-white shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Confirm Footer */}
          <div className="pt-2 border-t border-black/5 dark:border-white/10 flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="bg-[#FF5A36] hover:bg-[#E54E07] text-white text-xs font-bold px-4 py-1.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Listo / Seleccionar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
