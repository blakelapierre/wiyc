'use strict';

function PulsarContenteditableDirective ( ) {
  return {
    'restrict': 'A',
    'require': '^ngModel',
    'scope': false,
    'transclude': true,
    'link': function contenteditableLink (scope, element, attrs, ngModel) {

      var contentEditor = null;
      var contentEditorOptions = null;
      var unbindModelWatch = null;

      if (!ngModel) {
        console.error('The Pulsar contenteditable directive requires ng-model');
        return;
      }

      if (attrs.editorMode && (attrs.editorMode === 'html5')) {
        console.log('disabling CKEditor for element', attrs.ngModel);

        unbindModelWatch = scope.$watch(attrs.ngModel, function ( ) {
          if (ngModel.$modelValue === element.text()) {
            return; // staaaaahhhhhhppp!!
          }
          element.text(ngModel.$modelValue);
        });

        element.on('change key blur', function onContentChange (event) {
          console.log('content changed', event.name);
          scope.$apply(function ( ) {
            ngModel.$setViewValue(element.text(), event.name);
          });
        });

        element.bind('$destroy', function ( ) {
          if (unbindModelWatch) {
            unbindModelWatch();
            unbindModelWatch = null;
          }
        });

        return;
      }

      contentEditorOptions = {
        'toolbar': attrs.editorToolbar || 'basic',
        'toolbar_none': [ ],
        'toolbar_basic': [
          {
            'name': 'basicstyles',
            'items': [ 'Bold', 'Italic', 'Strike', 'Underline' ]
          },
          {
            'name': 'clipboard',
            'items': [ 'Undo', 'Redo' ]
          },
          {
            'name': 'paragraph',
            'items': [ 'BulletedList', 'NumberedList', 'Blockquote' ]
          },
          {
            'name': 'links',
            'items': [ 'Link', 'Unlink'/*, 'Anchor'*/ ]
          },
          {
            'name': 'insert',
            'items': [ 'Table', 'SpecialChar' ]
          }
        ],
        'toolbar_nomedia': [
          {
            'name': 'basicstyles',
            'items': [ 'Bold', 'Italic', 'Strike', 'Underline' ]
          },
          {
            'name': 'clipboard',
            'items': [ 'Undo', 'Redo' ]
          },
          {
            'name': 'paragraph',
            'items': [ 'BulletedList', 'NumberedList', 'Blockquote' ]
          },
          {
            'name': 'editing',
            'items': ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ]
          },
          {
            'name': 'links',
            'items': [ 'Link', 'Unlink', 'Anchor' ]
          },
          {
            'name': 'tools',
            'items': [ 'SpellChecker', 'Maximize' ]
          },
          '/',
          {
            'name': 'styles',
            'items': [ 'Format', 'FontSize', 'TextColor', 'PasteText', 'PasteFromWord', 'RemoveFormat' ]
          },
          {
            'name': 'insert',
            'items': [ 'Table', 'SpecialChar' ]
          },
          {
            'name': 'forms',
            'items': [ 'Outdent', 'Indent' ]
          },
          {
            'name': 'document',
            'items': [ 'PageBreak', 'Source' ]
          }
        ],
        'toolbar_full': [
          {
            'name': 'basicstyles',
            'items': [ 'Bold', 'Italic', 'Strike', 'Underline' ]
          },
          {
            'name': 'clipboard',
            'items': [ 'Undo', 'Redo' ]
          },
          {
            'name': 'paragraph',
            'items': [ 'BulletedList', 'NumberedList', 'Blockquote' ]
          },
          {
            'name': 'editing',
            'items': ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ]
          },
          {
            'name': 'links',
            'items': [ 'Link', 'Unlink', 'Anchor' ]
          },
          {
            'name': 'tools',
            'items': [ 'SpellChecker', 'Maximize' ]
          },
          '/',
          {
            'name': 'styles',
            'items': [ 'Format', 'FontSize', 'TextColor', 'PasteText', 'PasteFromWord', 'RemoveFormat' ]
          },
          {
            'name': 'insert',
            'items': [ 'Image', 'SoundCloud Player', 'Table', 'SpecialChar' ]
          },
          {
            'name': 'forms',
            'items': [ 'Outdent', 'Indent' ]
          },
          {
            'name': 'document',
            'items': [ 'PageBreak', 'Source' ]
          }
        ],
        'disableNativeSpellChecker': false,
        'uiColor': '#FAFAFA'
      };

      function onContentEditorChange (event) {
        if (!event) {
          return; // can't help you
        }
        var viewValue = contentEditor.getData();
        if (viewValue === '<p></p>') {
          viewValue = null;
        }
        console.debug('updating view value');
        ngModel.$setViewValue(viewValue, event.name);
      }

      // ngModel.$render = function ( ) {
      //   element.html(ngModel.$viewValue);
      // };

      function createEditorInstance ( ) {
        contentEditor = CKEDITOR.inline(element[0], contentEditorOptions);
        contentEditor.on('instanceReady', function ( ) {
          console.log('CKEDITOR instance ready');
        });
        contentEditor.on('change', onContentEditorChange);
        contentEditor.on('key', onContentEditorChange);
        contentEditor.on('blur', onContentEditorChange);

        unbindModelWatch = scope.$watch(attrs.ngModel, function ( ) {
          if (ngModel.$modelValue === contentEditor.getData()) {
            return; // staaaaahhhhhhppp!!
          }
          console.debug('updating editor value');
          contentEditor.setData(ngModel.$modelValue);
        });
        console.debug('updating editor value');
        contentEditor.setData(ngModel.$modelValue);
      }

      scope.$on('createEditors', function ( ) {
        if (contentEditor) {
          return; // prevent a CKEditor tantrum
        }
        createEditorInstance();
      });

      if (!attrs.createMode || (attrs.createMode === 'auto')) {
        createEditorInstance();
      }

      element.bind('$destroy', function ( ) {
        if (unbindModelWatch) {
          unbindModelWatch();
          unbindModelWatch = null;
        }
        if (contentEditor) {
          contentEditor.destroy(true);
          contentEditor = null;
        }
      });
    }
  };
}

PulsarContenteditableDirective.$inject = [

];

angular.module('pulsarClientApp')
.directive('contenteditable', PulsarContenteditableDirective);
