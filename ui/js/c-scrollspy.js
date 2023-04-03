/**
 * SCROLLSPY
 * 
 */
const cScrollspy = {
    defaults: {
        options: null,
        callback: function(data) {
            // console.log('callback par défaut invoqué');
        }
    },
    callbacks: {
        /**
        * SCROLLER
        * Settings for scroll snap type container
        */
        scroller: {
            options: {
                threshold: [0.8]
            },
            callback: function(data) {
                // console.log(data);
                // Id of the tracked target element
                // const id = data[0].target.id;
                // console.log(id, data[0].target.dataset.targetId, data[0].intersectionRatio);
                // 
                const target_id = data[0].target.dataset.targetId;
                if (cScrollspy.callbacks.scroller.elements === undefined) {
                    cScrollspy.callbacks.scroller.elements = {};
                }
                if (cScrollspy.callbacks.scroller.elements[target_id] === undefined) {
                    cScrollspy.callbacks.scroller.elements[target_id] = document.querySelector('#'+target_id);
                }
                // Alias
                const el_target_id = cScrollspy.callbacks.scroller.elements[target_id];
                // Work only if a target exists
                if (el_target_id !== null) {
                    // If listener is not already set
                    if (el_target_id.onclick === null) {
                        // Get the command (previous or next) through the attriblue aria-command
                        // aria-command="previous" adds a listerner that scroll to previous element
                        // aria-command="next" adds a listerner that scroll to next element
                        const target_command = el_target_id.getAttribute('aria-command');
                        if (target_command == 'next' || target_command == 'previous') {
                            el_target_id.addEventListener('click', function(el) {
                                // get the with of the element and use it as default increment/decrement amount of scroll
                                const width_of_el = data[0].target.clientWidth;
                                const current_scroll_left = data[0].target.parentElement.scrollLeft;
                                // console.log(width_of_el, current_scroll_left);
                                let amount_of_scroll = current_scroll_left + width_of_el;
                                if (target_command == 'previous') {
                                    amount_of_scroll = current_scroll_left - width_of_el;
                                }
                                data[0].target.parentElement.scrollTo({
                                    behavior: 'smooth',
                                    left: amount_of_scroll
                                });
                            });
                        }
                    }
                    if (data[0].intersectionRatio > 0.8) {
                        // el_target_id.classList.add('u-disabled');
                        el_target_id.disabled = true;
                    } else {
                        // el_target_id.classList.remove('u-disabled');
                        el_target_id.disabled = false;
                    }
                }
            }
        },
        /**
        * ANCHORS
        * Options for anchors links -> HTML ids
        */
        anchors: {
            options: {
                threshold: [0, 0.2, 0.8, 1]
            },
            /**
            * CALLBACK
            * CALLBACK METHOD
            * @arg {(object)} data event data returned by intersectonObserver
            */
            callback: function(data) {
                // Id of the tracked target element
                const id = data[0].target.id;
                // console.log(id);

                // myScrollspy.custom_parameters.anchors.tracked_elements_y[id] = data[0].boundingClientRect.y;

                // Write intersection ratio into an custom object
                cScrollspy.callbacks.anchors.intersections[id] = data[0].intersectionRatio;
                // Get current id => intersection values
                const current_intersections = cScrollspy.callbacks.anchors.intersections;

                
                // Sort intersection values
                const intersections_sorted = Object.keys(current_intersections).sort(function(a,b){return current_intersections[b]-current_intersections[a]});
                // Get the id of the first/highest intersection value
                const first_intersection_id = intersections_sorted[0];
                // Get the id of the second/highest intersection value
                const second_intersection_id = intersections_sorted[1];
                // Iterate all specified tracked ids/elements
                intersections_sorted.forEach(function(id, index) {
                    // Search for all anchors links pointing to this id
                    document.querySelectorAll('[href="#'+id+'"]').forEach(function(el_anchor) {
                        if (el_anchor.dataset.classOrigin === undefined) {
                            el_anchor.dataset.classOrigin = el_anchor.getAttribute('class');
                        } else {
                            el_anchor.setAttribute('class', el_anchor.dataset.classOrigin);
                        }
                        // The value of the first/highest intersection
                        const first_intersection_id_value = cScrollspy.callbacks.anchors.intersections[first_intersection_id];
                        // The value of the second/highest intersection
                        const second_intersection_id_value = cScrollspy.callbacks.anchors.intersections[second_intersection_id];
                        // If it is the highest intersection, apply active class
                        // Second intersection must be inferior to first intersection value to avoid "active" class mismatch
                        if (first_intersection_id == id && second_intersection_id_value < first_intersection_id_value) {
                            if (el_anchor.dataset.activeClass !== undefined) {
                                el_anchor.setAttribute('class', el_anchor.dataset.activeClass);
                            }
                        }
                    });
                });
            },
            // To be populated by keys: ids of tracked elements associated to their intersections ratio values
            intersections: {},
            // tracked_elements_y: {}
        }
    },
    // All instances of intersections
    instances: {},
    // Method to invoke at start and each time DOM has changed
    update: function() {
        // Iterate all the scrollspy attributes
        document.querySelectorAll('[c-scrollspy]').forEach(function(el, index) {
            // Value = custom option name for the current tracked element
            const custom_params_name = el.getAttribute('c-scrollspy');
            // Custom parameter must be an object
            if (typeof cScrollspy.callbacks[custom_params_name] == 'object') {
                // Set default options for intersectionObserver
                let instance_options = cScrollspy.defaults.options;
                // If custom options is an object, then use it
                if (typeof cScrollspy.callbacks[custom_params_name]['options'] == 'object') {
                    // console.log('options trouvées dans les paramètres');
                    instance_options = cScrollspy.callbacks[custom_params_name]['options'];
                }
                // Set default callback for intersectionObserver
                let instance_callback = cScrollspy.defaults.callback;
                // If custom callback is a function, then use it
                if (typeof cScrollspy.callbacks[custom_params_name]['callback'] == 'function') {
                    // console.log('callback ok');
                    instance_callback = cScrollspy.callbacks[custom_params_name]['callback'];
                }
                // Set default instance id
                let instance_id = 'spy_'+index;
                // If tracked element has an id, use it
                if (el.id != '') {
                    instance_id = el.id;
                }
                // Create intersection observer as an object into myScrollspy
                cScrollspy.instances[instance_id] = new IntersectionObserver(instance_callback, instance_options);
                // Track element
                cScrollspy.instances[instance_id].observe(el);
            } else {
                console.log('paramètres perso non définis :'+custom_params_name);
            }
        });
    }
}
cScrollspy.update();