import axios from 'axios'
import jwtDefaultConfig from './jwtDefaultConfig'
import { messageService } from './messageService'

export default class JwtService {
  // ** jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig }

  // ** For Refreshing Token
  isAlreadyFetchingAccessToken = false

  // ** For Refreshing Token
  subscribers = []

  constructor(jwtOverrideConfig) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }

    // ** Request Interceptor
    axios.interceptors.request.use(
      config => {
        // ** Get token from localStorage
        const accessToken = this.getToken()
        //console.log('accessToken', accessToken)
        
        // ** If token is present add it to request's Authorization Header
        if (accessToken) {
          // ** eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
        }
        return config
      },
      error => Promise.reject(error)
    )

    // ** Add request/response interceptor
    axios.interceptors.response.use(
      response => {
        if (response.data.ResponseCode == 1000002 || response.data.ResponseCode == 1000003 || response.data.ResponseCode == 1000004) {
          messageService.sendMessage('Logout')
        }
        return response
      },
      error => {
        // ** const { config, response: { status } } = error
        const { config, response } = error
        const originalRequest = config
        console.log('error', error)

        // ** if (status === 401) {
        if (response) {
          console.log('response', response)
          if (response.status === 401) {
            messageService.sendMessage('Logout')

            // if (!this.isAlreadyFetchingAccessToken) {
            //   this.isAlreadyFetchingAccessToken = true
            //   this.refreshToken().then(r => {
            //     this.isAlreadyFetchingAccessToken = false
  
            //     // ** Update accessToken in localStorage
            //     this.setToken(r.data.accessToken)
            //     this.setRefreshToken(r.data.refreshToken)
  
            //     this.onAccessTokenFetched(r.data.accessToken)
            //   })
            // }
            // const retryOriginalRequest = new Promise(resolve => {
            //   this.addSubscriber(accessToken => {
            //     // ** Make sure to assign accessToken according to your response.
            //     // ** Check: https://pixinvent.ticksy.com/ticket/2413870
            //     // ** Change Authorization header
            //     originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
            //     resolve(this.axios(originalRequest))
            //   })
            // })
            // return retryOriginalRequest

          } else if (response.status === 403) {
            const data = {
              ResponseCode: 1000011,
              ResponseMessage: `You don't have the permisson`
            }
            return Promise.resolve({ data })
          }          
        }
        return Promise.reject(error)
      }
    )
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter(callback => callback(accessToken))
  }

  addSubscriber(callback) {
    this.subscribers.push(callback)
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName)
  }

  getUserID() {
    return localStorage.getItem(this.jwtConfig.storageUserIDKeyName)
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName)
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value)
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value)
  }

  login(...args) {
    return axios.post(this.jwtConfig.loginEndpoint, ...args)
  }

  forgotPassword(...args) {
    return axios.post(this.jwtConfig.forgotPasswordEndpoint, ...args)
  }

  resetForgotPassword(...args) {
    return axios.post(this.jwtConfig.resetForgotPasswordEndpoint, ...args)
  }

  register(...args) {
    return axios.post(this.jwtConfig.registerEndpoint, ...args)
  }

  resetPassword(...args) {
    return axios.post(this.jwtConfig.resetPasswordEndpoint, ...args)
  }

  refreshToken() {
    return axios.post(this.jwtConfig.refreshEndpoint, {
      refreshToken: this.getRefreshToken()
    })
  }

  getAllUsers() {
    return axios.get(this.jwtConfig.getAllUsersEndpoint)
  }

  searchUsers(...args) {
    //console.log('...args', ...args)
    return axios.get(this.jwtConfig.searchUsersEndpoint, ...args)
  }

  getAllClients() {
    return axios.get(this.jwtConfig.getAllClientsEndpoint)
  }

  searchClients(...args) {
    return axios.get(this.jwtConfig.searchClientsEndpoint, ...args)
  }

  loadClientInformation(email) {
    return axios.get(this.jwtConfig.loadClientInformation, {params: {email}})
  }

  loadAdvisorOverview(refresh) {
    return axios.get(this.jwtConfig.loadAdvisorOverview, {params: {refresh}})
  }

  addConnection(...args) {
    return axios.post(this.jwtConfig.addConnection, ...args)
  }

  removeConnection(...args) {
    return axios.post(this.jwtConfig.removeConnection, ...args)
  }

  addAdvisor(...args) {
    return axios.post(this.jwtConfig.addAdvisorEndpoint, ...args)
  }

  deleteAdvisor(advisor_id) {
    return axios.delete(`${this.jwtConfig.deleteAdvisorEndpoint}${advisor_id}`)
  }

  updateAdvisorInfo(...args) {
    return axios.post(this.jwtConfig.updateAdvisorInfoEndpoint, ...args)
  }

  updateAdvisorPhoto(...args) {
    return axios.post(this.jwtConfig.updateAdvisorPhotoEndpoint, ...args)
  }

  loadAdvisorWorkTimes(advisor_id) {
    return axios.get(`${this.jwtConfig.loadAdvisorWorkTimes}/${advisor_id}`)
  }

  setAdvisorWorkTimes(...args) {
    return axios.post(this.jwtConfig.setAdvisorWorkTimes, ...args)
  }

  loadUnreadMessages() {
    return axios.get(this.jwtConfig.loadUnreadMessagesEndpoint)
  }

  loadRoomsAndMessages(...args) {
    return axios.get(this.jwtConfig.loadRoomsAndMessagesEndpoint, ...args)
  }

  clearRoomMessages(room_id) {
    return axios.post(`${this.jwtConfig.clearRoomMessagesEndpoint}${room_id}`)
  }

  fetchEvents(...args) {
    return axios.get(this.jwtConfig.getAdvisorEventsEndpoint, ...args)
  }

  addEvent(...args) {
    return axios.post(this.jwtConfig.addAdvisorEventEndpoint, ...args)
  }

  updateEvent(event) {
    return axios.patch(`${this.jwtConfig.updateAdvisorEventEndpoint}/${event.id}`, event)
  }

  removeEvent(event_id) {
    return axios.delete(`${this.jwtConfig.addAdvisorEventEndpoint}/${event_id}`)
  }

  loadSettingsInfo() {
    return axios.get(this.jwtConfig.loadConfigurationsInfoEndpoint)
  }

  updateSettingsInfo(...args) {
    return axios.post(this.jwtConfig.updateConfigurationsInfoEndpoint, ...args)
  }

  updateClientFee(...args) {
    return axios.post(this.jwtConfig.updateClientFeeEndpoint, ...args)
  }

  loadClientBalances(client_id) {
    return axios.get(`${this.jwtConfig.clientBalancesEndpoint}/${client_id}`)
  }

  loadClientTransactions(...args) {
    return axios.get(this.jwtConfig.clientTransactionsEndpoint, ...args)
  }

  loadClientCardTransactions(...args) {
    return axios.get(this.jwtConfig.clientCardTransactionsEndpoint, ...args)
  }

  sendEmail(...args) {
    return axios.post(this.jwtConfig.sendEmailEndpoint, ...args)
  }

  getSentMails(advisor_id) {
    return axios.get(`${this.jwtConfig.getSentMailList}/${advisor_id}`)
  }

  getMailContent(id) {
    return axios.get(`${this.jwtConfig.getMailContent}/${id}`)
  }
  
  saveMailDraft(...args) {
    return axios.post(this.jwtConfig.saveMailDraft, ...args)
  }

  getMailDraft(advisor_id) {
    return axios.get(`${this.jwtConfig.getMailDraft}/${advisor_id}`)
  }
}
