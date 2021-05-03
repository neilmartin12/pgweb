// pgweb.js
// --------
// 
// JavaScript Password Generator
// 
// Git: https://github.com/neilmartin12/pgweb
// 
// Web: https://pw-generator.herokuapp.com
// 
// E-mail: neilmartin12@me.com
// 

// Event handling function
function handle_event(event_type){
    switch(event_type){
        case 'pwlength':
            var label = document.getElementById('pwlength_label');
            var pwlength = document.getElementById('pwlength');
            label.innerHTML=('Password length: ' + pwlength.value + ' characters')
            generator.pwlength = pwlength.value;
            break;
        
        case 'generate':
            var password = generator.generate_password();
            var pwelement = document.getElementById('password');
            pwelement.innerHTML = password;
            break;

        // Change to select box
        case 'select_length':
        case 'select_lower':
        case 'select_upper':
        case 'select_digit':
        case 'select_symbol':
            var charset = event_type.split('_')[1];
            var select = document.getElementById('select_' + charset).value;
            select_change(charset, select);
            break;

        // Range control being adjusted
        case 'input_min_length':
        case 'input_max_length':
        case 'input_min_lower':
        case 'input_max_lower':
        case 'input_min_upper':
        case 'input_max_upper':
        case 'input_min_digit':
        case 'input_max_digit':
        case 'input_min_symbol':
        case 'input_max_symbol':
            var split_event = event_type.split('_');
            var charset = split_event[2];
            var select = document.getElementById('select_' + charset).value;
            set_label(charset, (select == 'between') ? 'double' : 'single');
            break;

        // Range control has changed i.e. user has stopped adjusting
        case 'change_min_length':
        case 'change_max_length':
        case 'change_min_lower':
        case 'change_max_lower':
        case 'change_min_upper':
        case 'change_max_upper':
        case 'change_min_digit':
        case 'change_max_digit':
        case 'change_min_symbol':
        case 'change_max_symbol':
            var split_event = event_type.split('_');
            var validate = (split_event[1] == 'min') ? 'max':'min';
            validate_range(split_event[2], validate);
            break;
    }
}

// Handle change in a select box
// charset: the character set whose select box has been changed
// value: the new value in the select bos
function select_change(charset, value){
    var min_cell = document.getElementById('cell_min_' + charset);
    var max_cell = document.getElementById('cell_max_' + charset);

    switch(value){
        case 'none':
            min_cell.style.visibility = 'hidden';
            max_cell.style.visibility = 'hidden';
            break;
        
        case 'atleast':
        case 'exactly':
        case 'upto':
            min_cell.style.visibility = 'visible';
            set_label(charset, 'single');
            max_cell.style.visibility = 'hidden';
            break;

        case 'between':
            min_cell.style.visibility = 'visible';
            max_cell.style.visibility = 'visible';
            set_label(charset, 'double');
            break;
    }
}

// Validates the value of a range control
// based on the updated value of a control that has changed
// charset: charset to validate
// range: identifies the range control to validate ('max' or 'min')
function validate_range(charset, range){
    var range_min = document.getElementById('range_min_' + charset);
    var range_max = document.getElementById('range_max_' + charset);
    var min_value = Number(range_min.value);
    var max_value = Number(range_max.value);

    // Validate min range control
    if (range == 'min'){
        if (min_value > (max_value-1)){
            range_min.value = max_value - 1;
        }
    }
    // Validate max range control
    else if (range == 'max'){
        if (max_value < (min_value+1)){
            range_max.value = min_value + 1;
        }
    }
    var select = document.getElementById('select_' + charset).value;
    set_label(charset, (select == 'between') ? 'double' : 'single');
}

// Sets the label of a charset range control
// charset: the charset to set the label for
// mode: 'single' (for min value only) or 'between' (for double value)
function set_label(charset, mode){
    var range_min = document.getElementById('range_min_' + charset);
    var label_min = document.getElementById('label_min_' + charset);
    var cmin = range_min.value;

    if (mode == 'single'){
        // Just set single label
        label_min.innerHTML = get_charset_label(charset, cmin);
    }
    else{
        // Set first label
        label_min.innerHTML = cmin + ' and';

        // Set second label
        var range_max = document.getElementById('range_max_' + charset);
        var label_max = document.getElementById('label_max_' + charset);
        var cmax = range_max.value;
        label_max.innerHTML = get_charset_label(charset, cmax);
    }
}

