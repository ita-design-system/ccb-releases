/**
 * FORMS UTILITIES
 * A small library dedicated to forms
 */
const cForms = {
    callbacks: {
        /**
         * validation
         * When invoked, compare current input value with its original value
         * If equal, revert original classes and remove m-valid-invalid-1
         * If not, add m-valid-invalid-1 class
         * @param {Object} el - DOM input element
         */
        validation: function(el) {
            // check if element id matches cForms.instances
            if (typeof cForms.instances[el.id] == 'object') {
                // Compare current input value with original value
                if (cForms.instances[el.id].el.value == cForms.instances[el.id].value_origin) {
                    cForms.instances[el.id].el.setAttribute('class', cForms.instances[el.id].class_origin);
                    cForms.instances[el.id].el.classList.remove('m-valid-invalid-1');
                } else {
                    cForms.instances[el.id].el.classList.add('m-valid-invalid-1');
                }
            }
        }
    },
    /**
     * reset
     * Revert all c-form input element to their original state
     * If no options, reset classes and values
     * @param {Object} options - optional parameters
     * @param {Boolean} options.classes - Revert classes only
     * @param {Boolean} options.values - Revert values only
     */
    reset: function(options) {
        Object.keys(cForms.instances).forEach(function(id) {
            if (typeof options == 'object') {
                if (options.values) {
                    cForms.instances[id].el.value = cForms.instances[id].value_origin;
                }
                if (options.classes) {
                    cForms.instances[id].el.setAttribute('class', cForms.instances[id].class_origin);
                }
            } else {
                cForms.instances[id].el.setAttribute('class', cForms.instances[id].class_origin);
                cForms.instances[id].el.value = cForms.instances[id].value_origin;
            }
        })
    },
    /**
     * update
     * Init c-form instances
     * Invoke at page start and on each DOM change
     */
    update: function() {
        document.querySelectorAll('.c-form').forEach(function(el) {
            // id is mandatory
            if (el.id != '') {
                if (typeof cForms.instances == 'undefined') {
                    cForms.instances = {}
                }
                // Save class and value before doing anything
                const class_origin = el.getAttribute('class');
                const value_origin = el.value;
                cForms.instances[el.id] = {
                    el: el,
                    class_origin: class_origin,
                    value_origin: value_origin
                }
            }
        });
    },
    togglePasswordView: function(el) {
        const el_input_target = el.parentElement.parentElement.querySelector('input.c-form');
        const el_icon = document.querySelector('label[for="'+el.id+'"] [class*="icon-"]');
        if (el.checked) {
            el_input_target.type = 'text';
            if (el_icon !== null) {
                el_icon.classList.remove('icon-eye_line');
                el_icon.classList.add('icon-eye_close_line');
            }
        } else {
            el_input_target.type = 'password';
            if (el_icon !== null) {
                el_icon.classList.add('icon-eye_line');
                el_icon.classList.remove('icon-eye_close_line');
            }
        }
    }
}
cForms.update();

