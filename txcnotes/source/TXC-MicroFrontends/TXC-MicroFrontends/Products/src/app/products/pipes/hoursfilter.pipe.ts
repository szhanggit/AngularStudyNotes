import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'hoursFilter'})
export class HoursFilterPipe implements PipeTransform {
  transform(hours: string): string {
    if (!hours) {
      return '';
    }
  
    const hourStrings = hours.split(';').filter(Boolean);
    const timeSlots: string[] = [];
  
    let currentSlotStart = hourStrings[0];
  //here it loops through the array to find if there are timeslots within the list of hours
  //if it finds out that the increment between digits is more than 1, it identifies this place as the beginning of the next timeslot
    for (let i = 1; i < hourStrings.length; i++) {
      const currentHour = parseInt(hourStrings[i]);
      const previousHour = parseInt(hourStrings[i - 1]);
  
      if (currentHour - previousHour !== 1) {
        const currentSlotEnd = hourStrings[i - 1];
        timeSlots.push(`${this.formatTime(currentSlotStart)}:00 ~ ${this.formatTime(currentSlotEnd)}:59`);
        currentSlotStart = hourStrings[i];
      }
    }
  
    const lastSlotEnd = hourStrings[hourStrings.length - 1];
    timeSlots.push(`${this.formatTime(currentSlotStart)}:00 ~ ${this.formatTime(lastSlotEnd)}:59`);
  
    return timeSlots.join(', ');
  }
  
  private formatTime(time: string): string {
    const hour = parseInt(time);
    return hour < 10 ? `0${hour}` : `${hour}`;
  }
}