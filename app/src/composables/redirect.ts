import { Router } from 'vue-router'
export default function useRedirect (router:Router, routeName:string, mode:string):void {
  if (mode === 'push') {
    router.push({ name: routeName })
  } else {
    router.replace({ name: routeName })
  }
}
