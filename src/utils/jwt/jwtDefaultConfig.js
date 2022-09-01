// ** Auth Endpoints
export default {
  loginEndpoint: `${process.env.REACT_APP_BASE_API_URL}/auth/login`,
  forgotPasswordEndpoint: `${process.env.REACT_APP_BASE_API_URL}/auth/forgot_password`,
  resetForgotPasswordEndpoint: `${process.env.REACT_APP_BASE_API_URL}/auth/reset_forgot_password`,
  registerEndpoint: `${process.env.REACT_APP_BASE_API_URL}/auth/register`,
  refreshEndpoint: '/jwt/refresh-token',
  logoutEndpoint: `${process.env.REACT_APP_BASE_API_URL}/auth/logout`,
  resetPasswordEndpoint: `${process.env.REACT_APP_BASE_API_URL}/auth/reset_password`,
  getAllUsersEndpoint: `${process.env.REACT_APP_BASE_API_URL}/user`,
  searchUsersEndpoint: `${process.env.REACT_APP_BASE_API_URL}/user/search`,
  getAllClientsEndpoint: `${process.env.REACT_APP_BASE_API_URL}/connection/advisor_clients`,
  searchClientsEndpoint: `${process.env.REACT_APP_BASE_API_URL}/connection/search_clients`,
  loadAdvisorOverview: `${process.env.REACT_APP_BASE_API_URL}/connection/advisor_overview`,
  loadClientInformation: `${process.env.REACT_APP_BASE_API_URL}/client/find_by_email`,
  addConnection: `${process.env.REACT_APP_BASE_API_URL}/connection`, 
  removeConnection: `${process.env.REACT_APP_BASE_API_URL}/connection/remove`,
  addAdvisorEndpoint: `${process.env.REACT_APP_BASE_API_URL}/user/add_advisor`,
  deleteAdvisorEndpoint: `${process.env.REACT_APP_BASE_API_URL}/connection/delete_advisor/`,
  updateAdvisorInfoEndpoint: `${process.env.REACT_APP_BASE_API_URL}/user/update_profile`,
  updateAdvisorPhotoEndpoint: `${process.env.REACT_APP_BASE_API_URL}/user/update_photo`,
  loadAdvisorWorkTimes: `${process.env.REACT_APP_BASE_API_URL}/work-time`,
  setAdvisorWorkTimes: `${process.env.REACT_APP_BASE_API_URL}/work-time/set_work_times`,

  loadUnreadMessagesEndpoint: `${process.env.REACT_APP_BASE_API_URL}/message/advisor_unread_messages`,
  loadRoomsAndMessagesEndpoint: `${process.env.REACT_APP_BASE_API_URL}/message/advisor`,
  clearRoomMessagesEndpoint: `${process.env.REACT_APP_BASE_API_URL}/message/clear_room_messages/`,

  getAdvisorEventsEndpoint: `${process.env.REACT_APP_BASE_API_URL}/event`,
  addAdvisorEventEndpoint: `${process.env.REACT_APP_BASE_API_URL}/event`,
  updateAdvisorEventEndpoint: `${process.env.REACT_APP_BASE_API_URL}/event`,
  removeAdvisorEventEndpoint: `${process.env.REACT_APP_BASE_API_URL}/event`,

  loadConfigurationsInfoEndpoint: `${process.env.REACT_APP_BASE_API_URL}/configuration`,
  updateConfigurationsInfoEndpoint: `${process.env.REACT_APP_BASE_API_URL}/configuration/set_default_fees`,
  updateClientFeeEndpoint: `${process.env.REACT_APP_BASE_API_URL}/connection/update_fees`,
  clientBalancesEndpoint: `${process.env.REACT_APP_BASE_API_URL}/client/balances`,
  clientTransactionsEndpoint: `${process.env.REACT_APP_BASE_API_URL}/client/transactions`,
  clientCardTransactionsEndpoint: `${process.env.REACT_APP_BASE_API_URL}/client/card_transactions`,

  sendEmailEndpoint: `${process.env.REACT_APP_BASE_API_URL}/email/send`,
  getSentMailList: `${process.env.REACT_APP_BASE_API_URL}/email/sent`,
  getMailContent: `${process.env.REACT_APP_BASE_API_URL}/email/view`,
  saveMailDraft: `${process.env.REACT_APP_BASE_API_URL}/email/saveDraft`,
  getMailDraft: `${process.env.REACT_APP_BASE_API_URL}/email/draft`,


  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageUserIDKeyName: 'user_id',
  storageRefreshTokenKeyName: 'refreshToken'
}
