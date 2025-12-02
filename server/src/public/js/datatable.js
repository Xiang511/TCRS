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

    
});

//即時查詢總人數
const firstSpan = document.querySelector('.sitestatesJs');
//取得字串
const text = firstSpan.textContent;
//取得數字
const Real_Time_Number = text.substring(text.length - 5);


//今日訪客
const spans = document.querySelectorAll(".sitestatesJs");
const secondSpan = spans[1];
const secondSpan_txt = secondSpan.textContent;
const secondSpan_result = secondSpan_txt.substring(text.length - 6);

//線上人數
const online = document.querySelectorAll(".sitestatesJs");
const onlineSpan = online[2];
const onlineSpan_txt = onlineSpan.textContent;
const onlineSpan_result = onlineSpan_txt.substring(text.length - 4);



let searchitem1 = document.getElementById("searchitem1");


function multiSearch() {

    $(document).ready(function () {
        var table = $('#myTable').DataTable(); // 確保這裡的表格ID為'myTable'

        $.fn.dataTable.ext.search.push(
            function (settings, data, dataIndex) {
                var name = data[0].toLowerCase();
                var searchTerms = searchitem1.value.toLowerCase().split('+'); // 使用單一搜尋框，分隔符號為'+'

                // 檢查是否有任何子搜尋詞符合
                for (let subTerm of searchTerms) {
                    if (name.includes(subTerm.trim())) {
                        return true;
                    }
                }
                return false;
            }
        );

        table.draw();
    });

}
