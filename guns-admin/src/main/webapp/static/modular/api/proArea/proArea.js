/**
 * 项目地址及用地管理初始化
 */
var ProArea = {
    id: "ProAreaTable",	//表格id
    seItem: null,		//选中的条目
    table: null,
    layerIndex: -1,
    delIds:[]           // 批量删除
};

/**
 * 初始化表格的列
 */
ProArea.initColumn = function () {
    return [
        {field: 'selectItem', checkbox: true},
        {title: 'id', field: 'id', visible: false, align: 'center', valign: 'middle'},
        {title: '操作', field: 'id', visible: true,align: 'center', valign: 'middle', formatter: ProArea.formatOperate}
    ];
};

ProArea.formatOperate = function (val, row, index) {
    var id = row.id;
    var btn_edit = "<button class='btn btn-primary'   onclick='ProArea.openProAreaDetail(" + id + ")'><i class='fa fa-edit'></i> 编辑</button>";
    var btn_del = "<button class='btn btn-danger'   onclick='ProArea.deleteOne(" + id + ")'><i class='fa fa-trash-o'></i> 删除</button>";
    return btn_edit + "&nbsp;&nbsp;&nbsp;" + btn_del;
}
/**
 * 检查是否选中
 */
ProArea.check = function () {
    var selected = $('#' + this.id).bootstrapTable('getSelections');
    if(selected.length == 0){
        Feng.info("请先选中表格中的某一记录！");
        return false;
    }else{
        ProArea.seItem = selected[0];
        ProArea.dealDelIds(selected);
        return true;
    }
};

/**
 * 点击添加项目地址及用地
 */
ProArea.openAddProArea = function () {
    var index = layer.open({
        type: 2,
        title: '添加项目地址及用地',
        area: ['800px', '420px'], //宽高
        fix: false, //不固定
        maxmin: true,
        content: Feng.ctxPath + '/proArea/proArea_add'
    });
    this.layerIndex = index;
};

/**
 * 打开查看项目地址及用地详情
 */
ProArea.openProAreaDetail = function () {
    if (this.check()) {
        var index = layer.open({
            type: 2,
            title: '项目地址及用地详情',
            area: ['800px', '420px'], //宽高
            fix: false, //不固定
            maxmin: true,
            content: Feng.ctxPath + '/proArea/proArea_update/' + ProArea.seItem.id
        });
        this.layerIndex = index;
    }
};
/**
 * 打开查看项目地址及用地详情,不验证是否选中
 */
ProArea.openProAreaOneDetail = function (id) {
    var index = layer.open({
        type: 2,
        title: '部门信息详情',
        area: ['800px', '420px'], //宽高
        fix: false, //不固定
        maxmin: true,
        content: Feng.ctxPath + '/proArea/proArea_update/' + id
    });
    this.layerIndex = index;
};
/**
 * 批量删除项目地址及用地
 */
ProArea.delete = function () {
    if (this.check()) {
         var operation = function(){
             var ajax = new $ax(Feng.ctxPath + "/proArea/delete", function (data) {
                    Feng.success("删除成功!");
                    ProArea.table.refresh();
                }, function (data) {
                    Feng.error("删除失败!" + data.responseJSON.message + "!");
                });
                ajax.set("ids",ProArea.delIds);
                ajax.start();
            };
            Feng.confirm("是否刪除选中项目地址及用地?", operation);
         }
};

/**
 * 删除单个项目地址及用地
 */
ProArea.deleteOne = function (id) {

    var operation = function(){
        var ajax = new $ax(Feng.ctxPath + "/proArea/delete", function (data) {
            Feng.success("删除成功!");
            ProArea.table.refresh();
        }, function (data) {
            Feng.error(data.message + "!");
        });
        ajax.set("ids",id);
        ajax.start();
    };
    Feng.confirm("是否刪除选中项目地址及用地?", operation);

};

/**
 * 查询项目地址及用地列表
 */
ProArea.search = function () {
    var queryData = {};
    queryData['condition'] = $("#condition").val();
    ProArea.table.refresh({query: queryData});
};

ProArea.formatOperate = function (val, row, index) {
    var id = row.id;
    var btn_edit = "<button class='btn btn-primary'   onclick='ProArea.openProAreaOneDetail(" + id + ")'><i class='fa fa-edit'></i> 编辑</button>";
    var btn_del = "<button class='btn btn-danger'   onclick='ProArea.deleteOne(" + id + ")'><i class='fa fa-trash-o'></i> 删除</button>";
    return btn_edit + "&nbsp;&nbsp;&nbsp;" + btn_del;
}

// 封装批量删除的ids
ProArea.dealDelIds = function (selected) {
    ProArea.delIds = "";
    for(var i=0;i<selected.length;i++){
        if (selected[i] != null && i != selected.length -1){
            ProArea.delIds += selected[i].id+",";
        }else {
            ProArea.delIds += selected[i].id;
        }
    }
};

$(function () {
    var defaultColunms = ProArea.initColumn();
    var table = new BSTable(ProArea.id, "/proArea/list", defaultColunms);
    table.setPaginationType("client");
    ProArea.table = table.init();
});
