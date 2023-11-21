import {Notify} from "quasar";

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error'
}
export default function useNotificationMessage( type: string, message: string){

  switch(type){

    case(NotificationType.SUCCESS):
      Notify.create({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: message,
        position: 'top',
      });
      break;

    case(NotificationType.ERROR):
      Notify.create({
        color: 'red-7',
        textColor: 'white',
        icon: 'error',
        message: message,
        position: 'top',
      });
      break;
  }

}
