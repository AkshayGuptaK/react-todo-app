import config from "../config"

function fetchCors (url, reqType) {
  console.log(`Submitting ${reqType} request`)
  return fetch(url, {
    method: reqType,
    mode: "cors"
  }).then(res => res.json()).catch(() => '') // in case of response being invalid json
  // return res.json()
}

class fetchRequests {
  static getAllData () {
    return fetchCors(`${config.domain}/all`, "GET")
  }
  static createList (name) {
    return fetchCors(`${config.domain}/list/${name}`, "POST")
  }
  static deleteList (id) {
    return fetchCors(`${config.domain}/list/${id}`, "DELETE")
  }
  static changeListName (id, name) {
    return fetchCors(`${config.domain}/list/${id}/${name}`, "PUT")
  }
  static createTask (id, name, description) {
    return fetchCors(`${config.domain}/task/${id}/${name}/${description}`, "POST")
  }
  static deleteTask (listId, taskId) {
    return fetchCors(`${config.domain}/task/${listId}/${taskId}`, "DELETE")
  }
  static completeTask (id, completed) {
    return fetchCors(`${config.domain}/task/${id}/completed/${completed}`, "PUT")
  }
  static changeTask (id, field, value) {
    return fetchCors(`${config.domain}/task/${id}/${field}/${value}`, "PUT")
  }
}

export default fetchRequests
