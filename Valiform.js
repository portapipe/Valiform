/*
REQUIRED
• JQUERY
*/

//This will print in console all the debug messages
var debug = true;

//This will override the html5 browser validation. If false, this validation will be activated after the default browser validation
var override_html5_validation = false;

function log_valiform(text){ if(debug) console.log("[Valiform] "+text);	}

var field, fieldval;


if(typeof jQuery == "undefined" ){
	console.log("[Valiform] jQuery not installed!");
}else{
	
	log_valiform("jQuery loaded!")
	init_valiform_messages();
	init_valiform_rules();
	
	$(document).ready(function(){
		
		if(override_html5_validation){
			log_valiform("HTML5 validation override found! Adding novalidate attribute to every form.");

			$(document).find("form").each(function(){
				if($(this).attr("novalidate")===undefined){
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

//Call this function to validate the form without submitting it
function valiform(form){
	log_valiform("Form submitted by explicit request.")
	if(clear_errors_valiform())
		return form_validation_valiform(this);
}


//Validation of the single input fields of a specific form
function form_validation_valiform(form){
	
	var valid = false;
	
	$(form).find(':input').each(function(){
		field = $(this);
		fieldval = field.val();
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
	$(field).after("<div class='valiform_error' style='color:red;'>"+msg+"</div>")

}

//clear all the errors shown in the form
function clear_errors_valiform(){
	$('.valiform_error').each(function(){
		$(this).remove();
	})
	return true;
}

//Initialize all the messages. Change them if you want to localize it
function init_valiform_messages(){
	
	generic_error = "Field not valid";
	field_required = "This field is required";
	min_length = "The field does not meet the minimum required length of {optional_value}";
	max_length = "The field exceedes the maxium allowed length of {optional_value}";
	email_not_valid = "Email is not valid";
	number_not_valid = "The value is not a valid number";
	integer_not_valid = "The value is not a valid integer";
	
	log_valiform("Messages initialized");
}

//REGEX Rules to validate some fields. If you have some enhancement to submit just create a pull request: this will help everyone!
function init_valiform_rules(){
	email_rule = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,6})+$/;
	integer_rule = /^([0-9])+$/;

}