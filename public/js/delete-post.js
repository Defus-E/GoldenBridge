$(document).ready(function () {
	$('.delete-post').on('click', function(e) {
		e.preventDefault();

		const _this = this;
		const id = $($(_this).prev('a')).attr('href').match(/[^=]*$/g)[0];

		$.ajax({
			url: '/delete-post',
			method: 'POST',
			data: {id},
			dataType: 'JSON',
			statusCode: {
				200: () => {
					const tr = $(_this).parent().parent();

					tr.remove();
				}
			}
		});

		return false;
	});
});