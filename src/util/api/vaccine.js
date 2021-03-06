export default class Vaccine {
  constructor (httpWrapper) {
    this.httpWrapper = httpWrapper
  }

  async list (status) {
    const url = `/vaccines/${status}`
    const res = await this.httpWrapper.get(url)
    return res.data
  }

  async getOne (id) {
    const url = `/vaccines/id/${id}`
    const res = await this.httpWrapper.get(url)
    return res.data
  }

  async post (data) {
    const url = '/vaccines'
    const res = await this.httpWrapper.post(url, data)
    return res.data
  }

  async update (data, id) {
    const url = `/vaccines/${id}`
    const res = await this.httpWrapper.patch(url, data)
    return res.data
  }

  async delete (id) {
    const url = `/vaccines/${id}`
    const res = await this.httpWrapper.delete(url)
    return res.data
  }
}
