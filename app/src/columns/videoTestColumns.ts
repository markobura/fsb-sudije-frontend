export default function useVideoTestColumns(){

  return [
    {name: 'name', align: 'left', label: 'Test', field: 'name',  required: true,sortable: true},
    {name: 'league', align: 'left', label: 'Liga', field: 'league',  required: true,sortable: true},
    {name: 'details', label: 'Detalji', field: 'details',  required: true,align: 'center'},
    {name: 'questions', label: 'Pitanja', field: 'questions',  required: true,align: 'center'},
    {name: 'results', label: 'Rezultati', field: 'results',  required: true,align: 'center'},
    {name: 'delete', label: 'Obriši test', field: 'delete',  required: true,align: 'center'}
  ];
}
