$(document).ready(function () {
    $('#getcall-form').on('submit', function (e) {
        e.preventDefault();
        
        const form = this;

        $.ajax({
            type: $(form).attr('method'),
            url: $(form).attr('action'),
            data: $(form).serialize(),
            statusCode: {
                200: (response) => {
                    alert(response);
                    $('input, textarea').val('');
                }
            }
        });

        return false;
    });
});