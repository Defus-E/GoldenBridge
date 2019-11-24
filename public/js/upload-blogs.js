$(document).ready(function () {
	const blogs_content = $('.blogs-content');
	const lang = blogs_content.attr('data-value');

	$('#upload-blogs').on('click', function (e) {
		e.preventDefault();

		const _this = this;

		$(_this).prop('disabled', true);

		$.ajax({
			type: "POST",
			url: "/upload-blogs",
			statusCode: {
				200: ({blogs, is_admin, total_elements}) => {
					if ((/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()))) {
						blogs_content.css({"max-height": "+=327.46*3"});
					} else {
						blogs_content.css({"max-height": "+=327.46"});	
					}

					for (let i = 0; i < blogs.length; i++) {
						const blogElement = $(`<div class="blog-item"><a class="blog-content" href="/blogs/id=${blogs[i]._id}"><div class="cover" style="background: url(${blogs[i].cover}) no-repeat"></div><div class="content-text">${blogs[i].title[lang]}</div></a></div>`);

						if (is_admin) blogElement.append(`<a href="/backend/blog/edit-post/id=${blogs[i]._id}" class="edit-blog" uk-icon="pencil" ratio="1"></a>`);
						blogs_content.append(blogElement);
					}

					if (total_elements) $(_this).css({display: 'none'});
					$(_this).prop('disabled', false);
				}
			}
		});

		return false;
	});
});