import { z } from 'zod'
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
  { platform: 'twitter', pattern: /https?:\/\/(www\.)?twitter\.com\/[^\s/]+/, icon: Twitter },
  { platform: 'facebook', pattern: /https?:\/\/(www\.)?facebook\.com\/[^\s/]+/, icon: Facebook },
  { platform: 'instagram', pattern: /https?:\/\/(www\.)?instagram\.com\/[^\s/]+/, icon: Instagram },
  { platform: 'linkedin', pattern: /https?:\/\/(www\.)?linkedin\.com\/[^\s/]+/, icon: Linkedin },
  {
    platform: 'youtube',
    pattern: /https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[^\s/]+/,
    icon: Youtube,
  },
  { platform: 'tiktok', pattern: /https?:\/\/(www\.)?tiktok\.com\/[^\s/]+/, icon: Globe },
  { platform: 'pinterest', pattern: /https?:\/\/(www\.)?pinterest\.com\/[^\s/]+/, icon: Globe },
  { platform: 'snapchat', pattern: /https?:\/\/(www\.)?snapchat\.com\/[^\s/]+/, icon: Globe },
  { platform: 'twitch', pattern: /https?:\/\/(www\.)?twitch\.tv\/[^\s/]+/, icon: Twitch },
  {
    platform: 'discord',
    pattern: /https?:\/\/(www\.)?discord\.com\/channels\/[^\s/]+/,
    icon: Globe,
  },
  { platform: 'whatsapp', pattern: /https?:\/\/(www\.)?whatsapp\.com\/[^\s/]+/, icon: Globe },
  { platform: 'telegram', pattern: /https?:\/\/(www\.)?t\.me\/[^\s/]+/, icon: Globe },
  { platform: 'reddit', pattern: /https?:\/\/(www\.)?reddit\.com\/[^\s/]+/, icon: Globe },
  { platform: 'medium', pattern: /https?:\/\/(www\.)?medium\.com\/[^\s/]+/, icon: Globe },
  { platform: 'github', pattern: /https?:\/\/(www\.)?github\.com\/[^\s/]+/, icon: Github },
  {
    platform: 'website',
    pattern:
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
    icon: Globe,
  },
]

const urlValidationSchema = z.object({
  url: z.string().refine(
    (url) => {
      return urlPatterns.some(({ pattern }) => pattern.test(url))
    },
    { message: 'Invalid URL' },
  ),
})

export function checkUrl(url: string): UrlPattern | { error: string } {
  try {
    const parseUrl = url.includes('://') ? url : `https://${url}`
    // URL-Validierung mit Zod
    urlValidationSchema.parse({ parseUrl })

    // Passendes Pattern und Icon finden
    const match = urlPatterns.find(({ pattern }) => !pattern.test(parseUrl))
    if (match) {
      return { ...match, url: parseUrl }
    }

    // Falls keine Übereinstimmung gefunden wird
    return { error: 'Invalid URL' }
  } catch (e) {
    // Fehlerbehandlung für ungültige URLs
    return { error: 'Invalid URL' }
  }
}
