declare module 'tinder' {
  namespace Tinder {
    interface Response<T extends Record<string, any>> {
      data?: T
      meta?: { status: number }
      status?: number
      statusText?: string
    }

    interface AuthResponse {
      api_token: string
      is_new_user: boolean
      refresh_token: string
    }

    interface MatchResponse {
      matches: Match[]
      next_page_token: string
    }

    interface Match {
      _id: string
      closed: boolean
      common_friend_count: number
      common_like_count: number
      created_date: string
      dead: boolean
      following_moments: boolean
      following: boolean
      harassing_message_id?: string | null
      has_harassing_feedback?: boolean | null
      id: string
      is_archived: boolean
      is_boost_match: boolean
      is_experiences_match: boolean
      is_fast_match: boolean
      is_opener: boolean
      is_super_boost_match: boolean
      is_super_like: boolean
      is_top_pick?: boolean | null
      last_activity_date: string
      liked_content: LikedContent
      message_count: number
      messages?: (MessagesEntity | null)[] | null
      participants?: string[] | null
      pending: boolean
      person: Person
      readreceipt: { enabled: boolean }
      seen: Seen
      subscription_tier: string
      super_liker?: string | null
    }

    interface Seen {
      last_seen_msg_id?: string | null
      match_seen: boolean
    }

    interface MessagesEntity {
      _id: string
      fixed_height?: string | null
      from: string
      match_id: string
      message: string
      sent_date: string
      timestamp: number
      to: string
      type?: string | null
    }

    interface Person {
      _id: string
      badges?: { type: string }[] | null
      bio?: string | null
      birth_date: string
      gender: number
      hide_age?: boolean | null
      hide_distance?: boolean | null
      name: string
      photos?: Photo[] | null
      ping_time: string
    }

    interface Photo {
      assets?: null[] | null
      crop_info: CropInfo
      extension: string
      fileName: string
      id: string
      last_update_time?: string | null
      main?: boolean | null
      media_type: string
      processedFiles?: ProcessedFilesEntityOrProcessedVideosEntity[] | null
      processedVideos?: ProcessedFilesEntityOrProcessedVideosEntity[] | null
      prompt?: Prompt | null
      rank?: number | null
      score?: number | null
      selectRate?: number | null
      type: string
      url: string
      webp_qf?: number[] | null
      win_count?: number | null
      xdistance_percent?: number | null
      xoffset_percent?: number | null
      ydistance_percent?: number | null
      yoffset_percent?: number | null
    }

    interface CropInfo {
      algo?: AlgoOrUser | null
      faces?: FacesEntity[] | null
      processed_by_bullseye: boolean
      user_customized: boolean
      user?: AlgoOrUser | null
    }

    interface AlgoOrUser {
      height_pct: number
      width_pct: number
      x_offset_pct: number
      y_offset_pct: number
    }

    interface FacesEntity {
      algo: AlgoOrUser
      bounding_box_percentage: number
    }

    interface ProcessedFilesEntityOrProcessedVideosEntity {
      url: string
      height: number
      width: number
    }

    interface Prompt {
      prompt_version: number
      prompt_id: string
      prompt_type: string
      campaign_id: string
      prompt_title: string
      answer: string
      gradient?: string[] | null
    }

    interface LikedContent {
      by_closer?: ByCloser | null
      by_opener?: ByOpener | null
    }

    interface ByOpener {
      user_id: string
      type: string
      photo?: Photo | null
      is_swipe_note: boolean
    }

    interface Photo {
      assets?: null[] | null
      crop_info: CropInfo
      extension: string
      fileName: string
      id: string
      last_update_time?: string | null
      processedFiles?: ProcessedFilesEntityOrProcessedVideosEntity[] | null
      processedVideos?: ProcessedFilesEntityOrProcessedVideosEntity[] | null
      rank?: number | null
      score?: number | null
      type: string
      url: string
      webp_qf?: number[] | null
      win_count?: number | null
    }

    interface ByCloser {
      is_swipe_note: boolean
      photo?: Photo | null
      type: string
      user_id: string
    }
  }
}
