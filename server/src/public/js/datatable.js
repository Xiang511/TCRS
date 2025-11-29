$(document).ready(function () {
    let table = new DataTable('#myTable', {
        order: [[2, 'desc']],
        info: false,
        processing: true,
        colReorder: true,
        colReorder: {
            fixedColumnsLeft: 1
        },
        fixedColumns: {
            start: 1,
            end: 2
        },
        scrollCollapse: true,
        language: {
            processing: "處理中...",
            search: "搜尋:",
            lengthMenu: "_MENU_",
            paginate: {
                first: "第一頁",
                last: "最後一頁",
                next: "下一頁",
                previous: "上一頁"
            },
            emptyTable: "目前沒有資料",
            zeroRecords: "沒有符合的資料"
        }
    });

    // 季度選擇器切換
    $('#seasonSelect').on('change', function () {
        const selectedSeason = $(this).val();
        if (selectedSeason) {
            window.location.href = `/players?time=${encodeURIComponent(selectedSeason)}`;
        } else {
            window.location.href = '/players';
        }
    });
});