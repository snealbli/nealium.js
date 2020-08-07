/* ╔══════════════════════════════════════╦═════════════════════════╦══════════╗
 * ║ FieldValidator.js                    ║ Created:    5 Jun. 2020 ║ v1.0.0.9 ║
 * ║                                      ║ Last mod.: 24 Jul. 2020 ╚══════════╣
 * ╠══════════════════════════════════════╩════════════════════════════════════╣
 * ║ Description:                                                              ║
 * ║ Used for dynamically validating user input in form fields.                ║
 * ║ Can tell the user which condition(s) their input satisfies, and each that ║ 
 * ║ it still does not, which each keystroke.                                  ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣ 
 * ║ File(s):                                                                  ║
 * ║ FieldValidator.js                                                         ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║ For the latest version of field.js, to report a bug, or to contribute,    ║ 
 * ║ visit:     github.com/snealbli/nealium.js                                 ║
 * ║    or:     code.nealblim.com/nealium.js                                   ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                         by Samuel "teer" Neal-Blim                        ║
 * ║                                                                           ║
 * ║                          Site: nealblim.com                               ║
 * ║                                code.nealblim.com                          ║ 
 * ║                         Git:   github.com/snealbli                        ║
 * ║                     JSfiddle:  jsfiddle.net/user/teeer                    ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║ Copyright (C) 2020  Samuel Neal-Blim                                      ║
 * ║                                                                           ║
 * ║ This program is free software: you can redistribute it and/or modify it   ║
 * ║ under the terms of the GNU General Public License as published by the     ║
 * ║ Free Software Foundation, either version 3 of the License, or (at your    ║
 * ║  option) any later version.                                               ║
 * ║                                                                           ║
 * ║ This program is distributed in the hope that it will be useful, but       ║
 * ║ WITHOUT ANY WARRANTY; without even the implied warranty of                ║
 * ║ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General ║
 * ║ Public License for more details.                                          ║
 * ║                                                                           ║
 * ║ You should have received a copy of the GNU General Public License along   ║
 * ║ with this program.  If not, see https://www.gnu.org/licenses/gpl-3.0.html.║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */
/**
 * @class FieldValidator: dynamically validates a user's input into a form field 
 * against regular expression(s) mapped to their human-readable text 
 * descriptors, and notifies them of which condition(s) their input satisfies.
 */
export default class FieldValidator {
  /**
   * Creates a Field
   */
  constructor(regexes, descriptors, selectors) {
    this._regexes = regexes;
    this._descriptors = descriptors;
    this._selector = selectors;
    this._last_check = null;
  }
  
  /**
   * Returns the size 
   */
  get size() {
	  return this._descriptors.length;
  }
  
  get getSelector() {
   return this._selector;
  }
  
  /**
   * @param end, inclusive
   */
  applyDescriptors(func, start, end) {   
    if (typeof start === 'undefined' || start === null) {
      start = 0;
        
      if (typeof end === 'undefined' || end === null) {
        end = this._descriptors.length;
      } else if (end >= this._regexes.length) {
        return false;
      }
    } else if (typeof end === 'undefined') {
      end = this._descriptors.length;
    } else if ((!Number.isInteger(start) && (start < 0)) || 
               (!Number.isInteger(end) && (end >= this._regexes.length))) {
      return false;
    }
    
    this._descriptors.slice(start, end).forEach((e) => func(e));
    
    return true;
  }
  
  /**
   * @param end, inclusive
   */
  validate(query) {
    if (typeof query === 'undefined' || typeof query !== 'string') {
      return null;
    }
    
    return this._regexes.map(e => e.test(query));
  }
  
  /**
   * 
   */
  addFocusToggleHandlers(focus_selectors, display_selectors) {
    $(focus_selectors).on({
      focus: () => {
        $(display_selectors).show();
      },
      blur: () => {
        $(display_selectors).hide();
      }
    });
  }
  
  /**
   * 
   */
  addInputChangeHandlers(input_selectors, verify_callback) {
    $(input_selectors).on({
      input: (e) => {
        if (e.target.value.length > 0) {
          verify_callback(this.validate(e.target.value));
        }
      }
    });
  }
  
  /**
   * 
   */
  addDefaultListeners(focus_selectors, display_selectors, input_selectors, verify_callback) {    
    if ((focus_selectors === null) || 
        (display_selectors === null) || 
        (input_selectors === null)) {
      return false;
    }
    
    this.addFocusToggleHandlers(focus_selectors, display_selectors);
    this.addInputChangeHandlers(input_selectors, verify_callback);
      
    return true;
  }
}
