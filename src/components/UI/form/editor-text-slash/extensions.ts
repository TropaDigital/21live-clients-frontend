import { Extension } from '@tiptap/core';

export const CustomPlaceholder = Extension.create({
  name: 'customPlaceholder',

  addOptions() {
    return {
      placeholder: 'Digite algo...', // Placeholder padrão
      emptyNodeClass: 'is-empty', // Classe CSS para nós vazios
      showOnlyWhenEditable: true, // Mostrar apenas quando o editor estiver editável
      includeTypes: ['heading', 'paragraph'], // Tipos de nós que terão placeholder
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.includeTypes,
        attributes: {
          'data-placeholder': {
            default: this.options.placeholder,
          },
        },
      },
    ];
  },

  onUpdate() {
    const { editor } = this;
    const { state } = editor;
    const { doc } = state;

    // Verifica se o nó está vazio e adiciona/remove a classe
    doc.descendants((node, pos) => {
      if (this.options.includeTypes.includes(node.type.name)) {
        const isEmpty = node.textContent.trim() === '';
        const dom = editor.view.nodeDOM(pos) as HTMLElement;

        if (dom) {
          if (isEmpty) {
            dom.classList.add(this.options.emptyNodeClass);
            dom.setAttribute('data-placeholder', this.options.placeholder);
          } else {
            dom.classList.remove(this.options.emptyNodeClass);
            dom.removeAttribute('data-placeholder');
          }
        }
      }
    });
  },
});