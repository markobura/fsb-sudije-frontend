export default function useUserAvailabilityTableColumns(){

  return [
    {name: 'period', align: 'left', label: 'Datum nedostupnosti', field: 'period',  required: true,sortable: true},
    {name: 'time', align: 'left', label: 'Period nedostupnosti', field: 'period',  required: true,sortable: true},
    {name: 'reason', label: 'Razlog', field: 'reason',  required: true, align: 'left'},
    {name: 'update', label: 'Promena', field: 'edit',  required: true,align: 'center'},
    {name: 'delete', label: 'Obriši', field: 'delete',  required: true,align: 'center'}
  ];
}
