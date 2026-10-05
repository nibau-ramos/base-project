import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'
import { useAppSelector } from '../../store/hooks'

interface CodeBlockProps {
  code: string
  language?: string
}

export default function CodeBlock({ code, language = 'tsx' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const isDarkMode = useAppSelector((s) => s.theme.isDarkMode)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative rounded-lg overflow-hidden border border-border text-sm">
      <button
        onClick={handleCopy}
        className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-md
          bg-surface/80 backdrop-blur-sm border border-border
          text-text-muted hover:text-text-base transition-theme"
        title="Copiar código"
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>
      <SyntaxHighlighter
        language={language}
        style={isDarkMode ? oneDark : oneLight}
        customStyle={{ margin: 0, padding: '1rem', fontSize: '0.8rem', lineHeight: '1.6' }}
        wrapLongLines
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  )
}
