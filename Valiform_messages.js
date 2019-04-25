//Insert here every translation you need to change
//ATTENTION! THIS MESSAGES ARE INCLUDED IN THE MAIN Valiform.js FILE SO THIS FILE IS OPTIONAL IF YOU DON'T NEED TO CHANGE THE TEXTS!



var main_language = "it";

//This will check if you have set a "language" parameter in the script src tag and use the language you've choose

console.log("[Valiform] Found Valiform_messages.js, checking...");

$(document).ready(function(){
	
	var script_messages_tag = $("script[src*='Valiform_messages.js']");
	
	log_valiform("Additional Valiform_messages.js found and loaded");

	if(script_messages_tag.attr("lang")!==undefined){
		main_language = script_messages_tag.attr("lang");
		log_valiform("Tag Lang for messages.js found! Loading language '"+main_language+"'...")
	}
	
	
	//ITALIANO
	if(main_language == "it"){
		log_valiform("... lingua italiana CARICATA!")
	
		generic_error = "Campo non valido";
		field_required = "Campo richiesto";
		min_length = "Valore troppo corto! Lunghezza minima {optional_value} caratteri";
		max_length = "Valore troppo lungo! Lunghezza massima {optional_value} caratteri";
		email_not_valid = "Email non valida";
		number_not_valid = "Il valore non è un numero";
		integer_not_valid = "Il valore non è un numero intero";
		
	}
	
	
})

