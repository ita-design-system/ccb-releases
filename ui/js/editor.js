
const editor = new MediumEditor('.editor');
const previewer = {
    message: function(key) {
        let message_string = '-';
        if (typeof key == 'string') {
            if (typeof previewerMessages == 'object') {
                if (typeof previewerMessages[key] == 'string') {
                    message_string = previewerMessages[key];
                } else {
                    message_string = key
                }
            }
        }
        return message_string;
    },
    update: function() {
        document.querySelectorAll('textarea.editor').forEach(function(el) {
            const el_label = document.querySelector('label[for="'+el.id+'"]');
            if (el_label !== null) {
                const el_preview_btn = document.createElement('a');
                el_preview_btn.setAttribute(
                    'class', 
                    `c-dis m-flex m-gap-1 m-cross-baseline m-main-end c-dim m-grow`
                );
                el_preview_btn.href = '#';
                el_preview_btn.style.order = '10';
                el_preview_btn.innerHTML = `${previewer.message('to_preview')} <span class="icon-external-link"></span>`;
                el_preview_btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const el_modal = document.createElement('dialog');
                    el_modal.setAttribute('role', 'dialog');
                    el_modal.setAttribute('open', '');
                    el_modal.id = 'editor-preview';
                    el_modal.innerHTML = `
                    <div class="
                        c-dis m-flex m-column
                        c-dim m-w-100 m-h-100
                        c-pos m-fixed m-top-0 m-left-0 m-z-3
                        c-skin m-bc-grey-light-100">
                        <header class="
                            c-dis m-flex m-main-space-between m-cross-center
                            c-skin m-bbwidth-1 m-bbstyle-solid m-bbcolor-grey-light-500">
                            <h2 class="
                                c-dim m-m-0 m-p-6
                                c-txt m-ff-lead-700">
                                ${previewer.message('preview')}
                            </h2>
                            <form method="dialog" 
                                class="
                                c-dis m-flex m-main-end
                                c-dim m-m-0 m-p-0 m-pr-6"
                                onsubmit="document.querySelector('#editor-preview').remove()">
                                <button class="
                                    c-dis m-flex m-main-center m-cross-center m-gap-1 
                                    c-dim m-p-3 m-pl-6 m-pr-6
                                    c-txt m-ff-lead-700 m-fs-5 m-lh-4 m-td-none 
                                    c-skin m-color-scheme-1 m-cur-pointer m-b-0 m-brad-1 m-transition-1">
                                    ${previewer.message('close')}
                                </button>
                            </form>
                        </header>
                        <div class="
                            c-dis m-flex m-main-center m-cross-center
                            c-dim m-w-100 m-h-100
                            c-pos m-relative
                            c-skin m-bc-grey-light-300">
                            ${previewer.message('loading')}...
                            <iframe src="${location.protocol}//${location.host}"
                                class="
                                c-pos m-absolute m-top-0 m-left-0
                                c-dim m-w-100 m-h-100
                                c-skin m-b-0 m-opa-0 m-transition-1"
                                onload="previewer.callbacks.run()"></iframe>
                        </div>
                    </div>`;
                    document.body.appendChild(el_modal);
                });
                el_label.appendChild(el_preview_btn);
            }
        })
    },
    callbacks: {
        run: function() {
            const el_iframe = document.querySelector('#editor-preview iframe');
            if (el_iframe !== null) {
                el_iframe.contentDocument.body.innerHTML = `<div class="wysiwyg">${editor.getContent()}</div>`;
                el_iframe.classList.remove('m-opa-0');
            }
        }
    }
}
previewer.update()