var categoriesArray = []

//渲染页面
$(window).on("load", function () {
    $.ajax({
        url: "/categories",
        type: "get",
        success: function (response) {
            // console.log(response)
            categoriesArray = response
            var html = template("tmp", {
                categoriesArray: categoriesArray
            })
            $("tbody").html(html)

            var html = template("addcategories")
            $(".addBox").html(html)
        }
    })
})

//添加事件
$(".addBox").on("submit", "#classity", function () {
    var formData = $(this).serialize()
    $.ajax({
        url: "/categories",
        type: 'post',
        data: formData,
        success: function (response) {
            categoriesArray.push(response)
            var html = template("tmp", {
                categoriesArray: categoriesArray
            })
            $("tbody").html(html)

            var html = template("addcategories")
            $(".addBox").html(html)
        }
    })
    return false;
})

//修改按钮事件
$("tbody").on("click", ".modify", function () {
    var id = $(this).parents("tr").attr("data_id")
    $.ajax({
        url: "/categories/" + id,
        type: "put",
        success: function (response) {
            console.log(response)
            var html = template("modify", {
                response: response
            })
            $(".addBox").html(html)
        }
    })
})

//修改事件
$(".addBox").on("submit", "#modifyclassity", function () {
    var id = $(this).attr("data_id")
    var dataForm = $(this).serialize()
    $.ajax({
        url: "/categories/" + id,
        type: "put",
        data: dataForm,
        success: function (response) {
            var index = categoriesArray.findIndex(value => value._id == id)
            categoriesArray[index] = response;

            var html = template("tmp", {
                categoriesArray: categoriesArray
            })
            $("tbody").html(html)

            var html = template("addcategories")
            $(".addBox").html(html)
        }
    })
    return false;
})

//删除用户
$("tbody").on("click", ".delete", function () {
    var id = $(this).parents("tr").attr("data_id")
    $.ajax({
        url: "/categories/" + id,
        type: "delete",
        success: function (response) {
            console.log(response)
            var index = categoriesArray.findIndex(value => value._id == id)
            categoriesArray.splice(index, 1);
            var html = template("tmp", {
                categoriesArray: categoriesArray
            })
            $("tbody").html(html)
        }
    })
})

//全选
$("th input").on("click", function () {
    var checked = $("th input").prop("checked")
    $("td input").prop("checked", checked == true ? true : false)
})
$("tbody").on("change", "td input", function () {
    var selectedArray = []
    var unselectedArray = []
    $.each($("tbody td input"), function (index, value) {
        ($(value).prop("checked") == true ? selectedArray : unselectedArray).push(index)
    })
    $("th input").prop("checked", unselectedArray.length == 0 ? true : false)
})

//批量删除
$(".alldelete").on("click", function () {
    var selectedArray = []
    var unselectedArray = []
    $.each($("tbody td input"), function (index, value) {
        ($(value).prop("checked") == true ? selectedArray : unselectedArray).push(index)
    })
    var selectedIdArray = []
    $.each(selectedArray, function (index, value) {
        selectedIdArray.push($($("tbody tr")[value]).attr("data_id"))
    })
    var idList = selectedIdArray.join("-")
    $.ajax({
        url: "/categories/" + idList,
        type: "delete",
        success: function (response) {
            $.each(selectedArray, function (index, value) {
                categoriesArray.splice(value - index, 1)
            })
            //渲染用户列表
            var html = template("tmp", {
                categoriesArray: categoriesArray
            })
            $("tbody").html(html)
        },
        error: function (response) {
            console.log("error")
            console.log(response)
        }
    })
})