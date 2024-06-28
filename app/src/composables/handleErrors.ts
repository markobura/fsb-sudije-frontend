import useNotificationMessage from "src/composables/notificationMessage";

export default function useHandleErrors(
  errorCode: number,
  errors: {[p: string]: unknown},
) :boolean{
  let shouldRedirectToLogin = false;
  if (errorCode === 500) {
    useNotificationMessage('error','Došlo je do greške, molimo pokušajte ponovo, molimo kontaktirajte IT podršku!')
  } else if (errorCode === 401) {
    useNotificationMessage('error','U sistemu ne postoji korisnik sa unetim emailom i lozinkom!')
    shouldRedirectToLogin = true;
  } else if (errorCode === 422) {
    for (const [, value] of Object.entries(errors)) {
      Array(value).map(el=> {
        useNotificationMessage('error',String(el))
      })
    }
  }
  return shouldRedirectToLogin;
};
