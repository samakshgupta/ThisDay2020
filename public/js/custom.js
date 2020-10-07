function showErrorMessage(message){
	$('.flash-message > .alert-danger').html(message);
	$('.flash-message > .alert-danger').removeClass('d-none');
	$('.flash-message > .alert-danger').fadeIn();
	setTimeout(function() {
		$('.flash-message > .alert-danger').fadeOut('slow');
	}, 3000);
}

String.prototype.trunc = String.prototype.trunc ||
      function(n){
          return (this.length > n) ? this.substr(0, n-1) + '&hellip;' : this;
      };

function showSuccessMessage(message){
	$('.flash-message > .alert-success').html(message);
	$('.flash-message > .alert-success').removeClass('d-none');
	$('.flash-message > .alert-success').fadeIn();
	setTimeout(function() {
		$('.flash-message > .alert-success').fadeOut('slow');
	}, 3000);
}

function showLoader(){
	$('#loader').addClass('fadeIn');
	$('#loader').removeClass('fadeOut');
	$('#loader').css('opacity', '0.6');
}

function hideLoader(){
	$('#loader').addClass('fadeOut');
	$('#loader').removeClass('fadeIn');
	$('#loader').css('opacity', '1');
}

$(document).ready(function(){
	setTimeout(function() {
		jQuery('.alert').fadeOut();
	}, 5000);

	$(window).scroll(function() {
if ($(this).scrollTop() > 1){
    $('header').addClass("sticky");
  }
  else{
    $('header').removeClass("sticky");
  }
});
	$(document).on('click', 'a[href^="#"]', function (event) {
		event.preventDefault();

		$('html, body').animate({
			scrollTop: $($.attr(this, 'href')).offset().top-120
		}, 500);

	});

	$(window).scroll(function() {
		if($('.flash-message').length > 0){
			var theLoc = $('.flash-message').position().top;
	        if(theLoc >= $(window).scrollTop()) {
	            if($('.flash-message').hasClass('position-fixed')) {
	                $('.flash-message').removeClass('position-fixed');
	                $('.flash-message').css({top : "auto"});

	            }
	        } else {
	            if(!$('.flash-message').hasClass('position-fixed')) {
	                $('.flash-message').addClass('position-fixed');
	                $('.flash-message').css({top : "0px"});
	            }
	        }
    	}
	});

	$('#answersDataTable').DataTable({
		'dom' : 'lBfrtip',
		buttons: {
			buttons: [
				{
					extend : 'excelHtml5',
					text : 'Download',
					className : "btn cur-p btn-info white"
				}

			]
		},
		searching: false,
		paging: false,
		ordering: false,
		info: false,
		"columns": [
				{ data: 'question' },
				{ data: 'answer' },
		],
	});

	let token = $('#token').val();
	if(token){
		localStorage.setItem('token', token);
	}

	let ls_token = localStorage.getItem('token');
	if(ls_token){
		$('#sign_token').val(ls_token);
		$('#token').val(ls_token);
		$('#admin_token').val(ls_token);
	}

	$('#gender1').css('background-color', 'white');

});
