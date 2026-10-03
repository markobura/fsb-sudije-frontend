export default function useUserCancellationApplicationTableColumns(){

  return [
    {name: 'date', align: 'left', label: 'Datum', field: 'date',  required: true,sortable: true},
    {name: 'time', align: 'left', label: 'Vreme', field: 'start_time',  required: true,sortable: true},
    {name: 'note', label: 'Napomena', field: 'note',  required: true, align: 'left'},
    {name: 'delete', label: 'Obriši', field: 'delete',  required: true,align: 'center'}
  ];
}
