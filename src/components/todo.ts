import { Component, css, customElement, html, property, UTILS } from 'wapitis'
// On importe les icons avec le fichier icons.svg
import icons from '../www/assets/img/icons.svg'

// On déclare les prporiétés puvliques obsevables. Ainsi si un constructor est déclarée on peut utiliser la forme new Todo({...}) pour créer la Todo. Et cela permet aux composants appelant d'avoir connaissances de ces propriétés
interface IProps {
    text: string
    index: number
    checked: boolean
}

@customElement('w-todo')
export default class Todo extends Component<IProps> {
    static get styles() {
        return css`
        :host {
            display: flex;
            word-break: break-all;
            padding: 15px 15px 15px 10px;
            line-height: 1.2;
            transition: color 0.4s;
            border: 1px solid #e6e6e6;
            margin-top: -1px;
            justify-content: space-between;
            background: #fdfdfd;
        }
        label {
            display: flex;
            align-items: center;
        }
        label span {
            padding-left: 0.5em;
            font-size: 24px;
            color: #4d4d4d;
            line-height: 1.2;
            transition: color 0.4s;
        }
        :host([checked]) label span {
            color: #d9d9d9;
            text-decoration: line-through;
        }
        input {
            display: none;
        }
        .icon {
            width: 1.7em;
            height: 1.7em;
            stroke: none;
            fill: #cacaca;
        }
        button {
            border: none;
            background: none;
            display: flex;
            justify-content: center;
            cursor: pointer;
        }
        .icon-x {
            fill: #cc9a9a;
            transition: all 0.4s;
            opacity: 0;
        }
        :host(:hover) .icon-x {
            opacity: 1;
        }
        button:hover .icon-x {
            fill: #af5b5e;
        }
        `
    }

    // On déclare les 3 propiétés observable en utilisant la directive @property. Comme il s'agit d'attribut, afin d'indiquer comment la conversion doit être faite entre l'attribut et la propriété, on indique le type pour index et checked, text étant un string il est inutile de l'indiquer. writeOnly est passé à true pour l'index afin qu'il n'apparaisse pas en tant qu'attribut html dans le dom
    @property() text: string
    @property({ type: Number, writeOnly: true }) index: number
    @property({ type: Boolean }) checked: boolean = false

    render() {
        // https://lit-html.polymer-project.org/guide/template-reference
        // On utilise .checked pour indiquer qu'on utilisera une valeur true ou false pour l'attribut html checked de l'input dans le DOM
        // Un custom event est utilisé pour préciser aux autres composants que la tâche est complétée ou supprimée (cf todo-list pour voir comment cela est traité)
        // Un autre custom event est utilisé pour preciser que la tâche est supprimée
        // On déclare une balise SVG qui va chercher les icones déclarés dans le fichier icons.svg
        return html`
            <label>
                <input .checked=${this.checked} @change=${() => this._fireEvent('completed')} type='checkbox'/>
                ${this.checked ? html`<svg class="icon"><use href=${icons}#icon-check-circle></use></svg>` : html`<svg class="icon"><use href=${icons}#icon-circle></use></svg>`}
                <span>${this.text}</span>
            </label>
            <button @click=${() => this._fireEvent('remove')} title='Supprimer'><svg class="icon icon-x"><use href=${icons}#icon-x></use></svg></button>
        `
    }

    // Une fonction générique est créée pour envoyer le custom event
    // On utilise ici une des méthodes disponibles dans la librairie UTILS : dispatchEvent permettant d'envoyer un custom event
    protected _fireEvent = (name: string) => UTILS.dispatchEvent(name, { index: this.index }, this)
}
