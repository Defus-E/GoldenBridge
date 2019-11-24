Dropzone.options.myDropzone = {
	url: '/edit-post',
	autoProcessQueue: false,
	uploadMultiple: true,
	addRemoveLinks: true,
	acceptedFiles: ".jpeg,.jpg,.png,.webp",
	maxFiles: 1,
	init: function () {
		const self = this;

		let formDataInputs;

		$('form').submit(function (e) {
			e.preventDefault();
			e.stopPropagation();

			const form = this;

			formDataInputs = $(form).serializeArray();

			if (self.getQueuedFiles().length > 0) {
				self.processQueue();
			} else {
				sendAjaxData(form, formDataInputs);
			}
		});

		self.on("sending", (data, xhr, formData) => {
			$.each(formDataInputs, (key, {name,value}) => {
				if (name === 'content') {
					value = value.replace(/\s\s+/g, ' ');
				}

				formData.append(name, value);
			});

			formData.append('id', getID(window.location.pathname));
			setTimeout(() => {
				self.removeAllFiles(true);
			}, 3000)
		});

		self.on("maxfilesexceeded", function (file) {
			alert('Вы не можете загрузить больше одного изображения!');
			this.removeFile(file);
		});
	}
}

function sendAjaxData(form, formDataInputs) {
	const formData = new FormData();

	$.each(formDataInputs, (key, {name, value}) => {
		if (name === 'content') {
			value = value.replace(/\s\s+/g, ' ');
		}

		formData.append(name, value);
	});

	formData.append('id', getID(window.location.pathname));

	$.ajax({
		type: $(form).attr('method'),
		url: $(form).attr('action'),
		data: formData,
		processData: false,
      contentType: false,
		statusCode: {
			200: () => {
				alert('Изменения сохранены!');
			}
		}
	});
}

function getID(url) {
	return id = url.substring(url.lastIndexOf('/') + 1).match(/[^=]*$/g)[0];
}