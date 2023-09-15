import { GithubAPI } from "./github_api.js"

export class GithubFavorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.githuapi = new GithubAPI()
  }

  async load () {
    const inputText = document.getElementById("search")

    try {
      const user = await this.githuapi.findUser(inputText.value)

      if (!user.login){
        inputText.value = ""
        throw new Error("Usuário não encontrado")
      }

      return user
    } catch(error){
      alert(error.message)
    }
  }
}

export class GithubView extends GithubFavorites {
  constructor(root) {
    super(root)
    this.tbody = document.querySelector('tbody')
    this.listUser()
  }

  bindEventListener () {
    const btnFavorites = document.getElementById("btn-favorites")
    
    btnFavorites.addEventListener('click', () => {
      this.addUser()
    })
  }

  async addUser () {   
    const user = await this.load()
    this.createRow(user)
    const users = JSON.parse(localStorage.getItem("users")) || []
    users.push(user)
    localStorage.setItem("users", JSON.stringify(users))
    this.idleScreen()
  }

  listUser () {
    const users = JSON.parse(localStorage.getItem("users")) || []
    users.forEach(user => {
      this.createRow(user)
    });
    this.idleScreen()
  }

  deleteUser(event) {
    const row = event.target.closest('tr')
    this.deleteRow(row.id)
    let users = JSON.parse(localStorage.getItem("users"))
    users = users.filter((user) => user.id !== Number(row.id))
    localStorage.setItem("users", JSON.stringify(users))
    this.idleScreen()
  }

  createRow(user) {
    const tr = document.createElement("tr")

    tr.innerHTML = `
      <td class="user">
        <img src="https://github.com/${user.login}.png" alt="Avatar de ${user.name}">
        <a href="https://github.com/${user.login}" target="_blank">
          <p>${user.name}</p>
          <span>${user.login}</span>
        </a>
      </td>
      <td>
        ${user.public_repos}
      </td>
      <td>
        ${user.followers}
      </td>
      <td>
        <button id="btn-remove-${user.id}">Remover</button>
      </td>
    `
    tr.setAttribute("id", user.id)
    this.tbody.append(tr)

    const btnRemove = document.getElementById(`btn-remove-${user.id}`)

    btnRemove.addEventListener('click', (event) => {
      this.deleteUser(event)
    })
  }

  deleteRow(id) {
    const deletedUser = document.getElementById(id)
    deletedUser.remove()
  }

  idleScreen () {
    const noFavs = document.querySelector(".no-favs")

    if (this.tbody.children.length === 0){
      noFavs.classList.remove('hide')
      return
    }

    noFavs.classList.add('hide')
  }
}