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
    pattern: /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w\-]+(\/.*)?$/,
    icon: Linkedin,
  },
  {
    platform: 'youtube',
    pattern:
      /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=[\w\-]+|channel\/[\w\-]+)|youtu\.be\/[\w\-]+)(\/.*)?$/,
    icon: Youtube,
  },
  {
    platform: 'tiktok',
    pattern: /^https?:\/\/(www\.)?tiktok\.com\/(@[\w\-]+|v\/[\w\-]+)(\/.*)?$/,
    icon: Globe,
  },
  {
    platform: 'pinterest',
    pattern: /^https?:\/\/(www\.)?pinterest\.com\/[\w\-]+(\/.*)?$/,
    icon: Globe,
  },
  {
    platform: 'snapchat',
    pattern: /^https?:\/\/(www\.)?snapchat\.com\/add\/[\w\-]+(\/.*)?$/,
    icon: Globe,
  },
  { platform: 'twitch', pattern: /^https?:\/\/(www\.)?twitch\.tv\/[\w\-]+(\/.*)?$/, icon: Twitch },
  {
    platform: 'discord',
    pattern: /^https?:\/\/(www\.)?discord\.com\/channels\/\d+\/\d+(\/\d+)?$/,
    icon: Globe,
  },
  {
    platform: 'whatsapp',
    pattern: /^https?:\/\/(www\.)?whatsapp\.com\/[\w\-]+(\/.*)?$/,
    icon: Globe,
  },
  { platform: 'telegram', pattern: /^https?:\/\/(www\.)?t\.me\/[\w\-]+(\/.*)?$/, icon: Globe },
  { platform: 'reddit', pattern: /^https?:\/\/(www\.)?reddit\.com\/[\w\-]+(\/.*)?$/, icon: Globe },
  { platform: 'medium', pattern: /^https?:\/\/(www\.)?medium\.com\/[\w\-]+(\/.*)?$/, icon: Globe },
  { platform: 'github', pattern: /^https?:\/\/(www\.)?github\.com\/[\w\-]+(\/.*)?$/, icon: Github },
  {
    platform: 'instagram',
    pattern:
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?instagram\.com\/[a-zA-Z0-9_.-]+(\/)?(\?[^\s]*)?/g,
    icon: Instagram,
  },
  // {
  //   platform: 'website',
  //   pattern:
  //     /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
  //   icon: Globe,
  // },
]

export function checkUrl(url: string): { platform: string; icon: LucideIcon } | null {
  const match = urlPatterns.find(({ pattern }) => pattern.test(url))
  if (match) {
    return { platform: match.platform, icon: match.icon }
  }
  return null
}
