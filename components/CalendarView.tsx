"use client";

import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, IndianRupee, Truck, FileSpreadsheet, Users, ShieldAlert } from "lucide-react";
import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  type: "sale" | "transfer" | "purchase" | "loan" | "wastage";
  amount?: number;
};

const eventConfig: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  sale: { icon: IndianRupee, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-400/10" },
  transfer: { icon: Truck, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-400/10" },
  purchase: { icon: FileSpreadsheet, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-400/10" },
  loan: { icon: Users, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-400/10" },
  wastage: { icon: ShieldAlert, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-400/10" }
};

export function CalendarView({ events }: { events: CalendarEvent[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const days = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const getEventsForDay = (day: Date) => {
    return events.filter((e) => {
      const eDate = parseISO(e.date);
      return isSameDay(eDate, day);
    });
  };

  return (
    <div className="surface-card flex flex-col h-[calc(100vh-140px)]">
      <div className="card-toolbar flex justify-between items-center py-4">
        <h2 className="text-xl font-bold text-ink flex-1">{format(currentDate, "MMMM yyyy")}</h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="icon-button border border-orange-100 dark:border-white/10 rounded px-2"><ChevronLeft size={20} /></button>
          <button onClick={() => setCurrentDate(new Date())} className="px-4 py-1.5 text-sm font-medium rounded-md border border-orange-100 dark:border-white/10 hover:bg-vanilla dark:hover:bg-white/10 transition-colors">Today</button>
          <button onClick={nextMonth} className="icon-button border border-orange-100 dark:border-white/10 rounded px-2"><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-orange-100/30 dark:border-white/10">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
          <div key={dayName} className="py-2 text-center text-sm font-semibold text-cocoa/70 dark:text-white/70 uppercase">
            {dayName}
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-7 grid-rows-5 lg:grid-rows-auto overflow-y-auto bg-vanilla/10 dark:bg-black/20">
        {days.map((day, i) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <div 
              key={day.toISOString()} 
              className={clsx(
                "min-h-[100px] border-b border-r border-orange-100/30 dark:border-white/10 p-2 flex flex-col gap-1 transition-colors hover:bg-white/50 dark:hover:bg-white/5",
                !isCurrentMonth && "opacity-40 bg-vanilla/30 dark:bg-black/40",
                i % 7 === 6 && "border-r-0"
              )}
            >
              <div className="flex justify-between items-center">
                <span className={clsx("text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full", isToday && "bg-strawberry text-white")}>
                  {format(day, "d")}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1 mt-1 pr-1">
                {dayEvents.map(event => {
                  const config = eventConfig[event.type];
                  const Icon = config.icon;
                  return (
                    <div key={event.id} className={clsx("flex items-center gap-1.5 px-2 py-1 text-xs rounded-md shadow-sm border border-black/5 dark:border-white/5", config.bg, config.color)}>
                      <Icon size={12} className="shrink-0" />
                      <span className="truncate font-medium">{event.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
