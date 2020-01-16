import { JSX } from 'wapitis'
import TodoList from './components/todo-list'
import './www/styles/main.css'

document.body.appendChild(
    <main>
        <TodoList></TodoList>
    </main>
)
document.body.appendChild(<footer><div>Créé par Nicolas Boyer avec <a href='https://github.com/NicolasBoyer/wapitis'>Wapitis</a>.</div><div>© <strong>WAPITIS</strong>. Tous droits réservés.</div></footer>)
