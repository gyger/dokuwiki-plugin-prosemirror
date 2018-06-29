jQuery(function initializeProsemirror() {

    const $toggleEditorButton = jQuery('.plugin_prosemirror_useWYSIWYG');
    $toggleEditorButton.on('click', function() {
        window.onbeforeunload = '';
        window.textChanged = false;
        window.keepDraft = true; // needed to keep draft on page unload
        const $current = DokuCookie.getValue('plugin_prosemirror_useWYSIWYG');
        DokuCookie.setValue('plugin_prosemirror_useWYSIWYG', $current ? '' : '1');
    });

    const $jsonField = jQuery('#dw__editform').find('[name=prosemirror_json]');
    if (!$jsonField.length) {
        return;
    }
    $jsonField.attr('id', 'prosemirror_json');

    try {
        /* DOKUWIKI:include lib/bundle.js */
    } catch (e) {
        const $textArea = jQuery('#wiki__text');
        let message = 'There was an error in the WYSIWYG editor. You will be redirected to the syntax editor in 5 seconds.';
        if (window.SentryPlugin) {
            SentryPlugin.logSentryException(e, {
                tags: {
                    plugin: 'prosemirror',
                    'id': JSINFO.id,
                },
                extra: {
                    'content': $textArea.val(),
                }
            });
            message += ' The error has been logged to sentry.';
        }
        $textArea.replaceWith('<div class="error">'+ message + '</div>');
        setTimeout(function() {
            $toggleEditorButton.click();
        }, 5000);
        return;
    }

    if (dw_locktimer.addField) {
        // FIXME remove this guard after the next stable DokuWiki release after Greebo
        dw_locktimer.init(dw_locktimer.timeout, dw_locktimer.draft, 'prosemirror__editor');
        dw_locktimer.addField('input[name=prosemirror_json]');
    } else {
        console.warn('Draft saving in WYSIWYG is not available. Please upgrade your wiki to the current development snapshot.')
    }

    jQuery('#wiki__text').hide();
    jQuery('#size__ctl').hide();
    jQuery('.editBox > .toolbar').hide();
});