// Returns the descriptive label for a charset e.g. 2 digits
// charset: the charset to get the label for
// count: the number of characters in this charset
function get_charset_label(charset, count){
    var text = '';
    switch(charset){
        case 'length':
            text = (count == 1) ? 'character' : 'characters';
            break;

        case 'lower':
        case 'upper':
            text = (count == 1) ? 'letter' : 'letters';
            break;
        
        case 'digit':
            text = (count == 1) ? 'digit' : 'digits';
            break;
        
        case 'symbol':
            text = (count == 1) ? 'symbol' : 'symbols';
            break;
    }
    return count + ' ' + text;
}

// Returns a randomly selected character from the string str
function choose_char(str){
    var index = Math.floor(Math.random() * str.length)
    return str.charAt(index)
}

// CharSet object manages a single character set
function CharSet(type){
    this.type = type;
    this.cmin = 0;
    this.cmax = 0;
    this.count = 0;

    switch (type){
        case 'lower':
            this.choices = 'abcdefghijklmnopqrstuvwxyz';
            break;
        case 'upper':
            this.choices = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            break;
        case 'digit':
            this.choices = '0123456789';
            break;
        case 'symbol':
            this.choices = '!@#$%^*()-_';
            break;
    }

    // Returns a string of count length with randome letters from this charset
    this.get_chars = function(){
        var chars = '';
        for (var i = 0; i < this.count; i++){
            chars += this.choose_char();
        }
        return chars;
    }

    // Returns a random letter from this charset
    this.choose_char = function(){
        var index = randint(0, this.choices.length-1);
        return this.choices.charAt(index);
    }
}

// PasswordGenerator class
function PasswordGenerator(){
    this.length = 0;
    this.rules = [
        new CharSet('lower'),
        new CharSet('upper'),
        new CharSet('digit'),
        new CharSet('symbol')
    ];
    this.cookiemgr = new CookieManager();
    
    // Initialize all controls from cookie values if stored
    this.init_from_cookies = function(){

        // Get the cookies as an array
        cookies = this.cookiemgr.read_cookies();

        // Cycle through the cookies and set controls accordingly
        for (var i = 0; i < cookies.length; i++){
            var cookie = cookies[i];

            // Select box
            if (cookie.name.indexOf('select') == 0){
                var select = document.getElementById(cookie.name);
                select.value = cookie.value;
                handle_event(cookie.name);
            }

            // Range control
            else if (cookie.name.indexOf('range') == 0){
                var range = document.getElementById(cookie.name);
                range.value = Number(cookie.value);
                handle_event(cookie.name.replace('range','input'));
            }
        }

        // Cookies toggle
        if (cookies.length > 0){
            document.getElementById('cookies_on').checked = true;
        }
    }

    // Generate and return a password
    this.generate_password = function(){

        // Store settings
        this.cookiemgr.write_cookies();

        // Set the password length
        this.length = this.get_length();

        // Build the rules
        this.build_rules();

        // Get character allocation
        this.get_allocation();

        // Build password
        var password = '';
        for (var i = 0; i < this.rules.length; i++){
            password += this.rules[i].get_chars();
        }

        // Shuffle password
        return shuffle_string(password);
    }

    // Gets the password length according to the current rules
    this.get_length = function(){

        // Get the document elements
        var length_select = document.getElementById('select_length');
        var min_length = document.getElementById('range_min_length');
        var max_length = document.getElementById('range_max_length');

        // Exact length given
        if (length_select.value == 'exactly'){
            return Number(min_length.value);
        }

        // Between two lengths
        var nmin = Number(min_length.value);
        var nmax = Number(max_length.value);
        return randint(nmin, nmax);
    }

    // Build all rules based on user selections
    this.build_rules = function(){
        for (var i = 0; i < this.rules.length; i++){
            var rule = this.rules[i];

            // Get the document elements
            var select = document.getElementById('select_' + rule.type);
            var range_min = document.getElementById('range_min_' + rule.type);
            var range_max = document.getElementById('range_max_' + rule.type);

            // Set min and max values based on select value
            switch(select.value){
                case 'none':
                    rule.cmin = rule.cmax = 0;
                    break;
                
                case 'exactly':
                    rule.cmin = rule.cmax = Number(range_min.value);
                    break;
                
                case 'atleast':
                    rule.cmin = Number(range_min.value);
                    rule.cmax = 0;
                    break;
                
                case 'upto':
                    rule.cmax = Number(range_min.value);
                    rule.cmin = 0;
                    break;
                
                case 'between':
                    rule.cmin = Number(range_min.value);
                    rule.cmax = Number(range_max.value);
                    break;
            }
        }
    }

    // Returns the total number of characters in all rules combined
    this.get_char_count = function(){
        var char_count = 0;
        for (var i = 0; i < this.rules.length; i++){
            char_count += this.rules[i].count;
        }
        return char_count;
    }

    // Allocates characters to each charset in line with current rules
    this.get_allocation = function(){

        // Set each charset to its minimum value
        for (var i = 0; i < this.rules.length; i++){
            var rule = this.rules[i];
            rule.count = rule.cmin;
        }
        // Increase password length if below sum of minimum values
        var char_count = this.get_char_count();
        if (this.length < char_count){
            this.length = char_count;
        }

        // Keep adding characters until we get to the desired length
        while (this.get_char_count() < this.length){
            var valid = [];

            // A charset is valid if its max value has not been reached
            // or it has not max value
            for (var i = 0; i < this.rules.length; i++){
                var rule = this.rules[i];
                if ((rule.cmax == 0) && (rule.cmin > 0)){
                    valid.push(rule);
                }
                else if (rule.count < rule.cmax){
                    valid.push(rule);
                }
            }

            // No valid choice - reached max of all char sets so end
            if (valid.length == 0){
                this.length = this.get_char_count();
                return;
            }

            // Select one valid charset and increment its count
            var choice = randint(0, valid.length - 1);
            valid[choice].count += 1;
        }
    }
}

