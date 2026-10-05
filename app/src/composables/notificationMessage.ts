import {Notify} from "quasar";

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error'
}
export default function useNotificationMessage( type: string, message: string){

  console.log('Notification message: ', type, message)

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

    console.log('test')
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
