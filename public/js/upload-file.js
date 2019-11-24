const optionsF = {
	url: '/order-transfer',
	autoProcessQueue: false,
	uploadMultiple: true,
	addRemoveLinks: true,
	maxFilesize: 500,
	acceptedFiles: ".jpeg,.jpg,.png,.webp,.svg,.html,.css,.pdf,.gif,.doc,.docx,.htm,.sass,.scss,.pug,.bmp,.fb2,.lit,.txt,.rtf,.loc,.mp3,.avi,.mpeg,.mpeg-1,.mpeg-2,.mpeg-3,.dv,.dvd,.cfg",
	previewsContainer: "#preview-container",
	init: function() {
		initF.call(this, '#just-form');
	}
}
const optionsS = {
	url: '/order-transfer',
	autoProcessQueue: false,
	uploadMultiple: true,
	addRemoveLinks: true,
	maxFilesize: 500,
	acceptedFiles: ".jpeg,.jpg,.png,.webp,.svg,.html,.css,.pdf,.gif,.doc,.docx,.htm,.sass,.scss,.pug,.bmp,.fb2,.lit,.txt,.rtf,.loc,.mp3,.avi,.mpeg,.mpeg-1,.mpeg-2,.mpeg-3,.dv,.dvd,.cfg",
	previewsContainer: "#preview-container-main",
	init: function() {
		initF.call(this, '#modal-form');
	}
}

function sendAjaxData(form, formDataInputs) {
	const formData = new FormData();

	$.each(formDataInputs, (key, {name, value}) => {
		formData.append(name, value);
	});

	$.ajax({
		type: $(form).attr('method'),
		url: $(form).attr('action'),
		data: formData,
		processData: false,
    	contentType: false,
		statusCode: {
			200: (message) => {
				$('input, textarea').val('');
				alert(message);
			},
			403: (jqXHR) => {
				const error = JSON.parse(jqXHR.responseText);
				alert(error.reason);
			}
		}
	});
}

function initF(form_query) {
	const self = this;

	let formDataInputs;

	$(form_query).on('submit', function (e) {
		e.preventDefault();
		e.stopPropagation();

		const form = this;

		formDataInputs = $(form).serializeArray();
		
		if (self.getQueuedFiles().length > 0) {
			self.processQueue();
		} else {
			sendAjaxData(form, formDataInputs);
		}

		return false;
	});

	self.on("sending", (data, xhr, formData) => {
		$.each(formDataInputs, (key, {name, value}) => {
			formData.append(name, value);
		});
	});

	self.on("success", (file, res) => {
		self.removeAllFiles(true);
		alert(res);
		$('input, textarea').val('');
	});

	self.on("error", (file, err) => {
		self.removeAllFiles(true);
		alert(err.reason);
	});
}

Dropzone.options.myDropzone = optionsF;
Dropzone.options.headDropzone = optionsS;