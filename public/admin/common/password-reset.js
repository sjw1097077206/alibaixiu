$(".modifyPass").on("submit", function () {
    var formData = $(this).serialize()
    $.ajax({
        url: "/users/password",
        type: "put",
        data: formData,
        success: function (response) {
            console.log(response);
            location.href = "login.html"
        }
    })

    return false;
})