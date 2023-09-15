export class GithubAPI {
  async findUser(username){
    const endpoint = `https://api.github.com/users/${username}`

    return fetch(endpoint)
      .then(response => response.json())
      .then(({id, login, name, public_repos, followers}) => ({
        id,
        login,
        name,
        public_repos,
        followers
      }))

  }
}