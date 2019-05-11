/*
REQUIRED
• JQUERY
*/

//This will print in console all the debug messages
var debug = false;

//Skip the validation if there is no name attribute, default true
var skip_no_name = true;

//This will override the html5 browser validation. If false, this validation will be activated after the default browser validation
var override_html5_validation = false;

function log_valiform(text){ if(debug) console.log("[Valiform] "+text);	}

var field, fieldval;


document.addEventListener('DOMContentLoaded', function(){ 
	if(typeof jQuery == "undefined" ){
		console.log("[Valiform] jQuery not installed!");
	}else{
		
		init_valiform_messages();
		init_valiform_rules();
	
			
			
		//Get the script tag of Valiform.js to get his attributes
		var script_tag = $("script[src*='Valiform.js']");
		
		//Check for debug tag in the script src
		if(script_tag.attr("debug")!==undefined){
			if(script_tag.attr("debug")=="true"){
				debug = true;
			}else{
				debug = false;
			}
			log_valiform("Found the attribute debug and it will be used to set the variable!");
		}
		//Check for overrite_html5_validation tag in the script src
		if(script_tag.attr("override_html5_validation")!==undefined){
			if(script_tag.attr("override_html5_validation")=="true"){
				override_html5_validation = true;
			}else{
				override_html5_validation = false;
			}
			log_valiform("Found the attribute override_html5_validation and it will be used to set the variable!");
		}
		//Check for skip_no_name tag in the script src
		if(script_tag.attr("skip_no_name")!==undefined){
			if(script_tag.attr("skip_no_name")=="true"){
				skip_no_name = true;
			}else{
				skip_no_name = false;
			}
			log_valiform("Found the attribute skip_no_name and it will be used to set the variable!");
		}
		
		
		log_valiform("jQuery loaded!")
		
		
		//Check if bootstrap is loaded
		if(typeof($.fn.popover) != 'undefined'){
			log_valiform("Bootstrap is loaded: I'm going to use it for the error popups!");
			$("body").append("<style>\
			.popover{\
				background-color: red;\
			}\
			.popover-body{\
				color: white;\
			}\
			.popover > .arrow::after{\
				border-bottom-color: red;\
			}\
			</style>");
		}
		
		$(document).ready(function(){
			
			if(override_html5_validation){
				log_valiform("HTML5 validation override found! Adding novalidate attribute to every form.");
	
				$(document).find("form").each(function(){
					if($(this).attr("novalidate")===undefined && $(this).attr("novaliform")===undefined){
						$(this).attr("novalidate","novalidate");
					}
				})
			}
			
		})
		
		$(document).on("submit","form",function(form){
			log_valiform("Form submitted by submitting a form.")
			if(clear_errors_valiform())
				return form_validation_valiform(this);
		})
		
		
	}
})

//Call this function to validate the form without submitting it
function valiform(form){
	log_valiform("Form submitted by explicit request.")
	if(clear_errors_valiform())
		return form_validation_valiform(this);
}


//Validation of the single input fields of a specific form
function form_validation_valiform(form){
	
	var valid = false;
	
	if($(form).attr("novaliform")!==undefined) return true;
	
	$(form).find(':input').each(function(){
		field = $(this);
		fieldval = field.val();
		
		if(field.attr("name")===undefined && skip_no_name) return true;
		
		log_valiform("Input "+field.attr("name")+" found");
		
		var required = false;
		if(field.attr("required")!==undefined) required = true;
		
		
		//REQUIRED
		if(field.attr("required")!==undefined && fieldval==""){
			log_valiform("Field required but empty");
			error_valiform(field,"required");
			valid = false;
			return true;
		}
		
		
		//EMAIL
		if(field.attr("type")=="email" && !email_rule.test(fieldval)){
			
			if(required || (!required && fieldval!="") ){
				log_valiform("Field is not a valid email");
				error_valiform(field,"email");
				valid = false;
				return true;
			}
		}
		
		//TODO RADIO
		if(field.attr("max")!==undefined && fieldval.length>field.attr("max")){
			if(required || (!required && fieldval!="") ){
				log_valiform("Field value is too long");
				error_valiform(field,"max",field.attr("max"));
				valid = false;
				return true;
			}
		}
		

		//NUMERIC
		if(field.attr("type")=="number" && isNaN(parseFloat(fieldval))){
			if(required || (!required && fieldval!="") ){
				log_valiform("Field is not a valid number");
				error_valiform(field,"number");
				valid = false;
				return true;
			}
		}
		
		
		//INTEGER
		if(field.attr("type")=="integer" && !integer_rule.test(fieldval)){
			if(required || (!required && fieldval!="") ){
				log_valiform("Field is not a valid integer");
				error_valiform(field,"integer");
				valid = false;
				return true;
			}
		}
		
		//MIN
		if(field.attr("min")!==undefined && fieldval.length<field.attr("min")){
			if(required || (!required && fieldval!="") ){
				log_valiform("Field value is not long enough");
				error_valiform(field,"min",field.attr("min"));
				valid = false;
				return true;
			}
		}
		
		//MAX
		if(field.attr("max")!==undefined && fieldval.length>field.attr("max")){
			if(required || (!required && fieldval!="") ){
				log_valiform("Field value is too long");
				error_valiform(field,"max",field.attr("max"));
				valid = false;
				return true;
			}
		}
		
		
		
		
	})
	
	return valid;
}

//This function create the error message based on the error type
//If you want to change the estetics, you can change it here IF you know what you're doing!
function error_valiform(field,error_type,optional_value){
	var msg = generic_error;
	switch(error_type){
		case "required":
			msg = field_required;
			break;
		case "email":
			msg = email_not_valid;
			break;
		case "min":
			msg = min_length;
			break;
		case "max":
			msg = max_length;
			break;
		case "number":
			msg = number_not_valid;
			break;
		case "integer":
			msg = integer_not_valid;
			break;
	}
	
	//replace optional value in message
	msg = msg.replace("{optional_value}", optional_value);
	
	//Use valiform_error class to have it cleared by the clear_errors_valiform() function
	if(typeof($.fn.popover) != 'undefined'){
		$(field).popover({content:msg,placement:'bottom'}).popover('show');
		$(field).attr("onkeydown","hide_popover_valiform('"+$(field).attr("aria-describedby")+"',this);");		

	}else{
		$(field).after(" <span style='color:red;' class='valiform_error'><strong>"+msg+"</strong></span>")
	}

}

//clear all the errors shown in the form
function clear_errors_valiform(){
	$('.valiform_error').each(function(){
		$(this).remove();
	})
	$('.popover').each(function(){
		$(this).popover('dispose');
	})
	return true;
}


function hide_popover_valiform(popover_id,field){
	$(field).removeAttr('onkeyup');
	$('#'+popover_id).popover('dispose');
}
//Initialize all the messages. Change them if you want to localize it
function init_valiform_messages(){
	
	if(typeof(generic_error) === undefined){
		generic_error = "Field not valid";
		field_required = "This field is required";
		min_length = "The field does not meet the minimum required length of {optional_value}";
		max_length = "The field exceedes the maxium allowed length of {optional_value}";
		email_not_valid = "Email is not valid";
		number_not_valid = "The value is not a valid number";
		integer_not_valid = "The value is not a valid integer";
		
		log_valiform("Messages initialized");
	}else{
		log_valiform("Messages already initialized from another file");
	}
}

//REGEX Rules to validate some fields. If you have some enhancement to submit just create a pull request: this will help everyone!
function init_valiform_rules(){
	email_rule = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,6})+$/;
	integer_rule = /^([0-9])+$/;

}