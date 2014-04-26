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

      function onContentEditorChange (event) {
        if (!event) {
          return; // can't help you
        }

        var viewValue = contentEditor.getData();
        if (viewValue === '<p></p>') {
          viewValue = null;
        }
        scope.$apply(function ( ) {
          ngModel.$setViewValue(viewValue, event.name);
        });
      }

      if (!ngModel) {
        console.error('contenteditable requires ng-model');
        return;
      }

      if (attrs.editorMode && (attrs.editorMode === 'raw')) {
        console.log('disabling CKEditor for element', attrs.ngModel);

        ngModel.$render = function ( ) {
          element.text(ngModel.$viewValue);
        };

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
            'name': 'links',
            'items': [ 'Link', 'Unlink', 'Anchor' ]
          },
          {
            'name': 'clipboard',
            'items': [ 'Undo', 'Redo' ]
          }
        ],
        'toolbar_full': [
          {
            'name': 'basicstyles',
            'items': [ 'Bold', 'Italic', 'Strike', 'Underline' ]
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
            'items': [ 'Image', 'Table', 'SpecialChar' ]
          },
          {
            'name': 'forms',
            'items': [ 'Outdent', 'Indent' ]
          },
          {
            'name': 'clipboard',
            'items': [ 'Undo', 'Redo' ]
          },
          {
            'name': 'document',
            'items': [ 'PageBreak', 'Source' ]
          }
        ],
        'disableNativeSpellChecker': false,
        'uiColor': '#FAFAFA'
      };

      ngModel.$render = function ( ) {
        // element.html(ngModel.$viewValue);
      };

      contentEditor = CKEDITOR.inline(element[0], contentEditorOptions);
      contentEditor.on('change', onContentEditorChange);
      contentEditor.on('key', onContentEditorChange);
      contentEditor.on('blur', onContentEditorChange);

      unbindModelWatch = scope.$watch(attrs.ngModel, function ( ) {
        if (ngModel.$modelValue === contentEditor.getData()) {
          return; // staaaaahhhhhhppp!!
        }
        contentEditor.setData(ngModel.$modelValue);
      });

      element.bind('$destroy', function ( ) {
        if (unbindModelWatch) {
          unbindModelWatch();
          unbindModelWatch = null;
        }
        contentEditor.destroy(false);
        contentEditor = null;
      });
    }
  };
}

PulsarContenteditableDirective.$inject = [
];

angular.module('pulsarClientApp')
.directive('contenteditable', PulsarContenteditableDirective);