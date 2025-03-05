import rest from './header'

export interface ResourcePayload {
  query: string
  id?: number | string
  formData?: FormData
  [key: string]: any
}

export const Resource = {
  /**
   * GET request: /api/[address]
   */
  query(address: string): Promise<any> {
    return new Promise((resolve, reject) => {
      rest.get(`api/${address}`)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          console.error(error)
          reject(error)
        })
    })
  },

  /**
   * POST request: /api/[payload.query]
   */
  save(payload: ResourcePayload): Promise<any> {
    return new Promise((resolve, reject) => {
      const data = payload.formData || payload
      const config = payload.formData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {}
  
      rest.post(`api/${payload.query}`, data, config)
        .then((response) => resolve(response.data))
        .catch((error) => reject(error))
    })
  },
  /**
   * PUT request: /api/[payload.query]/[payload.id]
   */
  update(payload: ResourcePayload): Promise<any> {
    return new Promise((resolve, reject) => {
      // Decide which data and headers to use
      const data = payload.formData || payload
      const config = payload.formData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {}
      const method =  payload.formData ? 'post' : 'put'
      rest[method](`api/${payload.query}/${payload.id}`, data, config)
        .then((response) => resolve(response.data))
        .catch((error) => reject(error))
    })
  },

  /**
   * DELETE request: /api/[payload.query]/[payload.id]
   */
  destroy(payload: ResourcePayload): Promise<any> {
    return new Promise((resolve, reject) => {
      rest.delete(`api/${payload.query}/${payload.id}`)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          console.error(error)
          reject(error)
        })
    })
  },
}
