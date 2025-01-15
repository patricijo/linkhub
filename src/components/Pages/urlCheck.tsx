import {
  Facebook,
  Github,
  Globe,
  Instagram,
  Linkedin,
  LucideIcon,
  Twitch,
  Twitter,
  Youtube,
} from 'lucide-react'

type UrlPattern = {
  platform: string
  pattern: RegExp
  icon: LucideIcon

  url?: string
}

const urlPatterns: UrlPattern[] = [
  {
    platform: 'twitter',
    pattern: /^https?:\/\/(www\.)?twitter\.com\/[\w\-]+(\/.*)?$/,
    icon: Twitter,
  },
  {
    platform: 'facebook',
    pattern: /^https?:\/\/(www\.)?facebook\.com\/[\w\-]+(\/.*)?$/,
    icon: Facebook,
  },

  {
    platform: 'linkedin',
    pattern: /^(https?:\/\/)?(www\.)?(linkedin\.com)/,
    icon: Linkedin,
  },
  {
    platform: 'youtube',
    pattern: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be\/)/,
    icon: Youtube,
  },
  {
    platform: 'tiktok',
    pattern: /^(https?:\/\/)?(www\.)?(tiktok\.com)/,
    icon: Globe,
  },
  {
    platform: 'pinterest',
    pattern: /^(https?:\/\/)?(www\.)?(pintrest\.com)/,
    icon: Globe,
  },

  { platform: 'twitch', pattern: /^(https?:\/\/)?(www\.)?(twitch\.com)/, icon: Twitch },
  {
    platform: 'discord',
    pattern: /^(https?:\/\/)?(www\.)?(discord\.com)/,
    icon: Globe,
  },
  {
    platform: 'whatsapp',
    pattern: /^(https?:\/\/)?(www\.)?(whatsapp\.com)/,
    icon: Globe,
  },
  { platform: 'telegram', pattern: /^(https?:\/\/)?(www\.)?(t\.me)/, icon: Globe },
  { platform: 'reddit', pattern: /^(https?:\/\/)?(www\.)?(reddit\.com)/, icon: Globe },

  { platform: 'github', pattern: /^(https?:\/\/)?(www\.)?(github\.com)/, icon: Github },
  {
    platform: 'instagram',
    pattern: /^(https?:\/\/)?(www\.)?(instagram\.com)/,
    icon: Instagram,
  },
  {
    platform: 'website',
    pattern:
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
    icon: Globe,
  },
]

export function checkUrl(url: string): {
  platform?: string
  icon: LucideIcon
  error?: string
} {
  const match = urlPatterns.find(({ pattern }) => pattern.test(url))
  if (match) {
    return { platform: match.platform, icon: match.icon }
  }
  return { error: 'invalid URL', icon: Globe }
}

export function createUrl(url: string): string {
  if (!url) return ''
  return url.includes('://') ? url : `https://${url}`
}
