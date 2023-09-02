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
    this.idleScreen()
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
    this.idleScreen()
  }


  createRow (user) {
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
        <button>Remover</button>
      </td>
    `
    this.tbody.append(tr)
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