interface Window {
  FB: FacebookSDK
}

interface FacebookSDK {
  getLoginStatus(cb?: (res: FBStatus) => void): void
  login(cb?: (res: FBStatus) => void, o?: FBLoginOpts): void
  logout(cb?: () => void): void
  init(r: Record<string, any>): void
  Event: {
    subscribe(event: string, cb: (res: FBStatus) => void): void
    unsubscribe(event: string, cb: (res: FBStatus) => void): void
  }
}

interface FBStatus {
  status: string
  authResponse: {
    accessToken: string
    expiresIn: number
    signedRequest: string
    userID: string
  }
}

interface FBLoginOpts {
  auth_type?: string
  enable_profile_selector?: boolean
  return_scopes?: boolean
  scope?: string
}
