
//渲染页面
var usersArray = []
$(window).on("load", function () {
    $.ajax({
        url: "/users",
        type: "get",
        success: function (response) {
            console.log(response)
            usersArray = response
            var html = template("tmp", {
                users: usersArray
            })
            $("tbody").html(html)
            var htmlAdd = template("adduser")
            $(".md").html(htmlAdd)

        }
    })

})

//添加用户
$(".addBox").on("submit", "#userForm", function () {
    console.log("添加用户")
    var formData = $(".addBox form").serialize()
    $.ajax({
        url: "/users",
        type: "post",
        data: formData,
        success: function (response) {
            usersArray.unshift(response)
            var html = template("tmp", {
                users: usersArray
            })
            $("tbody").html(html)
            var htmlAdd = template("adduser")
            $(".md").html(htmlAdd)
        }
    })
    return false;

})
//上传头像
$(".modifyBox").on("change", "#avatar", function () {
    var fm = new FormData()
    fm.append("avatar", this.files[0])
    $.ajax({
        url: "/upload",
        type: "post",
        data: fm,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log(response)
            $("#avatar").siblings("img").attr("src", response[0].avatar)
            $("#avataraddress").val(response[0].avatar)
        }
    })
})

//修改用户信息
$("tbody").on("click", ".modify", function () {
    var id = $(this).parents("tr").attr("data_id")
    var nickName = $(this).parents("tr").children("td:nth-child(4)").html()
    console.log(nickName)
    $.ajax({
        url: "/users/" + id,
        type: "put",
        data: {
            nickName: nickName
        },
        success: function (response) {
            console.log(response)

            var html = template("modify", {
                user: response
            })
            $(".md").html(html)
        }
    })
})

$(".modifyBox").on("submit", "#modifyForm", function () {
    var formData = $(this).serialize()
    var id = $(this).attr("data_id")
    $.ajax({
        url: "/users/" + id,
        type: "put",
        data: formData,
        success: function (response) {
            var index = usersArray.findIndex(value => value._id == id)
            console.log(index)
            usersArray[index] = response;

            var html = template("tmp", {
                users: usersArray
            })
            $("tbody").html(html)

            var htmlAdd = template("adduser")
            $(".md").html(htmlAdd)
        }
    })
    return false;
})

//删除用户
$("tbody").on("click", ".delete", function () {
    var id = $(this).parents("tr").attr("data_id")
    $.ajax({
        url: "/users/" + id,
        type: "delete",
        success: function (response) {
            console.log(response)
            var index = usersArray.findIndex(value => value._id == id)
            usersArray.splice(index, 1);
            var html = template("tmp", {
                users: usersArray
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
$(".alldelete").show()
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
    console.log(idList)
    $.ajax({
        url: "/users/" + idList,
        type: "delete",
        success: function (response) {
            $.each(selectedArray, function (index, value) {
                usersArray.splice(value - index, 1)
            })
            var html = template("tmp", {
                users: usersArray
            })
            $("tbody").html(html)
        },
        error: function (response) {
            console.log("error")
            console.log(response)
        }
    })
})