// Shuffles a string and returns the shuffled version
function shuffle_string(str){

    // Copy of the string
    var original = str.substr(0);

    // Second string for shuffled version
    var shuffled = '';

    // Select characters one by one from the original string
    while (original.length){
        var index = randint(0, original.length-1);
        shuffled += original.charAt(index);
        original = original.substring(0, index) + ((index == (original.length-1)) ? '' : original.substring(index+1));
    }
    return shuffled;
}

// Returns a random integer between nmin and nmax (inclusive)
function randint(nmin, nmax){
    return nmin + Math.floor(Math.random() * (nmax - nmin + 1));
}

// Cookie manager class
function CookieManager(){
    this.cookies_on = document.getElementById('cookies_on');
    this.options = ['length','lower','upper','digit','symbol'];
    this.attrs = ['select','range_min','range_max'];
    
    // Updates all cookies
    this.write_cookies = function(){

        // Set date based on cookies on/off - 1 year in future/past
        var d = new Date();
        var year = 365 * 24 * 60 * 60 * 1000;
        d.setTime(d.getTime() + (this.cookies_on.checked ? year : (-year)));
        var expires = 'expires=' + d.toUTCString();
        
        // Cycle through cookies to write
        for (var i = 0; i < this.options.length; i++){
            for (var j = 0; j < this.attrs.length; j++){
                var option = this.options[i];
                var attr = this.attrs[j];
                var id = attr + '_' + option;
                var elem = document.getElementById(id);
                var value = elem.value;
                document.cookie = 'pwgen_' + id + '=' + value + ';' + expires + ';samesite=lax;path=/';
            }
        }
    }

    // Returns cookie values as an array of objects
    // with attributes name and value
    this.read_cookies = function(){
        var cookie_arr = [];
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++){
            var c = cookies[i].split('=');
            var start = c[0].indexOf('pwgen_');
            if (start >= 0){
                cookie_arr.push({name:c[0].substr(start+6), value:c[1]});
            }
        }
        return cookie_arr;
    }
}