import {date} from 'quasar'

 export function useDBFormat( date: string){
    const dateArr = date.split('/');
    return dateArr[2] + '-' + dateArr[1] + '-' + dateArr[0];
 }
 export  function useUIFormat( date: string){
    const dateArr = date.split('-');
    return dateArr[2] + '/' + dateArr[1] + '/' + dateArr[0];
  }
 export function useCurrentDate(){
   const today = Date.now()
   return date.formatDate(today, 'DD/MM/YYYY');
 }

 export function extractTimeFromTimestamp(timestamp: string): string{

// Create a Date object from the timestamp
   const dateObject = new Date(timestamp);

// Extract hours and minutes
   const hours = String(dateObject.getHours()).padStart(2, '0');
   const minutes = String(dateObject.getMinutes()).padStart(2, '0');

// Format the result as "hh:mm"
   return `${hours}:${minutes}`;
 }


