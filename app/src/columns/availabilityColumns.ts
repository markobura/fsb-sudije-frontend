export default function useAvailabilityTableColumns(){

  return [
    {
      name: 'name',
      label: 'Korisnik',
      align: 'left',
      field: (row: any) => `${row.first_name} ${row.last_name}`,
      required: true,
      sortable: true
    },
    {name: 'league', align: 'left', label: 'Liga', field: 'league',  required: true,sortable: true},
    {name: 'date', align: 'left', label: 'Datum', field: 'date', required: true, sortable: true},
    {name: 'time', align: 'left', label: 'Vreme', field: 'time', required: true, sortable: true},
    {name: 'reason', align: 'left', label: 'Razlog', field: 'reason', required: true, sortable: true},
  ];
}
