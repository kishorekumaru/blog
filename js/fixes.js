// JavaScript Document
$('#YourModal').modal().css(
{
	'margin-top': function () {
		return -($(this).height() / 2);
	}
})