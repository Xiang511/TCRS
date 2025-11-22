let table = new DataTable('#myTable', {
    order: [[2, 'asc']],
    info: false,
    // paging: false
    processing: true,
    // 表格拖拉
    // colReorder: true,
    // colReorder: {
    //     fixedColumnsLeft: 1
    // },
    columnDefs: [{ orderable: false, targets: 0 }
        // { "width": "25%", "targets": 0 },
        // { "width": "5   %", "targets": [1,2,3,4] }
    ]
});
table.on('order.dt search.dt', function () {
    table.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
        cell.innerHTML = i + 1;
    });
}).draw();