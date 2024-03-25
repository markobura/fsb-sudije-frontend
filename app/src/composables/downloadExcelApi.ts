import {api} from "boot/axios";

export default async function useDownloadExcel(url: string, requestObject: any, fileName: string){
  await api
    .get(url,{
      params: requestObject,
      responseType: 'arraybuffer'})
    .then((response)=>{
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.download = fileName + '.xlsx';
      link.click();
    })
}
