/**
 * 投资方公司管理初始化
 */
var ProCompany = {
    id: "ProCompanyTable",	//表格id
    seItem: null,		//选中的条目
    table: null,
    layerIndex: -1,
    delIds:[]           // 批量删除
};

/**
 * 初始化表格的列
 */
ProCompany.initColumn = function () {
    return [
        {field: 'selectItem', checkbox: true},
        {title: 'id', field: 'id', visible: false, align: 'center', valign: 'middle'},
        {title: '操作', field: 'id', visible: true,align: 'center', valign: 'middle', formatter: ProCompany.formatOperate}
    ];
};

ProCompany.formatOperate = function (val, row, index) {
    var id = row.id;
    var btn_edit = "<button class='btn btn-primary'   onclick='ProCompany.openProCompanyDetail(" + id + ")'><i class='fa fa-edit'></i> 编辑</button>";
    var btn_del = "<button class='btn btn-danger'   onclick='ProCompany.deleteOne(" + id + ")'><i class='fa fa-trash-o'></i> 删除</button>";
    return btn_edit + "&nbsp;&nbsp;&nbsp;" + btn_del;
}
/**
 * 检查是否选中
 */
ProCompany.check = function () {
    var selected = $('#' + this.id).bootstrapTable('getSelections');
    if(selected.length == 0){
        Feng.info("请先选中表格中的某一记录！");
        return false;
    }else{
        ProCompany.seItem = selected[0];
        ProCompany.dealDelIds(selected);
        return true;
    }
};

/**
 * 点击添加投资方公司
 */
ProCompany.openAddProCompany = function () {
    var index = layer.open({
        type: 2,
        title: '添加投资方公司',
        area: ['800px', '420px'], //宽高
        fix: false, //不固定
        maxmin: true,
        content: Feng.ctxPath + '/proCompany/proCompany_add'
    });
    this.layerIndex = index;
};

/**
 * 打开查看投资方公司详情
 */
ProCompany.openProCompanyDetail = function () {
    if (this.check()) {
        var index = layer.open({
            type: 2,
            title: '投资方公司详情',
            area: ['800px', '420px'], //宽高
            fix: false, //不固定
            maxmin: true,
            content: Feng.ctxPath + '/proCompany/proCompany_update/' + ProCompany.seItem.id
        });
        this.layerIndex = index;
    }
};
/**
 * 打开查看投资方公司详情,不验证是否选中
 */
ProCompany.openProCompanyOneDetail = function (id) {
    var index = layer.open({
        type: 2,
        title: '部门信息详情',
        area: ['800px', '420px'], //宽高
        fix: false, //不固定
        maxmin: true,
        content: Feng.ctxPath + '/proCompany/proCompany_update/' + id
    });
    this.layerIndex = index;
};
/**
 * 批量删除投资方公司
 */
ProCompany.delete = function () {
    if (this.check()) {
         var operation = function(){
             var ajax = new $ax(Feng.ctxPath + "/proCompany/delete", function (data) {
                    Feng.success("删除成功!");
                    ProCompany.table.refresh();
                }, function (data) {
                    Feng.error("删除失败!" + data.responseJSON.message + "!");
                });
                ajax.set("ids",ProCompany.delIds);
                ajax.start();
            };
            Feng.confirm("是否刪除选中投资方公司?", operation);
         }
};

/**
 * 删除单个投资方公司
 */
ProCompany.deleteOne = function (id) {

    var operation = function(){
        var ajax = new $ax(Feng.ctxPath + "/proCompany/delete", function (data) {
            Feng.success("删除成功!");
            ProCompany.table.refresh();
        }, function (data) {
            Feng.error(data.message + "!");
        });
        ajax.set("ids",id);
        ajax.start();
    };
    Feng.confirm("是否刪除选中投资方公司?", operation);

};

/**
 * 查询投资方公司列表
 */
ProCompany.search = function () {
    var queryData = {};
    queryData['condition'] = $("#condition").val();
    ProCompany.table.refresh({query: queryData});
};

ProCompany.formatOperate = function (val, row, index) {
    var id = row.id;
    var btn_edit = "<button class='btn btn-primary'   onclick='ProCompany.openProCompanyOneDetail(" + id + ")'><i class='fa fa-edit'></i> 编辑</button>";
    var btn_del = "<button class='btn btn-danger'   onclick='ProCompany.deleteOne(" + id + ")'><i class='fa fa-trash-o'></i> 删除</button>";
    return btn_edit + "&nbsp;&nbsp;&nbsp;" + btn_del;
}

// 封装批量删除的ids
ProCompany.dealDelIds = function (selected) {
    ProCompany.delIds = "";
    for(var i=0;i<selected.length;i++){
        if (selected[i] != null && i != selected.length -1){
            ProCompany.delIds += selected[i].id+",";
        }else {
            ProCompany.delIds += selected[i].id;
        }
    }
};

$(function () {
    var defaultColunms = ProCompany.initColumn();
    var table = new BSTable(ProCompany.id, "/proCompany/list", defaultColunms);
    table.setPaginationType("client");
    ProCompany.table = table.init();
});
