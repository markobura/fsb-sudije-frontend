import {api} from "boot/axios";

export default async function useDownloadExcel(url: string, requestObject: any, fileName: string){
  await api
    .get(url,{
      params: requestObject,
      responseType: 'arraybuffer'})
    .then((response)=>{
      const blob = new File([response.data], fileName + '.xlsx',{type: response.headers['content-type']});
      const url = window.URL.createObjectURL(blob)
      window.open(url)
    })
}
