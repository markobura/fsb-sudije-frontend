export default function useUserTableColumns(){

  return [
    {
      name: 'name',
      label: 'Korisnik',
      align: 'left',
      field: (row: any) => `${row.first_name} ${row.last_name}`,
      required: true,
      sortable: true
    },
    {name: 'email', align: 'left', label: 'E-mail', field: 'email',  required: true,sortable: true},
    {name: 'league', align: 'left', label: 'Liga', field: 'league',  required: true,sortable: true},
    {name: 'referee_type', align: 'left', label: 'Lista', field: 'referee_type', required: true, sortable: true},
    {
      name: 'active',
      label: 'Status naloga',
      field: 'active',
      sortable: true, required: true,
      align: 'left'
    },
    {name: 'details', label: 'Detalji korisnika', field: 'details',  required: true,align: 'center'},
    {name: 'password', label: 'Promena lozinke', field: 'password',  required: true,align: 'center'},
    {name: 'delete', label: 'Obriši korisnika', field: 'delete',  required: true,align: 'center'}
  ];
}
