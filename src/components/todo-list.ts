import { Component, css, customElement, html, property, UTILS } from 'wapitis'
import { CONSTANT } from '../helpers/globals'
// On importe le composant
import './todo'

// Nous définissons notre custom element dans la directive suivante et la classe associée
// w pour wapitis. il est obligatoire d'avoir "prefixe-nom" dans le nom d'un custom element
@customElement('w-todo-list')
export default class TodoList extends Component<{}> {
    static get styles() {
        return css`
        :host {
            font-family: Arial, Helvetica, sans-serif;
            margin: auto;
            width: 25rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            clear: both;
        }
        .title {
            font-size: 100px;
            opacity: 0.2;
            color: #333333;
        }
        input {
            border: 1px solid #ccc;
            box-shadow: inset 0 1px 3px #ddd;
            border-radius: 4px;
            padding: 12px 20px;
        }
        button {
            display: none;
        }
        .todos {
            width: 25em;
            margin-top: 1rem;
        }
        `
    }

    // Une propriété _todos est déclaré avec la directive @property.
    // Le préfixe _ permet à la propriété d'être obervable tout en étant considérée comme protected. Elle n'apparait ainsi pas dans les attributs de l'élément il n'y a donc pas de conversion
    @property() _todos: Array<{ text: string; checked: boolean }> = CONSTANT.DATAS.todos || []
    // Une propriété input non observable et protected est déclarée pour pouvoir y accéder ci après
    protected _input: HTMLInputElement | null

    render() {
        CONSTANT.DATAS.todos = this._todos
        UTILS.save(CONSTANT.DATASKEY, CONSTANT.DATAS)
        // On utilise ensuite le helper html afin de créer un template avec les événements et les variables observées à mettre à jour
        // @click correspond à addEventListener('click', this.addTodos)
        // La partie du template this._todos est mis à jour car il s'agit d'une propriété observable
        // L'écriture est ici également la même que https://lit-html.polymer-project.org/guide/template-reference
        // On remplace l'ancien div par le composant w-todo en déclarant les différentes variables
        // text et index avec un . car c'est une valeur
        // .checked permet d'indiquer qu'il s'agit d'un booleen. En tant qu'attribut seul checked sera écrit quand l'attribut sera à true. S'il est à false il ne sera pas présent
        // Enfin commen on ferais un addEventListener sur les custom event de ce composant on pose ici un @ accompagné du nom de ce custom event et d'une méthode associée
        return html`
            <div class='title'>todos</div>
            <form>
                <input type='text' placeholder='Ajouter une tâche'/>
                <button @click=${this._addTodo}>Ajouter</button>
            </form>
            <div class='todos'>
                ${this._todos.map((todo, index) => html`<w-todo ?checked=${todo.checked} text=${todo.text} .index=${index} @remove=${this._removeTodo} @completed=${this._toggleTodo}></w-todo>`)}
            </div>
        `
    }

    // On va chercher l'élément input
    firstUpdated = () => this._input = this.shadowRoot!.querySelector('input')

    // On ajoute à la propriété _todos la nouvelle tâche créée. C'est la methode render qui se charge de l'affichage lorsque _todos change
    protected _addTodo = (event: MouseEvent) => {
        event.preventDefault()
        if (this._input!.value.length > 0) {
            this._todos = [...this._todos, { text: this._input!.value, checked: false }]
            this._input!.value = ''
        }
    }

    // On supprime l'index demandé en filtrant le tableau existant grâce à l'index. La mise à jour du tableau permettra à la methode render de remplacer les élément nécessaires dans le template
    protected _removeTodo = (event: CustomEvent) => this._todos = this._todos.filter((_todo, _index) => _index !== event.detail.index)

    // On remplace dans le tableau la propriété checked par la valeur renvoyée grâce à l'index. La mise à jour du tableau permettra à la methode render de remplacer les élément nécessaires dans le template
    protected _toggleTodo = (event: CustomEvent) => this._todos = this._todos.map((_todo, _index) => _index === event.detail.index ? { ..._todo, checked: !_todo.checked } : _todo)
}
