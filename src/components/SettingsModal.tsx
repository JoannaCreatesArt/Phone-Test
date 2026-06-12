import { useState } from 'react'
import { useStore } from '../store/useStore'

interface Props {
  onClose: () => void
}

export default function SettingsModal({ onClose }: Props) {
  const { apiKey, setApiKey } = useStore()
  const [draft, setDraft] = useState(apiKey)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setApiKey(draft.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Settings</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="settings-section">
            <h3 className="settings-section-title">Claude API</h3>
            <p className="settings-desc">
              Add your Anthropic API key to power Bramble with AI-generated encouragement.
              Your key is stored locally and never sent anywhere except the Anthropic API.
            </p>
            <label className="settings-label">API Key</label>
            <input
              className="settings-input"
              type="password"
              placeholder="sk-ant-..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              spellCheck={false}
            />
            {draft && !draft.startsWith('sk-ant-') && (
              <p className="settings-hint settings-hint--warn">
                Anthropic API keys usually start with "sk-ant-"
              </p>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className="btn btn-primary" onClick={handleSave}>
                {saved ? 'Saved!' : 'Save Key'}
              </button>
              {apiKey && (
                <button className="btn btn-ghost" onClick={() => { setDraft(''); setApiKey('') }}>
                  Remove
                </button>
              )}
            </div>
            <p className="settings-hint">
              Get your API key at{' '}
              <a
                href="https://console.anthropic.com/keys"
                onClick={(e) => { e.preventDefault(); window.open('https://console.anthropic.com/keys') }}
              >
                console.anthropic.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
